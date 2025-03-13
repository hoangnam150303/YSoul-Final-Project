// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract YS_Token is IERC20 {
    constructor() {
        _totalSupply = 1000000;
        _balances[msg.sender] = 1000000;
    }
    uint256 private _totalSupply;
    // mapping[address] => balance
    mapping(address => uint256) private _balances;
    // mapping[sender][spender] => allowance
    mapping(address => mapping(address => uint256)) private _allowances;
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address recipient,
        uint256 amount,
        uint256 timestamp,
        string memory data
    ) public override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount, timestamp, data);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount,
        uint256 timestamp,
        string memory data
    ) public override returns (bool) {
        require(_balances[sender] >= amount, "Insufficient balance");
        require(
            _allowances[sender][msg.sender] >= amount,
            "Insufficient allowance"
        );
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount, timestamp, data);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) public view override returns (uint256) {
        return _allowances[_owner][_spender];
    }

    function approve(
        address _spender,
        uint256 _value
    ) public override returns (bool) {
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
