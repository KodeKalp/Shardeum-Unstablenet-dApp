// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PaymentContract {
    event PaymentSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    event PaymentReceived(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    
    struct Payment {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    mapping(address => Payment[]) public userPayments;
    mapping(address => uint256) public totalSent;
    mapping(address => uint256) public totalReceived;
    
    function sendPayment(address payable _to, string memory _message) external payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(_to != address(0), "Invalid recipient address");
        require(_to != msg.sender, "Cannot send payment to yourself");
        
        Payment memory newPayment = Payment({
            from: msg.sender,
            to: _to,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });
        
        userPayments[msg.sender].push(newPayment);
        userPayments[_to].push(newPayment);
        
        totalSent[msg.sender] += msg.value;
        totalReceived[_to] += msg.value;
        
        _to.transfer(msg.value);
        
        emit PaymentSent(msg.sender, _to, msg.value, block.timestamp);
        emit PaymentReceived(msg.sender, _to, msg.value, block.timestamp);
    }
    
    function getUserPayments(address _user) external view returns (Payment[] memory) {
        return userPayments[_user];
    }
    
    function getUserStats(address _user) external view returns (uint256 sent, uint256 received, uint256 transactionCount) {
        return (totalSent[_user], totalReceived[_user], userPayments[_user].length);
    }
}
