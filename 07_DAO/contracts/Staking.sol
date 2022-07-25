//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

    

contract Staking is AccessControl {
    bytes32 public constant DAO = keccak256("DAO");

    uint public percent = 1150;
    uint public percentDecimals = 2;
    uint public timeToLockLp = 20 minutes;
    uint public timeToLockReward = 10 minutes;
    

  struct Stake {
        uint timestamp;
        uint amount;
        uint rewardAmount;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed staker, uint256 _amount);
    event Unstaked(address indexed staker, uint256 _amount);

    IERC20 lpToken;
    IERC20 rewardToken;


    constructor(address _lpAddress, address _rewardAddress, address _dao) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DAO, _dao);
        lpToken = IERC20(_lpAddress);
        rewardToken = IERC20(_rewardAddress);
    }


    ///@notice Transfers LP-tokens from caller balance to staking contract balance
    ///@param _amount of LP-tokens
    ///@custom:event Emits Stake event
    function stake(uint256 _amount) public {
        lpToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].rewardAmount = _amount * percent / 100 ** percentDecimals;
        emit Staked(msg.sender, _amount);
    }

    ///@notice Transfers LP-tokens from staking contract  to caller balance, after locktime is up
    ///@custom:event Emits Unstake event
    function unstake() public {
        require(
            block.timestamp >= stakes[msg.sender].timestamp + timeToLockLp,
            "Time lock"
        );
        uint _amount = stakes[msg.sender].amount;
        lpToken.transfer(msg.sender, _amount);
        stakes[msg.sender].amount = 0;
        emit Unstaked(msg.sender, _amount);
    }

    ///@notice Transfers reward-tokens from staking contract  to caller balance, after locktime is up
    function claim() public {
        require(
            block.timestamp >= stakes[msg.sender].timestamp + timeToLockReward,
            "Time lock"
        );
        rewardToken.transfer(msg.sender, stakes[msg.sender].rewardAmount);
        stakes[msg.sender].rewardAmount = 0;
    }

    ///@notice Sets reward percent, onlyRole(DEFAULT_ADMIN_ROLE)
    function setPercent(uint16 _percent) public onlyRole(DEFAULT_ADMIN_ROLE) {
        percent = _percent;
    }

    ///@notice Sets lock time for LP-tokens, onlyRole(DEFAULT_ADMIN_ROLE)
    function setTimeToLockLp(uint _time) public onlyRole(DEFAULT_ADMIN_ROLE) {
        timeToLockLp = _time;
    }

    ///@notice Sets lock time for reward tokens, onlyRole(DEFAULT_ADMIN_ROLE)
    function setTimeToLockReward(uint _time) public onlyRole(DEFAULT_ADMIN_ROLE) {
        timeToLockReward = _time;
    }
}
