// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bridge {
    IERC20 erc20;
    address public validator;
    mapping(address => uint) nonceCounter;
    mapping(bytes32 => bool) finishedTransactions;

    event SwapInitialized(
        address initiator,
        address recipient,
        uint chainID,
        uint amount,
        uint nonce
    );

    event RedeemFinished(
        address initiator,
        address recipient,
        uint amount,
        uint nonce
    );

    constructor(address _erc20Token, address _validator) {
        erc20 = IERC20(_erc20Token);
        validator = _validator;
    }

    function swap(
        address _recipient,
        uint _chainID,
        uint _amount
    ) external {
        erc20.burn(msg.sender, _amount);
        emit SwapInitialized(
            msg.sender,
            _recipient,
            _chainID,
            _amount,
            nonceCounter[msg.sender]
        );
        nonceCounter[msg.sender] += 1;
    }

    function redeem(
        address initiator,
        address recipient,
        uint amount,
        uint nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {

    }

    function setValidator(address _newValidator) external onlyOwner{
        validator = _newValidator;
    }
}
