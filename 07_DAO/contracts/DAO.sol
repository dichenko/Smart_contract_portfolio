//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAO{

    uint public debatePeriod = 3 days;
    uint public quorumPercent = 10;

    mapping (address => uint96) unlockTime;
    mapping (address => uint) deposit;

    Voting {
        uint96 startTime;
        address initiator;
        address recipient;
        

    }

    event VotingStarted(uint id, uint starttime, address recipient, bytes4 signature);
    event VotingFinished(uint id, uint optionID);
}