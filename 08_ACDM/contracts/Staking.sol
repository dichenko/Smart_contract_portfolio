//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IDao {
    function unlockTime(address) external returns (uint);
}

contract Staking is AccessControl {
    bytes32 public constant DAO = keccak256("DAO");

    uint public rewardPercent = 3;
    uint public timeToLockLp = 5 days;

    struct Stake {
        uint timestamp;
        uint amount;
        uint lastWithdrawTime;
    }

    mapping(address => Stake) public stakes;

    uint public stakingValue;

    event Staked(address indexed staker, uint256 _amount);
    event Unstaked(address indexed staker, uint256 _amount);

    IERC20 lpToken;
    IERC20 rewardToken;

    IDao dao;
    address public daoAddress;

    constructor(address _lpAddress, address _rewardAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        lpToken = IERC20(_lpAddress);
        rewardToken = IERC20(_rewardAddress);
    }

      function setDao (address _daoAddress) external onlyRole(DEFAULT_ADMIN_ROLE){
        require(daoAddress == address(0), "Dao already setted");
        dao = IDao(_daoAddress);
        daoAddress = _daoAddress;
        _grantRole(DAO, _daoAddress);
    }


    ///@notice Transfers LP-tokens from caller balance to staking contract balance
    ///@param _amount of LP-tokens
    ///@custom:event Emits Stake event
    function stake(uint256 _amount) public {
        lpToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].lastWithdrawTime = block.timestamp;
        stakingValue += _amount;

        emit Staked(msg.sender, _amount);
    }

    ///@notice Transfers LP-tokens from staking contract  to caller balance, after locktime is up
    ///@custom:event Emits Unstake event
    function unstake() public {
        require(
            block.timestamp >= stakes[msg.sender].timestamp + timeToLockLp,
            "Time lock"
        );
        /// require tokens didnt participate in votings
        require(
            dao.unlockTime(msg.sender) <= block.timestamp,
            "Wait for debate period is up"
        );

        uint _amount = stakes[msg.sender].amount;
        lpToken.transfer(msg.sender, _amount);
        stakes[msg.sender].amount = 0;
        stakes[msg.sender].lastWithdrawTime = block.timestamp;
        stakingValue -= _amount;
        emit Unstaked(msg.sender, _amount);
    }

    ///@notice Transfers reward-tokens from staking contract  to caller balance, N percent every week
    function claim() public {
        require(
            block.timestamp - stakes[msg.sender].lastWithdrawTime >= 1 weeks,
            "Wait for 1 week"
        );
        uint week = 60 * 60 * 24 * 7;
        uint passedTime = block.timestamp - stakes[msg.sender].lastWithdrawTime;
        uint weeksCounter = passedTime / week;
        uint weekReward = (stakes[msg.sender].amount * rewardPercent) / 100;
        uint rewardAmount = weekReward * weeksCounter;
        rewardToken.transfer(msg.sender, rewardAmount);
        stakes[msg.sender].lastWithdrawTime = block.timestamp;
    }

    ///@notice Sets lock time for LP-tokens, only role: DAO
    function setTimeToLockLp(uint _time) public onlyRole(DAO) {
        timeToLockLp = _time;
    }

    ///@notice Sets address of DAO contract, only role: DEFAULT_ADMIN_ROLE
    function setDaoAddress(address _daoAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        daoAddress = _daoAddress;
    }

    ///@notice Returns account stake's amount
    ///@param _owner accounts owner
    function stakeAmount(address _owner) external view returns (uint) {
        return stakes[_owner].amount;
    }
}
