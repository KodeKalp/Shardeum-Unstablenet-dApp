"use client"

import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { useWallet } from "./use-wallet"
import { getSigner } from "@/lib/web3"

const NFT_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87" // Replace with deployed address

const NFT_CONTRACT_ABI = [
  "function createEvent(string name, string description, string location, uint256 eventDate, uint256 price, uint256 maxSupply) returns (uint256)",
  "function mintTicket(uint256 eventId) payable returns (uint256)",
  "function markTicketUsed(uint256 tokenId)",
  "function getUserTickets(address user) view returns (uint256[])",
  "function getEventTickets(uint256 eventId) view returns (uint256[])",
  "function getEvent(uint256 eventId) view returns (tuple(string name, string description, string location, uint256 eventDate, uint256 price, uint256 maxSupply, uint256 currentSupply, bool isActive, address organizer))",
  "function getTicket(uint256 tokenId) view returns (tuple(uint256 eventId, address owner, bool isUsed, uint256 mintedAt))",
  "function getAllEvents() view returns (tuple(string name, string description, string location, uint256 eventDate, uint256 price, uint256 maxSupply, uint256 currentSupply, bool isActive, address organizer)[])",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "event EventCreated(uint256 indexed eventId, string name, address organizer)",
  "event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address to)",
  "event TicketUsed(uint256 indexed tokenId)",
]

interface Event {
  id: number
  name: string
  description: string
  location: string
  eventDate: Date
  price: string
  maxSupply: number
  currentSupply: number
  isActive: boolean
  organizer: string
}

interface UserTicket {
  tokenId: number
  eventId: number
  eventName: string
  eventDate: Date
  location: string
  isUsed: boolean
  mintedAt: Date
}

export function useNFTContract() {
  const { account, isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getContract = useCallback(async () => {
    if (!isConnected) throw new Error("Wallet not connected")

    const signer = await getSigner()
    if (!signer) throw new Error("No signer available")

    return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)
  }, [isConnected])

  const createEvent = useCallback(
    async (name: string, description: string, location: string, eventDate: Date, price: string, maxSupply: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const contract = await getContract()
        const eventDateTimestamp = Math.floor(eventDate.getTime() / 1000)
        const priceWei = ethers.parseEther(price)

        const tx = await contract.createEvent(name, description, location, eventDateTimestamp, priceWei, maxSupply)

        const receipt = await tx.wait()

        // Find the EventCreated event in the logs
        const eventCreatedLog = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "EventCreated"
          } catch {
            return false
          }
        })

        if (eventCreatedLog) {
          const parsed = contract.interface.parseLog(eventCreatedLog)
          return Number(parsed?.args.eventId)
        }

        throw new Error("Event creation failed")
      } catch (err: any) {
        const errorMessage = err.reason || err.message || "Failed to create event"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [getContract],
  )

  const mintTicket = useCallback(
    async (eventId: number, price: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const contract = await getContract()
        const priceWei = ethers.parseEther(price)

        const tx = await contract.mintTicket(eventId, { value: priceWei })
        const receipt = await tx.wait()

        // Find the TicketMinted event in the logs
        const ticketMintedLog = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "TicketMinted"
          } catch {
            return false
          }
        })

        if (ticketMintedLog) {
          const parsed = contract.interface.parseLog(ticketMintedLog)
          return Number(parsed?.args.tokenId)
        }

        throw new Error("Ticket minting failed")
      } catch (err: any) {
        const errorMessage = err.reason || err.message || "Failed to mint ticket"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [getContract],
  )

  const getAllEvents = useCallback(async (): Promise<Event[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const events = await contract.getAllEvents()

      return events.map((event: any, index: number) => ({
        id: index,
        name: event.name,
        description: event.description,
        location: event.location,
        eventDate: new Date(Number(event.eventDate) * 1000),
        price: ethers.formatEther(event.price),
        maxSupply: Number(event.maxSupply),
        currentSupply: Number(event.currentSupply),
        isActive: event.isActive,
        organizer: event.organizer,
      }))
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Failed to fetch events"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getContract])

  const getUserTickets = useCallback(async (): Promise<UserTicket[]> => {
    if (!account) return []

    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const tokenIds = await contract.getUserTickets(account)

      const tickets = await Promise.all(
        tokenIds.map(async (tokenId: bigint) => {
          const ticket = await contract.getTicket(tokenId)
          const event = await contract.getEvent(ticket.eventId)

          return {
            tokenId: Number(tokenId),
            eventId: Number(ticket.eventId),
            eventName: event.name,
            eventDate: new Date(Number(event.eventDate) * 1000),
            location: event.location,
            isUsed: ticket.isUsed,
            mintedAt: new Date(Number(ticket.mintedAt) * 1000),
          }
        }),
      )

      return tickets
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Failed to fetch user tickets"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [getContract, account])

  const markTicketAsUsed = useCallback(
    async (tokenId: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const contract = await getContract()
        const tx = await contract.markTicketUsed(tokenId)
        await tx.wait()
      } catch (err: any) {
        const errorMessage = err.reason || err.message || "Failed to use ticket"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [getContract],
  )

  return {
    createEvent,
    mintTicket,
    getAllEvents,
    getUserTickets,
    markTicketAsUsed,
    isLoading,
    error,
  }
}
