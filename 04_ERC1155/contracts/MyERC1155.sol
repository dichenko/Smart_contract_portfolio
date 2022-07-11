// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract MyERC1155 is ERC1155, Ownable, ERC1155Supply {
    string public name = "Back to UUSR";
    string public symbol = "BTUUSR";

    uint256 public constant SOAP = 1;
    uint256 public constant TEA = 2;
    uint256 public constant SALT = 3;
    uint256 public constant TOBACCO = 4;
    uint256 public constant MOSKVITCH = 5;

    constructor()
        ERC1155(
            "ipfs://bafybeifzevbg2cep55zeahf2euax46p3lkdfk3gtlwcyoxoyxqb66pbn7e/{id}.json"
        )
    {
        _mint(msg.sender, SOAP, 1000, "");
        _mint(msg.sender, TEA, 100000, "");
        _mint(msg.sender, SALT, 1000000, "");
        _mint(msg.sender, TOBACCO, 1000, "");
        _mint(msg.sender, MOSKVITCH, 1, "");
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
