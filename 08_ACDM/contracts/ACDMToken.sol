// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ACADMToken is ERC20, Ownable, ERC20Burnable {
    constructor() ERC20("ACADM Coin", "ACDM") {
        _mint(msg.sender, 3 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

     function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}