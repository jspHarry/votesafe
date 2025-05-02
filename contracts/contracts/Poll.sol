// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
 
contract Poll {

    event VoteCast(address indexed voter, uint256 indexed optionIndex);
    event ResultsCalculated(uint256[] results);

    string public title;
    string public description;
    address public owner;
    string[] public options;
    mapping(uint => uint) public votes; // optionIndex => number of votes
    mapping(address => bool) public hasVoted;

    uint public startTime;
    uint public endTime;

    constructor(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint _startTime,
        uint _endTime,
        address _owner
    ) {
        require(_options.length >= 2, "At least 2 options needed.");
        require(_startTime < _endTime, "Invalid voting period.");

        title = _title;
        description = _description;
        options = _options;
        startTime = _startTime;
        endTime = _endTime;
        owner = _owner;
    }

    modifier onlyDuringVoting() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not active.");
        _;
    }

    modifier onlyOnce() {
        require(!hasVoted[msg.sender], "You have already voted.");
        _;
    }
    

    modifier onlyAfterVoting() {
        require(block.timestamp > endTime, "Results are not available yet.");
        _;
    }

    function vote(uint256 _optionIndex) external onlyDuringVoting onlyOnce {
    votes[_optionIndex]++;
    hasVoted[msg.sender] = true;
    emit VoteCast(msg.sender, _optionIndex); // Anonymous through event indexing
}

    function getOptions() public view returns (string[] memory) {
        return options;
    }

    // Add this function to your contract
function getResults() public view returns (uint256[] memory) {
    uint256[] memory results = new uint256[](options.length);
    for (uint256 i = 0; i < options.length; i++) {
        results[i] = votes[i];
    }
    return results;
}

// Modify the existing calculateResults function (remove onlyAfterVoting)
function calculateResults() external {
    require(block.timestamp > endTime, "Voting period has not ended");
    uint256[] memory results = new uint256[](options.length);
    for (uint256 i = 0; i < options.length; i++) {
        results[i] = votes[i];
    }
    emit ResultsCalculated(results);
}

}
