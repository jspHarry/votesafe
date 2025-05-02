// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Poll.sol";

contract PollFactory {
    address[] public allPolls;
    mapping(address => address[]) public pollsByCreator;

    event PollCreated(address indexed pollAddress, address indexed creator);

    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint _startTime,
        uint _endTime
    ) external {
        Poll newPoll = new Poll(
            _title,
            _description,
            _options,
            _startTime,
            _endTime,
            msg.sender
        );
        allPolls.push(address(newPoll));

        address pollAddress = address(newPoll);
        require(pollAddress != address(0), "Poll creation failed: invalid address");

        allPolls.push(pollAddress);
        pollsByCreator[msg.sender].push(pollAddress);

        emit PollCreated(pollAddress, msg.sender);
    }

    function getAllPolls() public view returns (address[] memory) {
        return allPolls;
    }
    

    function getPollsByCreator(address _creator) public view returns (address[] memory) {
        return pollsByCreator[_creator];
    }
}
