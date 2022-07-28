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
    mapping(uint => mapping(address => bool)) voters;

    struct Voting {
        bool finished;
        uint startTime;
        address initiator;
        address recipient;
        bytes signature;
        uint[2] votesCounter;
    }

    Voting[] public votings;

    event VotingStarted(
        uint id,
        uint starttime,
        address recipient,
        bytes signature
    );
    event VotingFinished(uint id, uint optionID);
    event Voted(address voter, uint id, uint option, uint amount);

    constructor(address _erc20Address) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CHAIRMAN, msg.sender);
        erc20 = IERC20(_erc20Address);
    }

    /// @notice Add proposal for new voting
    /// @param _recipient address of recipien contract
    /// @param _signature signature of called function
    /// @custom:emit VotingStarted event
    function addProposal(address _recipient, bytes calldata _signature)
        external
        onlyRole(CHAIRMAN)
    {
        bytes32 hash = keccak256(abi.encodePacked(_recipient, _signature));
        require(!currentVotings[hash], "Proposal already added");
        currentVotings[hash] = true;

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
    }

    /// @notice Withdraw all deposited tokens from DAO
    function withdraw() external {
        require(depositAmount[msg.sender] > 0, "Nothind to withdraw");
        require(block.timestamp >= unlockTime[msg.sender], "Stil locked");
        erc20.transfer(msg.sender, depositAmount[msg.sender]);
        depositAmount[msg.sender] = 0;
    }

    /// @notice Vote for proposal id, option id
    /// @param _id id of voting
    /// @param _option option pro/contra - 1/0
    /// @custom:emit VotingFinished event
    function vote(uint _id, uint _option) external {
        require(!voters[_id][msg.sender], "Already voted");
        require(
            depositAmount[msg.sender] > 0,
            "Need deposit tokens before vote"
        );
        require(_id < votings.length, "Voting doesnt exist");
        require(!votings[_id].finished, "Voting already finished");
        require(
            votings[_id].startTime + debatePeriod > block.timestamp,
            "Debate period is up"
        );
        voters[_id][msg.sender] = true;
        votings[_id].votesCounter[_option] += depositAmount[msg.sender];
        unlockTime[msg.sender] = block.timestamp + debatePeriod;
        emit Voted(msg.sender, _id, _option, depositAmount[msg.sender]);
    }

    /// @notice Finish voting
    /// @param _id of voting
    /// @custom:emit Voted event
    function finish(uint _id) external {
        require(
            block.timestamp >= votings[_id].startTime + debatePeriod,
            "The debate period is not over yet"
        );

        require(!votings[_id].finished, "This voting already finished");

        votings[_id].finished = true;

        bytes32 hash = keccak256(
            abi.encodePacked(votings[_id].recipient, votings[_id].signature)
        );
        currentVotings[hash] = false;
        uint optionID = 0;
        if (
            votings[_id].votesCounter[1] > votings[_id].votesCounter[0] &&
            votings[_id].votesCounter[0] + votings[_id].votesCounter[1] >=
            (erc20.totalSupply() * quorumPercent) / 100
        ) {
            address recip = votings[_id].recipient;
            bytes memory sig = votings[_id].signature;

            (bool success, ) = recip.call{value: 0}(sig);
            require(success, "Incorrect signature");
            optionID = 1;
        }
        emit VotingFinished(_id, optionID);
    }
}
