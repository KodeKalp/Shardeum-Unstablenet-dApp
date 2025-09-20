// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        bool active;
    }
    
    struct Vote {
        address voter;
        uint256 proposalId;
        bool support;
        uint256 timestamp;
        string reason;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => Vote[]) public userVotes;
    mapping(uint256 => Vote[]) public proposalVotes;
    
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTING_PERIOD = 1 days;
    
    event ProposalCreated(uint256 indexed proposalId, string title, address indexed proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _votingPeriod
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_votingPeriod >= MIN_VOTING_PERIOD, "Voting period too short");
        require(_votingPeriod <= VOTING_PERIOD, "Voting period too long");
        
        proposalCounter++;
        
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: _title,
            description: _description,
            proposer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _votingPeriod,
            yesVotes: 0,
            noVotes: 0,
            executed: false,
            active: true
        });
        
        emit ProposalCreated(proposalCounter, _title, msg.sender);
        return proposalCounter;
    }
    
    function vote(uint256 _proposalId, bool _support, string memory _reason) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active, "Proposal is not active");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");
        
        hasVoted[_proposalId][msg.sender] = true;
        
        if (_support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        Vote memory newVote = Vote({
            voter: msg.sender,
            proposalId: _proposalId,
            support: _support,
            timestamp: block.timestamp,
            reason: _reason
        });
        
        userVotes[msg.sender].push(newVote);
        proposalVotes[_proposalId].push(newVote);
        
        emit VoteCast(_proposalId, msg.sender, _support);
    }
    
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active, "Proposal is not active");
        require(block.timestamp > proposal.endTime, "Voting is still ongoing");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        proposal.active = false;
        
        bool passed = proposal.yesVotes > proposal.noVotes;
        emit ProposalExecuted(_proposalId, passed);
    }
    
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCounter);
        for (uint256 i = 1; i <= proposalCounter; i++) {
            allProposals[i - 1] = proposals[i];
        }
        return allProposals;
    }
    
    function getActiveProposals() external view returns (Proposal[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= proposalCounter; i++) {
            if (proposals[i].active && block.timestamp <= proposals[i].endTime) {
                activeCount++;
            }
        }
        
        Proposal[] memory activeProposals = new Proposal[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= proposalCounter; i++) {
            if (proposals[i].active && block.timestamp <= proposals[i].endTime) {
                activeProposals[index] = proposals[i];
                index++;
            }
        }
        return activeProposals;
    }
    
    function getUserVotes(address _user) external view returns (Vote[] memory) {
        return userVotes[_user];
    }
    
    function getProposalVotes(uint256 _proposalId) external view returns (Vote[] memory) {
        return proposalVotes[_proposalId];
    }
    
    function getVotingStats(uint256 _proposalId) external view returns (
        uint256 totalVotes,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 yesPercentage,
        uint256 timeLeft
    ) {
        Proposal memory proposal = proposals[_proposalId];
        totalVotes = proposal.yesVotes + proposal.noVotes;
        yesVotes = proposal.yesVotes;
        noVotes = proposal.noVotes;
        
        if (totalVotes > 0) {
            yesPercentage = (yesVotes * 100) / totalVotes;
        } else {
            yesPercentage = 0;
        }
        
        if (block.timestamp < proposal.endTime) {
            timeLeft = proposal.endTime - block.timestamp;
        } else {
            timeLeft = 0;
        }
        
        return (totalVotes, yesVotes, noVotes, yesPercentage, timeLeft);
    }
}
