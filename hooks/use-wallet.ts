"use client"

import { useState, useEffect } from "react"
import { connectWallet, addShardeumNetwork, getProvider } from "@/lib/web3"
import { ethers } from "ethers"

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState<string>("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  useEffect(() => {
    checkConnection()

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (isConnected && account) {
      fetchBalance()
      checkNetwork()
    }
  }, [isConnected, account])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Failed to check connection:", error)
      }
    }
  }

  const fetchBalance = async () => {
    if (!account) return

    try {
      const provider = getProvider()
      if (provider) {
        const balanceWei = await provider.getBalance(account)
        const balanceEth = ethers.formatEther(balanceWei)
        setBalance(Number.parseFloat(balanceEth).toFixed(4))
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    }
  }

  const checkNetwork = async () => {
    try {
      const provider = getProvider()
      if (provider) {
        const network = await provider.getNetwork()
        const currentChainId = Number(network.chainId)
        setChainId(currentChainId)
        setIsCorrectNetwork(currentChainId === 8080) // Shardeum Unstablenet
      }
    } catch (error) {
      console.error("Failed to check network:", error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
      setIsConnected(true)
    } else {
      setAccount(null)
      setIsConnected(false)
      setBalance("0")
    }
  }

  const handleChainChanged = (chainId: string) => {
    const newChainId = Number.parseInt(chainId, 16)
    setChainId(newChainId)
    setIsCorrectNetwork(newChainId === 8080)
    if (account) {
      fetchBalance()
    }
  }

  const connect = async () => {
    setIsConnecting(true)
    try {
      await addShardeumNetwork()
      const connectedAccount = await connectWallet()
      if (connectedAccount) {
        setAccount(connectedAccount)
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setIsConnected(false)
    setBalance("0")
    setChainId(null)
    setIsCorrectNetwork(false)
  }

  const refreshBalance = () => {
    if (account) {
      fetchBalance()
    }
  }

  return {
    account,
    isConnected,
    isConnecting,
    balance,
    chainId,
    isCorrectNetwork,
    connect,
    disconnect,
    refreshBalance,
  }
}
