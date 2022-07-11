// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
//import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
//import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is AccessControl {
    IERC20 erc20;
    IERC721 nft721;
    IERC1155 nft1155;

    bytes32 public constant CREATOR = keccak256("CREATOR");

    constructor(
        address _erc20,
        address _nft721,
        address _nft1155,
        address _creator
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(CREATOR, _creator);
        erc20 = IERC20(_erc20);
        nft721 = IERC721(_nft721);
        nft1155 = IERC1155(_nft1155);
    }


}
