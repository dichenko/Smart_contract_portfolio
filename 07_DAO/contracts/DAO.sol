//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAO is AccessControl {
    IERC20 erc20;
    bytes32 public constant CHAIRMAN = keccak256("CHAIRMAN");

    uint public debatePeriod = 3 days;
    uint public quorumPercent = 51;

    mapping(address => uint) unlockTime;
    mapping(address => uint) depositAmount;
    mapping(bytes32 => bool) currentVotings;

    struct Voting {
        bool finished;
        uint startTime;
        address initiator;
        address recipient;
        bytes32 signature;
        uint[2] votesCounter;
    }

    Voting[] votings;

    event VotingStarted(
        uint id,
        uint starttime,
        address recipient,
        bytes32 signature
    );
    event VotingFinished(uint id, uint optionID);

    constructor(address _chairman, address _erc20Address) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CHAIRMAN, _chairman);
        erc20 = IERC20(_erc20Address);
    }

    /// @notice Add proposal for new voting
    /// @param _recipient address of recipien contract
    /// @param _signature signature of called function
    /// @custom:emit VotingStarted event
    function addProposal(address _recipient, bytes32 _signature)
        external
        onlyRole(CHAIRMAN)
    {
        votings.push(
            Voting(
                false,
                block.timestamp,
                msg.sender,
                _recipient,
                _signature,
                [uint(0), uint(0)]
            )
        );

        emit VotingStarted(
            votings.length - 1,
            block.timestamp,
            _recipient,
            _signature
        );
    }

    /// @notice Deposit DAO tokens from user to DAO contract
    /// @param _amount amount of deposit
    function deposit(uint _amount) external {
        require(erc20.balanceOf(msg.sender) >= _amount, "Not enough tokens");
        require(
            erc20.allowance(msg.sender, address(this)) >= _amount,
            "Not allowed"
        );
        erc20.transferFrom(msg.sender, address(this), _amount);
        depositAmount[msg.sender] += _amount;
        unlockTime[msg.sender] = block.timestamp + debatePeriod;
    }
    /// @notice withdraw  all deposited tokens from DAO
    function withdraw() external {
        require(depositAmount[msg.sender] > 0, "Nothind to withdraw");
        require(block.timestamp >= unlockTime[msg.sender], "Stil locked");
        erc20.transfer(msg.sender, depositAmount[msg.sender]);
        depositAmount[msg.sender] = 0;
    }
}
