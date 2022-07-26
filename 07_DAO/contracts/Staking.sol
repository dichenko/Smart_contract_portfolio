//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    bytes32 public constant DAO = keccak256("DAO");

    uint public percent = 1150;
    uint public percentDecimals = 2;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
    }

    ///@notice Sets reward percent, onlyRole(DEFAULT_ADMIN_ROLE)
    function setPercent(uint16 _percent) public onlyRole(DAO) {
        percent = _percent;
    }

}
