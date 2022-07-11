// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IERC721Mintable.sol";
import "./interfaces/IERC1155Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is AccessControl {
    IERC20 erc20;
    IERC721Mintable nft721;
    IERC1155Mintable nft1155;

    bytes32 public constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 public constant CREATOR = keccak256(abi.encodePacked("CREATOR"));

    //onlyRole(getRoleAdmin(role))

    constructor(
        address _erc20,
        address _nft721,
        address _nft1155,
        address _creator
    ) {
        _grantRole(ADMIN, msg.sender);
        _grantRole(CREATOR, _creator);

        erc20 = IERC20(_erc20);
        nft721 = IERC721Mintable(_nft721);
        nft1155 = IERC1155Mintable(_nft1155);
    }

    ///@notice Allow creator to mint new 721 NFT
    function mint721(address recipient, string memory _tokenURI)
        external
        onlyRole(CREATOR)
    {
        nft721.mint(recipient, _tokenURI);
    }

    ///@notice Allow creator to mint new 1155 NFT
    function mint1155(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyRole(CREATOR) {
        nft1155.mint(account, id, amount, data);
    }
}
