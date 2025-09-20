"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import {
  ArrowRight,
  Coins,
  Ticket,
  Vote,
  Zap,
  Users,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  ExternalLink,
  Calendar,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { isConnected, account } = useWallet()

  const stats = [
    { label: "Total Transactions", value: "2,847", icon: Zap, change: "+12%", color: "text-primary" },
    { label: "Active Users", value: "1,234", icon: Users, change: "+8%", color: "text-accent" },
    { label: "Gas Saved", value: "99.2%", icon: TrendingUp, change: "vs Ethereum", color: "text-chart-2" },
    { label: "Network Speed", value: "2.1s", icon: Activity, change: "avg block time", color: "text-chart-4" },
  ]

  const features = [
    {
      title: "Lightning Payments",
      description: "Send SHM tokens instantly with near-zero gas fees",
      icon: Coins,
      href: "/payments",
      color: "bg-accent/10 text-accent",
      stats: "2,847 transactions",
    },
    {
      title: "NFT Ticketing",
      description: "Create and manage event tickets as NFTs",
      icon: Ticket,
      href: "/tickets",
      color: "bg-primary/10 text-primary",
      stats: "156 events created",
    },
    {
      title: "Governance Voting",
      description: "Participate in decentralized decision making",
      icon: Vote,
      href: "/voting",
      color: "bg-chart-2/10 text-chart-2",
      stats: "78.5% participation",
    },
  ]

  // Sample recent activity
  const recentActivity = [
    {
      id: "1",
      type: "payment",
      title: "Payment Sent",
      description: "Sent 0.5 SHM to 0x742d...6C87",
      timestamp: "2 minutes ago",
      status: "completed",
      icon: Coins,
    },
    {
      id: "2",
      type: "ticket",
      title: "Ticket Minted",
      description: "Minted Shardeum DevCon 2025 ticket",
      timestamp: "1 hour ago",
      status: "completed",
      icon: Ticket,
    },
    {
      id: "3",
      type: "vote",
      title: "Vote Cast",
      description: "Voted Yes on Block Gas Limit proposal",
      timestamp: "3 hours ago",
      status: "completed",
      icon: Vote,
    },
  ]

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: "1",
      name: "Shardeum DevCon 2025",
      date: "2025-03-15",
      location: "San Francisco, CA",
      image: "/blockchain-conference.png",
      price: "0.1 SHM",
    },
    {
      id: "2",
      name: "Web3 Hackathon Finals",
      date: "2025-02-28",
      location: "Austin, TX",
      image: "/hackathon-coding-event.jpg",
      price: "0.05 SHM",
    },
  ]

  // Sample active proposals
  const activeProposals = [
    {
      id: "1",
      title: "Increase Block Gas Limit",
      yesVotes: 892,
      totalVotes: 1247,
      endDate: new Date(Date.now() + 86400000 * 5),
    },
    {
      id: "2",
      title: "Community Treasury Allocation",
      yesVotes: 623,
      totalVotes: 856,
      endDate: new Date(Date.now() + 86400000 * 6),
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Built on Shardeum Unstablenet
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            The complete platform to <span className="text-primary">build the future</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Experience lightning-fast transactions, near-zero gas fees, and infinite scalability with our comprehensive
            Web3 toolkit.
          </p>

          {!isConnected && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isConnected ? (
          /* Connected User Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <Card
                    key={feature.title}
                    className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">{feature.stats}</span>
                      </div>
                      <Link href={feature.href}>
                        <Button
                          variant="ghost"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Explore <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest transactions and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="p-2 rounded-lg bg-background">
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                    View All Activity <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Wallet Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">12.45 SHM</div>
                    <div className="text-sm text-muted-foreground">≈ $24.90 USD</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {account && `${account.slice(0, 6)}...${account.slice(-4)}`}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <ExternalLink className="h-3 w-3" />
                    View on Explorer
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <CardDescription>NFT tickets available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{event.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">{event.price}</span>
                          <Button size="sm" variant="outline">
                            Mint
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/tickets">
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      View All Events <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Active Proposals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Proposals</CardTitle>
                  <CardDescription>Participate in governance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeProposals.map((proposal) => (
                    <div key={proposal.id} className="space-y-2">
                      <div className="font-medium text-sm">{proposal.title}</div>
                      <Progress value={(proposal.yesVotes / proposal.totalVotes) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((proposal.yesVotes / proposal.totalVotes) * 100).toFixed(1)}% Yes</span>
                        <span>{proposal.totalVotes} votes</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/voting">
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      View All Proposals <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Non-connected Features Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href}>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Explore <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Network Info */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Powered by Shardeum</h3>
                <p className="text-muted-foreground">
                  Experience the future of blockchain with linear scalability, low gas fees forever, and true
                  decentralization.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Chain ID: 8080</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Network: Unstablenet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                  <span>Gas: ~0.001 SHM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
