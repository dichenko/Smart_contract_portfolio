// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bridge {
    IERC20 ierc20;
    mapping(address => uint) nonceCounter;
    mapping (bytes32 => bool) finishedTransactions;

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

    constructor(address _erc20Token) {
        ierc20 = IERC20(_erc20Token);
    }

    function swap(
        address _recipient,
        uint _chainID,
        uint _amount
    ) external {
        ierc20.burn(msg.sender, _amount);
        emit SwapInitialized(
            msg.sender,
            _recipient,
            _chainID,
            _amount,
            nonceCounter[msg.sender]
        );
        nonceCounter[msg.sender] += 1;
    }

    function redeem() external {

    }

    
}
