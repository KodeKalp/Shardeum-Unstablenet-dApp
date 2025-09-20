"use client"

import { useState, useCallback } from "react"
import type { ethers } from "ethers"
import { useWallet } from "./use-wallet"
import {
  getPaymentContract,
  getNFTTicketingContract,
  getVotingContract,
  getPaymentContractReadOnly,
  getNFTTicketingContractReadOnly,
  getVotingContractReadOnly,
  formatEther,
  parseEther,
} from "@/lib/contracts"

export function useContract() {
  const { account, isConnected, refreshBalance } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTransaction = useCallback(
    async (
      transactionFn: () => Promise<ethers.ContractTransactionResponse>,
      onSuccess?: (receipt: ethers.ContractTransactionReceipt) => void,
    ) => {
      if (!isConnected || !account) {
        throw new Error("Wallet not connected")
      }

      setIsLoading(true)
      setError(null)

      try {
        const tx = await transactionFn()
        const receipt = await tx.wait()

        if (receipt) {
          refreshBalance()
          onSuccess?.(receipt)
          return receipt
        }
      } catch (err: any) {
        const errorMessage = err.reason || err.message || "Transaction failed"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, refreshBalance],
  )

  // Payment contract functions
  const sendPayment = useCallback(
    async (to: string, amount: string, message = "") => {
      const contract = await getPaymentContract()
      return handleTransaction(() => contract.sendPayment(to, message, { value: parseEther(amount) }))
    },
    [handleTransaction],
  )

  const getUserPayments = useCallback(
    async (userAddress?: string) => {
      try {
        const contract = getPaymentContractReadOnly()
        const address = userAddress || account
        if (!address) return []

        const payments = await contract.getUserPayments(address)
        return payments.map((payment: any) => ({
          from: payment.from,
          to: payment.to,
          amount: formatEther(payment.amount),
          timestamp: new Date(Number(payment.timestamp) * 1000),
          message: payment.message,
        }))
      } catch (err) {
        console.error("Failed to fetch payments:", err)
        return []
      }
    },
    [account],
  )

  // NFT Ticketing contract functions
  const createEvent = useCallback(
    async (
      name: string,
      description: string,
      location: string,
      date: Date,
      price: string,
      maxTickets: number,
      imageURI: string,
    ) => {
      const contract = await getNFTTicketingContract()
      return handleTransaction(() =>
        contract.createEvent(
          name,
          description,
          location,
          Math.floor(date.getTime() / 1000),
          parseEther(price),
          maxTickets,
          imageURI,
        ),
      )
    },
    [handleTransaction],
  )

  const mintTicket = useCallback(
    async (eventId: number, price: string) => {
      const contract = await getNFTTicketingContract()
      return handleTransaction(() => contract.mintTicket(eventId, { value: parseEther(price) }))
    },
    [handleTransaction],
  )

  const getAllEvents = useCallback(async () => {
    try {
      const contract = getNFTTicketingContractReadOnly()
      const events = await contract.getAllEvents()
      return events.map((event: any) => ({
        id: Number(event.id),
        name: event.name,
        description: event.description,
        location: event.location,
        date: new Date(Number(event.date) * 1000),
        price: formatEther(event.price),
        maxTickets: Number(event.maxTickets),
        soldTickets: Number(event.soldTickets),
        organizer: event.organizer,
        active: event.active,
        imageURI: event.imageURI,
      }))
    } catch (err) {
      console.error("Failed to fetch events:", err)
      return []
    }
  }, [])

  const getUserTickets = useCallback(
    async (userAddress?: string) => {
      try {
        const contract = getNFTTicketingContractReadOnly()
        const address = userAddress || account
        if (!address) return []

        const ticketIds = await contract.getUserTickets(address)
        return ticketIds.map((id: any) => Number(id))
      } catch (err) {
        console.error("Failed to fetch user tickets:", err)
        return []
      }
    },
    [account],
  )

  // Voting contract functions
  const createProposal = useCallback(
    async (title: string, description: string, votingPeriodDays = 7) => {
      const contract = await getVotingContract()
      const votingPeriod = votingPeriodDays * 24 * 60 * 60 // Convert days to seconds
      return handleTransaction(() => contract.createProposal(title, description, votingPeriod))
    },
    [handleTransaction],
  )

  const vote = useCallback(
    async (proposalId: number, support: boolean, reason = "") => {
      const contract = await getVotingContract()
      return handleTransaction(() => contract.vote(proposalId, support, reason))
    },
    [handleTransaction],
  )

  const getActiveProposals = useCallback(async () => {
    try {
      const contract = getVotingContractReadOnly()
      const proposals = await contract.getActiveProposals()
      return proposals.map((proposal: any) => ({
        id: Number(proposal.id),
        title: proposal.title,
        description: proposal.description,
        proposer: proposal.proposer,
        startTime: new Date(Number(proposal.startTime) * 1000),
        endTime: new Date(Number(proposal.endTime) * 1000),
        yesVotes: Number(proposal.yesVotes),
        noVotes: Number(proposal.noVotes),
        executed: proposal.executed,
        active: proposal.active,
      }))
    } catch (err) {
      console.error("Failed to fetch proposals:", err)
      return []
    }
  }, [])

  const getVotingStats = useCallback(async (proposalId: number) => {
    try {
      const contract = getVotingContractReadOnly()
      const stats = await contract.getVotingStats(proposalId)
      return {
        totalVotes: Number(stats.totalVotes),
        yesVotes: Number(stats.yesVotes),
        noVotes: Number(stats.noVotes),
        yesPercentage: Number(stats.yesPercentage),
        timeLeft: Number(stats.timeLeft),
      }
    } catch (err) {
      console.error("Failed to fetch voting stats:", err)
      return {
        totalVotes: 0,
        yesVotes: 0,
        noVotes: 0,
        yesPercentage: 0,
        timeLeft: 0,
      }
    }
  }, [])

  return {
    isLoading,
    error,
    // Payment functions
    sendPayment,
    getUserPayments,
    // NFT Ticketing functions
    createEvent,
    mintTicket,
    getAllEvents,
    getUserTickets,
    // Voting functions
    createProposal,
    vote,
    getActiveProposals,
    getVotingStats,
  }
}
