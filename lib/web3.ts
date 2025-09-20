import { ethers } from "ethers"

export const SHARDEUM_CONFIG = {
  chainId: 8080,
  name: "Shardeum Unstablenet",
  rpcUrl: "https://api-unstable.shardeum.org",
  explorerUrl: "https://explorer-unstable.shardeum.org",
  currency: {
    name: "SHM",
    symbol: "SHM",
    decimals: 18,
  },
}

export const addShardeumNetwork = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${SHARDEUM_CONFIG.chainId.toString(16)}`,
            chainName: SHARDEUM_CONFIG.name,
            nativeCurrency: SHARDEUM_CONFIG.currency,
            rpcUrls: [SHARDEUM_CONFIG.rpcUrl],
            blockExplorerUrls: [SHARDEUM_CONFIG.explorerUrl],
          },
        ],
      })
    } catch (error) {
      console.error("Failed to add Shardeum network:", error)
    }
  }
}

export const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      return accounts[0]
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return null
    }
  }
  return null
}

export const getProvider = () => {
  if (typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

export const getChecksumAddress = (address: string): string => {
  try {
    return ethers.getAddress(address)
  } catch {
    return address
  }
}

export const getSigner = async () => {
  const provider = getProvider()
  if (provider) {
    try {
      const signer = await provider.getSigner()
      signer.provider._getAddress = async (address: string) => {
        if (ethers.isAddress(address)) {
          return getChecksumAddress(address)
        }
        throw new Error(`Invalid address: ${address}`)
      }
      return signer
    } catch (error) {
      console.error("Failed to get signer:", error)
      return null
    }
  }
  return null
}
