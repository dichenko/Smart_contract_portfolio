// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract XXXToken is Ownable, ERC20, ERC20Burnable {
   
    constructor() ERC20(" XXX Coin", "XXX") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

     function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

}