//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

interface IACDM_token {
    function balanceOf(address) external view returns (uint256);

    function burn(uint256) external;

    function decimals() external returns (uint8);

    function mint(uint256) external;

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);
}

contract ACDMPlatform is AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _orderIDs;

    IUniswapV2Router02 UniswapV2Router02 =
        IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    bytes32 public constant DAO = keccak256("DAO");

    bool started;
    IACDM_token acdmToken;
    ERC20Burnable xxxToken;
    uint[2] public saleRoundReferRewards = [50, 30];
    uint[2] public tradeRoundReferRewards = [25, 25];
    uint commonSaleRoundReferPercent = 80;
    uint commonTradeRoundReferPercent = 50;
    uint public referralRewardBank;
    uint roundDuration = 3 days;
    uint public tradeRoundVolume = 1 ether;
    uint public lastPrice = 10000000000000;
    uint denominationPrice = 10000000;
    uint public acdmEmission = 100000 * 10**6;
    uint roundStartTime;
    uint acdmTokenDecimals;

    enum OrderStatus {
        Placed,
        Redeemed,
        Canceled
    }

    struct Order {
        OrderStatus status;
        address seller;
        uint amount;
        uint price;
    }

    mapping(uint => Order) orders;

    event OrderPlaced(uint id, uint amount, uint price);
    event OrderRedeemed(uint _id);
    event OrderUpdated(uint _id, uint amount);
    event OrderCanceled(uint _id);

    enum PlatformStatus {
        Pending,
        Sale,
        Trade
    }

    PlatformStatus public status;

    mapping(address => address) public refers;
    mapping(address => bool) public registered;

    modifier onlySaleRound() {
        require(status == PlatformStatus.Sale, "Not sale round");
        _;
    }
    modifier onlyTradeRound() {
        require(status == PlatformStatus.Trade, "Not trade round");
        _;
    }

    constructor(address _acdmToken, address _xxxToken) {
        acdmToken = IACDM_token(_acdmToken);
        xxxToken = ERC20Burnable(_xxxToken);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        registered[msg.sender] = true;
    }

    ///@notice Start platform and first sale round
    function startPlatform() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(status == PlatformStatus.Pending, "Already started");

        roundStartTime = block.timestamp;
        acdmToken.mint(acdmEmission);
        status = PlatformStatus.Sale;
    }

    ///@notice Buy acdm token with ETH during Sale round
    function buyAcdm() external payable onlySaleRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Sale round time expired"
        );
        require(msg.value > denominationPrice, "Not enough ether to buy token");
        acdmToken.transfer(msg.sender, msg.value / denominationPrice);
        _transferSaleReferReward(msg.sender, msg.value);
    }

    function startSaleRound() external onlyTradeRound {
        require(
            roundStartTime + 3 days <= block.timestamp,
            "Trade round is not over yet"
        );
        _updateTokenPrice();

        acdmEmission = tradeRoundVolume / denominationPrice;
        acdmToken.mint(acdmEmission);
        roundStartTime = block.timestamp;
        status = PlatformStatus.Sale;
    }

    ///@notice Starts trade round if sale round time expired or sold out
    function startTradeRound() external onlySaleRound {
        require(
            ((roundStartTime + 3 days <= block.timestamp) ||
                (acdmToken.balanceOf(address(this)) == 0)),
            "Sale round is not over yet"
        );
        tradeRoundVolume = 0;
        roundStartTime = block.timestamp;
        status = PlatformStatus.Trade;
    }

    ///@notice Add order during Trade Round
    ///@param _amount of tokens in denomination
    ///@param _price of all tokens in wei
    function addOrder(uint _amount, uint _price) external onlyTradeRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );
        acdmToken.transferFrom(msg.sender, address(this), _amount);
        uint id = _orderIDs.current();
        orders[id] = (Order(OrderStatus.Placed, msg.sender, _amount, _price));
        emit OrderPlaced(id, _amount, _price);
        _orderIDs.increment();
    }

    ///@notice redeem order during the Trade Round
    function redeemOrder(uint _id) external payable onlyTradeRound {
        require(_id <= _orderIDs.current(), "Invalid order id");
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );

        Order storage order = orders[_id];
        require(order.status == OrderStatus.Placed, "Order executed");
        require(msg.value <= order.price, "Not enough tokens");

        uint priceForDenomination = order.price / order.amount;
        uint amount = msg.value / priceForDenomination;

        acdmToken.transfer(msg.sender, amount);
        order.amount -= amount;
        if (order.amount == 0) {
            order.status = OrderStatus.Redeemed;
            emit OrderRedeemed(_id);
        } else {
            emit OrderUpdated(_id, order.amount);
        }
        tradeRoundVolume += msg.value;
        payable(order.seller).transfer(
            (msg.value * (1000 - commonTradeRoundReferPercent)) / 1000
        );
        _transferTradeeReferReward(order.seller, msg.value);
    }

    ///@notice remove caller's order
    function removeOrder(uint _id) external onlyTradeRound {
        require(_id <= _orderIDs.current(), "Invalid order id");
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );
        Order storage order = orders[_id];
        require(order.seller == msg.sender, "You are not a seller");
        order.status = OrderStatus.Canceled;
        acdmToken.transfer(msg.sender, order.amount);
        emit OrderCanceled(_id);
    }

    ///@notice User registration
    function register(address _refer) external {
        require(registered[_refer], "Reffer not registered");
        registered[msg.sender] = true;
        refers[msg.sender] = _refer;
    }

    ///@notice  Deposits reffer rewards. Method called after each sale transaction.
    function _transferSaleReferReward(address _iniciator, uint _value) private {
        address currentRefer = refers[_iniciator];
        for (uint i = 0; i < saleRoundReferRewards.length; i++) {
            uint reward = (_value * saleRoundReferRewards[i]) / 1000;
            if ((currentRefer != _iniciator) && (currentRefer != address(0))) {
                payable(currentRefer).transfer(reward);
            } else {
                referralRewardBank += reward;
            }
            currentRefer = refers[currentRefer];
        }
    }

    ///@notice  Deposits reffer rewards. Method called after each trade transaction.
    function _transferTradeeReferReward(address _iniciator, uint _value)
        private
    {
        address currentRefer = refers[_iniciator];
        for (uint i = 0; i < tradeRoundReferRewards.length; i++) {
            uint reward = (_value * tradeRoundReferRewards[i]) / 1000;
            if ((currentRefer != _iniciator) && (currentRefer != address(0))) {
                payable(currentRefer).transfer(reward);
            } else {
                referralRewardBank += reward;
            }
            currentRefer = refers[currentRefer];
        }
    }

    ///@notice Sets new percent rate for reffer rewards in sale round
    function setSaleRoundReferRewards(uint _newPercent1, uint _newPercent2)
        external
        onlyRole(DAO)
    {
        saleRoundReferRewards[0] = _newPercent1;
        saleRoundReferRewards[1] = _newPercent2;
        commonSaleRoundReferPercent = _newPercent1 + _newPercent2;
    }

    ///@notice Sets new percent rate for reffer rewards in trade round
    function setTradeRoundReferRewards(uint _newPercent1, uint _newPercent2)
        external
        onlyRole(DAO)
    {
        tradeRoundReferRewards[0] = _newPercent1;
        tradeRoundReferRewards[1] = _newPercent2;
        commonTradeRoundReferPercent = _newPercent1 + _newPercent2;
    }

    ///@notice Change token price every saleRound
    function _updateTokenPrice() private {
        lastPrice = (lastPrice * 103) / 100 + 4_000_000_000_000;
        denominationPrice = lastPrice / 10**acdmToken.decimals();
    }

    function sendComissionToOwner() external onlyRole(DAO) {
        payable(msg.sender).transfer(referralRewardBank);
        referralRewardBank = 0;
    }

    function byXXXtokensAndBurn() external onlyRole(DAO) {
        
        address[] memory path = new address[](2);
        path[0] = UniswapV2Router02.WETH();
        path[1] = address(xxxToken);

        UniswapV2Router02.swapExactETHForTokens{value: referralRewardBank}(
            1,
            path,
            address(this),
            block.timestamp + 100
        );
        referralRewardBank = 0;
        uint amountTokens = xxxToken.balanceOf(address(this));
        xxxToken.burn(amountTokens);
    }

    function withdraw(address payable _to) external onlyRole(DEFAULT_ADMIN_ROLE){
        uint _amountToWithdraw = address(this).balance - referralRewardBank;
        _to.transfer(_amountToWithdraw);
    }
}
