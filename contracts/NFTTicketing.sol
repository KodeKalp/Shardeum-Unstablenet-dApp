// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTTicketing is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Event {
        uint256 id;
        string name;
        string description;
        string location;
        uint256 date;
        uint256 price;
        uint256 maxTickets;
        uint256 soldTickets;
        address organizer;
        bool active;
        string imageURI;
    }
    
    struct Ticket {
        uint256 eventId;
        uint256 ticketNumber;
        address owner;
        bool used;
        uint256 purchaseTime;
    }
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public eventTickets;
    mapping(address => uint256[]) public userTickets;
    
    uint256 public eventCounter;
    
    event EventCreated(uint256 indexed eventId, string name, address indexed organizer);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address indexed buyer);
    event TicketUsed(uint256 indexed tokenId, uint256 indexed eventId);
    
    constructor() ERC721("ShardeumTickets", "SHTIX") {}
    
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _location,
        uint256 _date,
        uint256 _price,
        uint256 _maxTickets,
        string memory _imageURI
    ) external returns (uint256) {
        require(_date > block.timestamp, "Event date must be in the future");
        require(_maxTickets > 0, "Max tickets must be greater than 0");
        
        eventCounter++;
        
        events[eventCounter] = Event({
            id: eventCounter,
            name: _name,
            description: _description,
            location: _location,
            date: _date,
            price: _price,
            maxTickets: _maxTickets,
            soldTickets: 0,
            organizer: msg.sender,
            active: true,
            imageURI: _imageURI
        });
        
        emit EventCreated(eventCounter, _name, msg.sender);
        return eventCounter;
    }
    
    function mintTicket(uint256 _eventId) external payable returns (uint256) {
        Event storage eventData = events[_eventId];
        require(eventData.active, "Event is not active");
        require(eventData.soldTickets < eventData.maxTickets, "Event is sold out");
        require(msg.value >= eventData.price, "Insufficient payment");
        require(block.timestamp < eventData.date, "Event has already started");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        tickets[tokenId] = Ticket({
            eventId: _eventId,
            ticketNumber: eventData.soldTickets + 1,
            owner: msg.sender,
            used: false,
            purchaseTime: block.timestamp
        });
        
        eventTickets[_eventId].push(tokenId);
        userTickets[msg.sender].push(tokenId);
        events[_eventId].soldTickets++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, eventData.imageURI);
        
        // Send payment to event organizer
        payable(eventData.organizer).transfer(msg.value);
        
        emit TicketMinted(tokenId, _eventId, msg.sender);
        return tokenId;
    }
    
    function useTicket(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender || msg.sender == events[tickets[_tokenId].eventId].organizer, "Not authorized");
        require(!tickets[_tokenId].used, "Ticket already used");
        
        tickets[_tokenId].used = true;
        emit TicketUsed(_tokenId, tickets[_tokenId].eventId);
    }
    
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }
    
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }
    
    function getEventTickets(uint256 _eventId) external view returns (uint256[] memory) {
        return eventTickets[_eventId];
    }
    
    function getAllEvents() external view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](eventCounter);
        for (uint256 i = 1; i <= eventCounter; i++) {
            allEvents[i - 1] = events[i];
        }
        return allEvents;
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
