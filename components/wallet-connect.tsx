"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { Wallet, LogOut, AlertTriangle, ExternalLink } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function WalletConnect() {
  const { account, isConnected, isConnecting, balance, isCorrectNetwork, connect, disconnect } = useWallet()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Shardeum network",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        {!isCorrectNetwork && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Wrong Network
          </Badge>
        )}

        <div className="flex flex-col items-end">
          <div className="text-sm font-medium">{balance} SHM</div>
          <div className="text-xs text-muted-foreground">{`${account.slice(0, 6)}...${account.slice(-4)}`}</div>
        </div>

        <Button variant="outline" size="sm" onClick={handleDisconnect} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <a
            href={`https://explorer-unstable.shardeum.org/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting} className="gap-2">
      {isConnecting ? (
        <>
          <Spinner size="sm" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
