// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventTicketNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Event {
        string name;
        string description;
        string location;
        uint256 eventDate;
        uint256 price;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
        address organizer;
    }
    
    struct Ticket {
        uint256 eventId;
        address owner;
        bool isUsed;
        uint256 mintedAt;
    }
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => uint256[]) public eventTickets;
    
    uint256 public eventCounter;
    
    event EventCreated(uint256 indexed eventId, string name, address organizer);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address to);
    event TicketUsed(uint256 indexed tokenId);
    
    constructor() ERC721("EventTicketNFT", "ETNFT") {}
    
    function createEvent(
        string memory name,
        string memory description,
        string memory location,
        uint256 eventDate,
        uint256 price,
        uint256 maxSupply
    ) public returns (uint256) {
        require(eventDate > block.timestamp, "Event date must be in the future");
        require(maxSupply > 0, "Max supply must be greater than 0");
        
        uint256 eventId = eventCounter++;
        
        events[eventId] = Event({
            name: name,
            description: description,
            location: location,
            eventDate: eventDate,
            price: price,
            maxSupply: maxSupply,
            currentSupply: 0,
            isActive: true,
            organizer: msg.sender
        });
        
        emit EventCreated(eventId, name, msg.sender);
        return eventId;
    }
    
    function mintTicket(uint256 eventId) public payable returns (uint256) {
        Event storage event_ = events[eventId];
        require(event_.isActive, "Event is not active");
        require(event_.currentSupply < event_.maxSupply, "Event is sold out");
        require(msg.value >= event_.price, "Insufficient payment");
        require(block.timestamp < event_.eventDate, "Event has already occurred");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        
        tickets[tokenId] = Ticket({
            eventId: eventId,
            owner: msg.sender,
            isUsed: false,
            mintedAt: block.timestamp
        });
        
        userTickets[msg.sender].push(tokenId);
        eventTickets[eventId].push(tokenId);
        event_.currentSupply++;
        
        // Transfer payment to event organizer
        payable(event_.organizer).transfer(msg.value);
        
        emit TicketMinted(tokenId, eventId, msg.sender);
        return tokenId;
    }
    
    function markTicketUsed(uint256 tokenId) public {
        require(_exists(tokenId), "Ticket does not exist");
        require(ownerOf(tokenId) == msg.sender || events[tickets[tokenId].eventId].organizer == msg.sender, "Not authorized");
        require(!tickets[tokenId].isUsed, "Ticket already used");
        
        tickets[tokenId].isUsed = true;
        emit TicketUsed(tokenId);
    }
    
    function getUserTickets(address user) public view returns (uint256[] memory) {
        return userTickets[user];
    }
    
    function getEventTickets(uint256 eventId) public view returns (uint256[] memory) {
        return eventTickets[eventId];
    }
    
    function getEvent(uint256 eventId) public view returns (Event memory) {
        return events[eventId];
    }
    
    function getTicket(uint256 tokenId) public view returns (Ticket memory) {
        return tickets[tokenId];
    }
    
    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](eventCounter);
        for (uint256 i = 0; i < eventCounter; i++) {
            allEvents[i] = events[i];
        }
        return allEvents;
    }
    
    function setEventActive(uint256 eventId, bool isActive) public {
        require(events[eventId].organizer == msg.sender, "Only organizer can modify event");
        events[eventId].isActive = isActive;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
