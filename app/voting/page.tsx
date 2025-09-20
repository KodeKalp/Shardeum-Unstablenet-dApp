"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { Vote, Plus, Clock, CheckCircle, Users, TrendingUp, Calendar, Zap } from "lucide-react"

interface Proposal {
  id: string
  title: string
  description: string
  creator: string
  createdAt: Date
  endDate: Date
  status: "active" | "passed" | "failed" | "pending"
  totalVotes: number
  yesVotes: number
  noVotes: number
  quorum: number
  category: string
}

interface UserVote {
  proposalId: string
  vote: "yes" | "no"
  timestamp: Date
}

export default function VotingPage() {
  const { isConnected, account } = useWallet()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"active" | "create" | "history">("active")
  const [isCreating, setIsCreating] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  // Sample proposals
  const [proposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Increase Block Gas Limit",
      description:
        "Proposal to increase the block gas limit from 30M to 50M to accommodate more transactions per block and improve network throughput.",
      creator: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      createdAt: new Date(Date.now() - 86400000 * 2),
      endDate: new Date(Date.now() + 86400000 * 5),
      status: "active",
      totalVotes: 1247,
      yesVotes: 892,
      noVotes: 355,
      quorum: 1000,
      category: "Network",
    },
    {
      id: "2",
      title: "Community Treasury Allocation",
      description:
        "Allocate 100,000 SHM from the community treasury to fund developer grants and ecosystem growth initiatives.",
      creator: "0x8ba1f109551bD432803012645Hac136c22C177ec",
      createdAt: new Date(Date.now() - 86400000 * 1),
      endDate: new Date(Date.now() + 86400000 * 6),
      status: "active",
      totalVotes: 856,
      yesVotes: 623,
      noVotes: 233,
      quorum: 1000,
      category: "Treasury",
    },
    {
      id: "3",
      title: "Validator Reward Adjustment",
      description:
        "Reduce validator rewards from 5% to 4% annually to extend the token emission schedule and improve long-term sustainability.",
      creator: "0x1234567890123456789012345678901234567890",
      createdAt: new Date(Date.now() - 86400000 * 8),
      endDate: new Date(Date.now() - 86400000 * 1),
      status: "passed",
      totalVotes: 2156,
      yesVotes: 1432,
      noVotes: 724,
      quorum: 1000,
      category: "Economics",
    },
  ])

  // Sample user votes
  const [userVotes] = useState<UserVote[]>([
    {
      proposalId: "3",
      vote: "yes",
      timestamp: new Date(Date.now() - 86400000 * 2),
    },
  ])

  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "",
    duration: "7",
  })

  const createProposal = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to create proposals",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // Simulate proposal creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Proposal Created!",
        description: `Successfully created "${newProposal.title}"`,
      })

      setNewProposal({
        title: "",
        description: "",
        category: "",
        duration: "7",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Could not create proposal",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const castVote = async (proposalId: string, vote: "yes" | "no") => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      })
      return
    }

    setIsVoting(true)

    try {
      // Simulate voting
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Vote Cast!",
        description: `Successfully voted "${vote}" on the proposal`,
      })
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "Could not cast vote",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const getStatusColor = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-500/10 text-blue-500"
      case "passed":
        return "bg-green-500/10 text-green-500"
      case "failed":
        return "bg-red-500/10 text-red-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
    }
  }

  const getStatusIcon = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "passed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <Vote className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
    }
  }

  const hasUserVoted = (proposalId: string) => {
    return userVotes.some((vote) => vote.proposalId === proposalId)
  }

  const getUserVote = (proposalId: string) => {
    return userVotes.find((vote) => vote.proposalId === proposalId)
  }

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Connect your wallet to participate in decentralized governance</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Governance Voting</h1>
          <p className="text-muted-foreground">
            Participate in decentralized decision making for the Shardeum ecosystem
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                  <p className="text-2xl font-bold">{proposals.filter((p) => p.status === "active").length}</p>
                </div>
                <Vote className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Voters</p>
                  <p className="text-2xl font-bold">3,247</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participation</p>
                  <p className="text-2xl font-bold">78.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gas Cost</p>
                  <p className="text-2xl font-bold">0.001</p>
                  <p className="text-xs text-muted-foreground">SHM per vote</p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "active" ? "default" : "outline"}
            onClick={() => setActiveTab("active")}
            className="gap-2"
          >
            <Vote className="h-4 w-4" />
            Active Proposals
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Proposal
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "outline"}
            onClick={() => setActiveTab("history")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Voting History
          </Button>
        </div>

        {/* Active Proposals Tab */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <Badge className={getStatusColor(proposal.status)}>
                          {getStatusIcon(proposal.status)}
                          <span className="ml-1 capitalize">{proposal.status}</span>
                        </Badge>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        Created by {`${proposal.creator.slice(0, 6)}...${proposal.creator.slice(-4)}`}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">{getTimeRemaining(proposal.endDate)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{proposal.description}</p>

                  {/* Voting Results */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Yes: {proposal.yesVotes.toLocaleString()}</span>
                      <span>No: {proposal.noVotes.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                      <Progress value={(proposal.yesVotes / proposal.totalVotes) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((proposal.yesVotes / proposal.totalVotes) * 100).toFixed(1)}% Yes</span>
                        <span>{proposal.totalVotes.toLocaleString()} total votes</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Quorum: {proposal.quorum.toLocaleString()}</span>
                      <span className={proposal.totalVotes >= proposal.quorum ? "text-green-500" : "text-yellow-500"}>
                        {proposal.totalVotes >= proposal.quorum ? "✓ Quorum met" : "Quorum needed"}
                      </span>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.status === "active" && (
                    <div className="flex gap-4">
                      {hasUserVoted(proposal.id) ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          You voted: <span className="font-medium capitalize">{getUserVote(proposal.id)?.vote}</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            onClick={() => castVote(proposal.id, "yes")}
                            disabled={isVoting}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {isVoting ? "Voting..." : "Vote Yes"}
                          </Button>
                          <Button
                            onClick={() => castVote(proposal.id, "no")}
                            disabled={isVoting}
                            variant="destructive"
                            className="flex-1"
                          >
                            {isVoting ? "Voting..." : "Vote No"}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Proposal Tab */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create New Proposal</CardTitle>
                <CardDescription>Submit a proposal for community voting with minimal gas costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="proposal-title">Proposal Title</Label>
                  <Input
                    id="proposal-title"
                    placeholder="Enter a clear, descriptive title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposal-description">Description</Label>
                  <Textarea
                    id="proposal-description"
                    placeholder="Provide detailed information about your proposal..."
                    className="min-h-[120px]"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="Network, Treasury, Economics, etc."
                      value={newProposal.category}
                      onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Voting Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="30"
                      value={newProposal.duration}
                      onChange={(e) => setNewProposal({ ...newProposal, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Proposal Creation</span>
                    <span className="text-green-500 font-medium">~0.005 SHM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Minimum Quorum</span>
                    <span className="text-primary font-medium">1,000 votes</span>
                  </div>
                </div>

                <Button
                  onClick={createProposal}
                  disabled={isCreating || !newProposal.title || !newProposal.description}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Proposal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Voting History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Voting History</CardTitle>
                <CardDescription>Track your participation in governance decisions</CardDescription>
              </CardHeader>
              <CardContent>
                {userVotes.length > 0 ? (
                  <div className="space-y-4">
                    {userVotes.map((vote) => {
                      const proposal = proposals.find((p) => p.id === vote.proposalId)
                      if (!proposal) return null

                      return (
                        <div
                          key={vote.proposalId}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{proposal.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Voted on {vote.timestamp.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                vote.vote === "yes" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                              }
                            >
                              {vote.vote === "yes" ? "Yes" : "No"}
                            </Badge>
                            <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't voted on any proposals yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
