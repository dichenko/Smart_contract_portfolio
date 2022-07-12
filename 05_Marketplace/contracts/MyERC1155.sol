// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyERC1155 is ERC1155, ERC1155Supply, AccessControl{
    string public name = "Back to USSR";
    string public symbol = "BTUSSR";
   
    bytes32 public constant CREATOR = keccak256(abi.encodePacked("CREATOR"));

    uint256 public constant TEST = 1;

    constructor()
        ERC1155(
            "ipfs://bafybeifzevbg2cep55zeahf2euax46p3lkdfk3gtlwcyoxoyxqb66pbn7e/{id}.json"
        )
    {
        _mint(msg.sender, TEST, 1000, "");
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
       
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(CREATOR) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(CREATOR)  {
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

       /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view override (AccessControl, ERC1155)  returns (bool) {
        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }

   

}
