// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ACDMToken is ERC20, AccessControl, ERC20Burnable {
    bytes32 public constant MINTER_BURNER = keccak256("MINTER_BURNER");

    constructor() ERC20("ACADM Coin", "ACDM") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MINTER_BURNER, DEFAULT_ADMIN_ROLE);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(uint256 _amount) public onlyRole(MINTER_BURNER) {
        _mint(msg.sender, _amount);
    }

    function burn(uint _amount) public override onlyRole(MINTER_BURNER) {
        _burn(_msgSender(), _amount);
    }
}
