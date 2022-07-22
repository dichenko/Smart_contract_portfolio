// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function mint(address to, uint amount) external;
    function burnFrom(address account, uint amount) external;
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Bridge is Ownable {
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

    constructor(address _erc20Address, address _validator) {
        erc20 = IERC20(_erc20Address);
        validator = _validator;
    }

    function swap(
        address _recipient,
        uint _chainID,
        uint _amount
    ) external {
        erc20.burnFrom(msg.sender, _amount);
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
        bytes32 message = keccak256(
            abi.encodePacked(initiator, recipient, amount, nonce)
        );
        address addr = ecrecover(hashMessage(message), v, r, s);
        require(addr == validator, "Invalid signer");
        require(!finishedTransactions[message], "Already redeemed");
        require(recipient == msg.sender, "Not a recipient");
        finishedTransactions[message] = true;
        erc20.mint(msg.sender, amount);
        emit RedeemFinished(initiator, recipient, amount, nonce);
    }

    function setValidator(address _newValidator) external onlyOwner {
        validator = _newValidator;
    }

    function hashMessage(bytes32 message) private pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(abi.encodePacked(prefix, message));
    }
}
