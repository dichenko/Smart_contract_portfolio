//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IACDM_TOKEN {
    function mint(uint256 _amount) external;

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function burn(uint _amount) external;

    function balanceOf(address account) external view returns (uint256);
    //function decimals() external returns (uint8);
}

contract ACDMplatform is AccessControl {
    bytes32 public constant DAO = keccak256("DAO");

    bool started;
    IACDM_TOKEN acdmToken;
    uint[2] saleRoundReferRewards = [50, 30];
    uint[2] tradeRoundReferRewards = [25, 25];
    uint commonSaleRoundReferPercent = 80;
    uint commonTradeRoundReferPercent = 50;
    uint public referralRewardBank;
    uint roundDuration = 3 days;
    uint tradeRoundVolume = 1 ether;
    uint lastPrice = 10000000;
    uint acdmEmission = 100000;
    uint roundStartTime;
    uint acdmTokenDecimals;

    struct Order {
        bool executed;
        address payable seller;
        uint amount;
        uint price;
    }

    Order[] public orders;

    event OrderPlaced(uint id, uint amount, uint price);
    event OrderExecuted(uint _id);
    event OrderUpdated(uint _id, uint amount);
    event OrderRemoved(uint _id);

    enum Status {
        Pending,
        Sale,
        Trade
    }

    Status public status;

    mapping(address => address) public refers;
    mapping(address => bool) public registered;

    modifier onlySaleRound() {
        require(status == Status.Sale, "Not sale round");
        _;
    }
    modifier onlyTradeRound() {
        require(status == Status.Trade, "Not trade round");
        _;
    }

    constructor(address _acdmToken) {
        acdmToken = IACDM_TOKEN(_acdmToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        //acdmTokenDecimals = acdmToken.decimals();
    }

    ///@notice Start platform and first sale round
    function startPlatform() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(status == Status.Pending, "Already started");

        roundStartTime = block.timestamp;
        acdmToken.mint(acdmEmission);
        status = Status.Sale;
    }

    ///@notice Buy acdm token with ETH during Sale round
    function buyAcdm() external payable onlySaleRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Sale round time expired"
        );
        require(msg.value > lastPrice, "Not enough ether to buy token");
        acdmToken.transfer(msg.sender, msg.value / lastPrice);
        _transferSaleReferReward(msg.sender, msg.value);
    }

    function startSaleRound() external onlyTradeRound {
        require(
            roundStartTime + 3 days <= block.timestamp,
            "Trade round is not over yet"
        );
        _updateTokenPrice();
        acdmEmission = tradeRoundVolume / lastPrice;
        acdmToken.mint(acdmEmission);
        roundStartTime = block.timestamp;
        status = Status.Sale;
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
        status = Status.Trade;
    }

    ///@notice Add order during Trade Round
    function addOrder(uint _amount, uint _price) external onlyTradeRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );
        acdmToken.transferFrom(msg.sender, address(this), _amount);
        orders.push(Order(false, payable(msg.sender), _amount, _price));
        emit OrderPlaced(orders.length - 1, _amount, _price);
    }

    ///@notice redeem order during the Trade Round
    function redeemOrder(uint _id) external payable onlyTradeRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );
        Order storage order = orders[_id];
        require(!order.executed, "Order executed");
        uint amount = msg.value / order.price;
        require(order.amount >= amount, "Not enough tokens");
        acdmToken.transfer(msg.sender, amount);
        order.amount -= amount;
        if (order.amount == 0) {
            order.executed = true;
            emit OrderExecuted(_id);
        } else {
            emit OrderUpdated(_id, order.amount);
        }
        tradeRoundVolume += amount;
        payable(order.seller).transfer(
            (msg.value * (1000 - commonTradeRoundReferPercent)) / 1000
        );
        _transferTradeeReferReward(order.seller, msg.value);
    }

    ///@notice remove caller's order
    function removeOrder(uint _id) external onlyTradeRound {
        require(
            roundStartTime + 3 days >= block.timestamp,
            "Trade round time is over"
        );
        Order storage order = orders[_id];
        require(order.seller == msg.sender, "You are not a seller");
        order.executed = true;
        acdmToken.transfer(msg.sender, order.amount);
        emit OrderRemoved(_id);
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
        lastPrice = (lastPrice * 103) / 100 + 4000000000000;
        //@FIX
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint balanceToWithdraw = address(this).balance - referralRewardBank;
        payable(msg.sender).transfer(balanceToWithdraw);
    }
}
