// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//deployed to 0xDb8310475E7559Fe3548b936a309Bd402fa2eE9D

/// @title Custom ERC20 token with mint and burn implementation
/// @author M. Dichenko
/// @dev All function except _mint and _burn are  EIP-20 standart
contract MyERC20 {
    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) internal allowed;

    uint8 public decimals;
    address public owner;
    string public name;
    string public symbol;
    uint256 public totalSupply;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _decimals,
        uint256 _initialAmount
    ) {
        owner = msg.sender;
        name = _tokenName;
        symbol = _tokenSymbol;
        decimals = _decimals;
        totalSupply = _initialAmount;
        balances[msg.sender] = _initialAmount;
        emit Transfer(address(0), msg.sender, _initialAmount);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not an owner");
        _;
    }
    /// Event Transfer
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    ///Event Approval
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    ///@dev Returns the amount of tokens owned by `account`.
    ///@param _user account address
    ///@return uint256 balance of account
    function balanceOf(address _user) public view returns (uint256) {
        return balances[_user];
    }

    ///@dev Moves `amount` tokens from the caller's account to `recipient`.
    ///@param _to address
    ///@param _value uint256
    ///@return success bool a boolean value indicating whether the operation succeeded.
    ///@custom:emit  a Transfer event.
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balances[msg.sender] >= _value, "Not enough tokens");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    ///@dev Moves `amount` tokens from the 'spender' account to `recipient`.
    ///@param _from addres
    ///@param _to address
    ///@param _value uint256
    ///@return success bool - a boolean value indicating whether the operation succeeded.
    ///@custom:emit a Transfer event.
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(allowed[_from][msg.sender] >= _value, "Not approved");
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    ///@dev Allows _spender to withdraw from your account multiple times, up to the _value amount.
    ///@param _spender address
    ///@param _value amount
    ///@return success bool - a boolean value indicating whether the operation succeeded.
    ///@custom:emit a Approval event.
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    ///@dev Returns the amount which _spender is still allowed to withdraw from _owner
    ///@param _owner address
    ///@param _spender address
    ///@return remaining amount.
    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }

    ///@dev Create _value amount of new tokens and transfer them to owner balance
    ///@param _value amount
    ///@return success bool - a boolean value indicating whether the operation succeeded.
    ///@custom:emit a Transfer event.
    function mint(uint256 _value) public onlyOwner returns (bool success) {
        balances[owner] += _value;
        totalSupply += _value;
        emit Transfer(address(0), owner, _value);
        return true;
    }

    ///@dev Transfer _value amount of tokens from owner balance to zero address (burns it)
    ///@param _value amount
    ///@return success bool - a boolean value indicating whether the operation succeeded.
    ///@custom:emit a Transfer event.
    function burn(uint256 _value) public onlyOwner returns (bool success) {
        balances[owner] -= _value;
        totalSupply -= _value;
        emit Transfer(owner, address(0), _value);
        return true;
    }
}
