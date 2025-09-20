import { ethers } from "ethers"
import { getSigner, getProvider } from "./web3"

// Contract ABIs (simplified for key functions)
export const PAYMENT_CONTRACT_ABI = [
  "function sendPayment(address payable _to, string memory _message) external payable",
  "function getUserPayments(address _user) external view returns (tuple(address from, address to, uint256 amount, uint256 timestamp, string message)[])",
  "function getUserStats(address _user) external view returns (uint256 sent, uint256 received, uint256 transactionCount)",
  "event PaymentSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp)",
]

export const NFT_TICKETING_ABI = [
  "function createEvent(string memory _name, string memory _description, string memory _location, uint256 _date, uint256 _price, uint256 _maxTickets, string memory _imageURI) external returns (uint256)",
  "function mintTicket(uint256 _eventId) external payable returns (uint256)",
  "function getEvent(uint256 _eventId) external view returns (tuple(uint256 id, string name, string description, string location, uint256 date, uint256 price, uint256 maxTickets, uint256 soldTickets, address organizer, bool active, string imageURI))",
  "function getAllEvents() external view returns (tuple(uint256 id, string name, string description, string location, uint256 date, uint256 price, uint256 maxTickets, uint256 soldTickets, address organizer, bool active, string imageURI)[])",
  "function getUserTickets(address _user) external view returns (uint256[])",
  "event EventCreated(uint256 indexed eventId, string name, address indexed organizer)",
  "event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address indexed buyer)",
]

export const VOTING_CONTRACT_ABI = [
  "function createProposal(string memory _title, string memory _description, uint256 _votingPeriod) external returns (uint256)",
  "function vote(uint256 _proposalId, bool _support, string memory _reason) external",
  "function getProposal(uint256 _proposalId) external view returns (tuple(uint256 id, string title, string description, address proposer, uint256 startTime, uint256 endTime, uint256 yesVotes, uint256 noVotes, bool executed, bool active))",
  "function getActiveProposals() external view returns (tuple(uint256 id, string title, string description, address proposer, uint256 startTime, uint256 endTime, uint256 yesVotes, uint256 noVotes, bool executed, bool active)[])",
  "function getVotingStats(uint256 _proposalId) external view returns (uint256 totalVotes, uint256 yesVotes, uint256 noVotes, uint256 yesPercentage, uint256 timeLeft)",
  "event ProposalCreated(uint256 indexed proposalId, string title, address indexed proposer)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support)",
]

// Contract addresses (from deployments.json)
export const CONTRACT_ADDRESSES = {
  PAYMENT: "0x742d35Cc6634C0532925a3b8D0C9964C6634C6C87",
  NFT_TICKETING: "0x1234567890123456789012345678901234567890",
  VOTING: "0x9876543210987654321098765432109876543210",
}

// Contract instances
export const getPaymentContract = async () => {
  const signer = await getSigner()
  if (!signer) throw new Error("No signer available")
  return new ethers.Contract(CONTRACT_ADDRESSES.PAYMENT, PAYMENT_CONTRACT_ABI, signer)
}

export const getNFTTicketingContract = async () => {
  const signer = await getSigner()
  if (!signer) throw new Error("No signer available")
  return new ethers.Contract(CONTRACT_ADDRESSES.NFT_TICKETING, NFT_TICKETING_ABI, signer)
}

export const getVotingContract = async () => {
  const signer = await getSigner()
  if (!signer) throw new Error("No signer available")
  return new ethers.Contract(CONTRACT_ADDRESSES.VOTING, VOTING_CONTRACT_ABI, signer)
}

// Read-only contract instances for viewing data
export const getPaymentContractReadOnly = () => {
  const provider = getProvider()
  if (!provider) throw new Error("No provider available")
  return new ethers.Contract(CONTRACT_ADDRESSES.PAYMENT, PAYMENT_CONTRACT_ABI, provider)
}

export const getNFTTicketingContractReadOnly = () => {
  const provider = getProvider()
  if (!provider) throw new Error("No provider available")
  return new ethers.Contract(CONTRACT_ADDRESSES.NFT_TICKETING, NFT_TICKETING_ABI, provider)
}

export const getVotingContractReadOnly = () => {
  const provider = getProvider()
  if (!provider) throw new Error("No provider available")
  return new ethers.Contract(CONTRACT_ADDRESSES.VOTING, VOTING_CONTRACT_ABI, provider)
}

// Utility functions for contract interactions
export const formatEther = (value: bigint) => {
  return ethers.formatEther(value)
}

export const parseEther = (value: string) => {
  return ethers.parseEther(value)
}

export const formatTimestamp = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString()
}
