//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
bytes32 public constant CHAIRMAN = keccak256("CHAIRMAN");

contract DAO{

    uint public debatePeriod = 3 days;
    uint public quorumPercent = 10;

    mapping (address => uint96) unlockTime;
    mapping (address => uint) deposit;

    Voting {
        bool finished;
        uint96 startTime;
        address initiator;
        address recipient;
        bytes4 signature;
        uint[2] votesCounter; 
    }

    Voting[] votings;

    event VotingStarted(uint id, uint starttime, address recipient, bytes4 signature);
    event VotingFinished(uint id, uint optionID);

    constructor (address _chairman){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CHAIRMAN, _chairman);
    }
}