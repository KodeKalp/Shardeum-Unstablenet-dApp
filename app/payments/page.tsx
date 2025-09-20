"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle, AlertCircle, Zap, ExternalLink, RefreshCw } from "lucide-react"
import { ethers } from "ethers"

interface Payment {
  from: string
  to: string
  amount: string
  timestamp: Date
  message: string
}

export default function PaymentsPage() {
  const { isConnected, account, balance, isCorrectNetwork, refreshBalance } = useWallet()
  const { sendPayment, getUserPayments, isLoading, error } = useContract()
  const { toast } = useToast()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoadingPayments, setIsLoadingPayments] = useState(false)

  useEffect(() => {
    if (isConnected && account) {
      loadPayments()
    }
  }, [isConnected, account])

  const loadPayments = async () => {
    setIsLoadingPayments(true)
    try {
      const userPayments = await getUserPayments()
      setPayments(userPayments)
    } catch (error) {
      console.error("Failed to load payments:", error)
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPayments(false)
    }
  }

  const handleSendPayment = async () => {
    if (!isConnected || !recipient || !amount) {
      toast({
        title: "Error",
        description: "Please connect wallet and fill required fields",
        variant: "destructive",
      })
      return
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Shardeum Unstablenet",
        variant: "destructive",
      })
      return
    }

    // Validate recipient address
    if (!ethers.isAddress(recipient)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    const amountNum = Number.parseFloat(amount)
    const balanceNum = Number.parseFloat(balance)
    if (amountNum > balanceNum) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough SHM for this transaction",
        variant: "destructive",
      })
      return
    }

    try {
      await sendPayment(recipient, amount, message)

      toast({
        title: "Payment Sent!",
        description: `Successfully sent ${amount} SHM to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
        variant: "success",
      })

      // Clear form
      setRecipient("")
      setAmount("")
      setMessage("")

      // Reload payments
      setTimeout(() => {
        loadPayments()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Transaction could not be completed",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (payment: Payment) => {
    // All loaded payments are completed since they're from the blockchain
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your wallet to start sending lightning-fast payments on Shardeum
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lightning Payments</h1>
          <p className="text-muted-foreground">Send SHM tokens instantly with near-zero gas fees</p>
        </div>

        {!isCorrectNetwork && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Wrong Network</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please switch to Shardeum Unstablenet to use payments
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Payment
                </CardTitle>
                <CardDescription>Transfer SHM tokens to any address on Shardeum</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address *</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="font-mono"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SHM) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="text-xs text-muted-foreground">Available: {balance} SHM</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a note to your payment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="text-green-500 font-medium">~0.001 SHM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span className="text-primary font-medium">~2 seconds</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSendPayment}
                  disabled={isLoading || !recipient || !amount || !isCorrectNetwork}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gas Price</span>
                  <Badge variant="secondary">0.001 SHM</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Block Time</span>
                  <Badge variant="secondary">2s</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <Badge className="bg-green-500/10 text-green-500">99.9%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Your Balance
                  <Button variant="ghost" size="sm" onClick={refreshBalance}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance} SHM</div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${(Number.parseFloat(balance) * 2).toFixed(2)} USD
                </div>
                {account && (
                  <Button variant="outline" size="sm" className="w-full mt-3 gap-2 bg-transparent" asChild>
                    <a
                      href={`https://explorer-unstable.shardeum.org/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment History
              <Button variant="ghost" size="sm" onClick={loadPayments} disabled={isLoadingPayments}>
                {isLoadingPayments ? <Spinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </CardTitle>
            <CardDescription>Your payment history on Shardeum blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPayments ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="mr-2" />
                Loading payments...
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payments found. Send your first payment to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(payment)}
                      <div>
                        <div className="font-medium">
                          {payment.from.toLowerCase() === account?.toLowerCase() ? "Sent" : "Received"} {payment.amount}{" "}
                          SHM
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {payment.from.toLowerCase() === account?.toLowerCase()
                            ? `To: ${payment.to.slice(0, 6)}...${payment.to.slice(-4)}`
                            : `From: ${payment.from.slice(0, 6)}...${payment.from.slice(-4)}`}
                        </div>
                        {payment.message && (
                          <div className="text-xs text-muted-foreground mt-1">"{payment.message}"</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className="bg-green-500/10 text-green-500">completed</Badge>
                        <div className="text-xs text-muted-foreground mt-1">{payment.timestamp.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
