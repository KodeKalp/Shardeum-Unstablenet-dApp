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
import { useNFTContract } from "@/hooks/use-nft-contract"
import { useToast } from "@/hooks/use-toast"
import { Ticket, Plus, Calendar, MapPin, Users, Star, ExternalLink, Zap, AlertCircle, RefreshCw } from "lucide-react"
import { NFT_CONTRACT_ADDRESS } from "@/constants"

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

export default function TicketsPage() {
  const { isConnected, account, isCorrectNetwork } = useWallet()
  const { createEvent, mintTicket, getAllEvents, getUserTickets, isLoading, error } = useNFTContract()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"browse" | "create" | "my-tickets">("browse")
  const [events, setEvents] = useState<Event[]>([])
  const [userTickets, setUserTickets] = useState<UserTicket[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    eventDate: "",
    location: "",
    price: "",
    maxSupply: "",
  })

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      loadEvents()
      if (account) {
        loadUserTickets()
      }
    }
  }, [isConnected, isCorrectNetwork, account])

  const loadEvents = async () => {
    setIsLoadingEvents(true)
    try {
      const allEvents = await getAllEvents()
      setEvents(allEvents.filter((event) => event.isActive))
    } catch (error) {
      console.error("Failed to load events:", error)
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const loadUserTickets = async () => {
    setIsLoadingTickets(true)
    try {
      const tickets = await getUserTickets()
      setUserTickets(tickets)
    } catch (error) {
      console.error("Failed to load user tickets:", error)
      toast({
        title: "Error",
        description: "Failed to load your tickets",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTickets(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to Shardeum network",
        variant: "destructive",
      })
      return
    }

    if (!newEvent.name || !newEvent.eventDate || !newEvent.price || !newEvent.maxSupply) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const eventDate = new Date(newEvent.eventDate)
      if (eventDate <= new Date()) {
        toast({
          title: "Invalid Date",
          description: "Event date must be in the future",
          variant: "destructive",
        })
        return
      }

      await createEvent(
        newEvent.name,
        newEvent.description,
        newEvent.location,
        eventDate,
        newEvent.price,
        Number.parseInt(newEvent.maxSupply),
      )

      toast({
        title: "Event Created!",
        description: `Successfully created ${newEvent.name} NFT tickets`,
        variant: "success",
      })

      setNewEvent({
        name: "",
        description: "",
        eventDate: "",
        location: "",
        price: "",
        maxSupply: "",
      })

      // Reload events
      setTimeout(() => {
        loadEvents()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Could not create NFT tickets",
        variant: "destructive",
      })
    }
  }

  const handleMintTicket = async (event: Event) => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to Shardeum network",
        variant: "destructive",
      })
      return
    }

    try {
      await mintTicket(event.id, event.price)

      toast({
        title: "Ticket Minted!",
        description: `Successfully minted ${event.name} for ${event.price} SHM`,
        variant: "success",
      })

      // Reload events and user tickets
      setTimeout(() => {
        loadEvents()
        loadUserTickets()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message || "Could not mint NFT ticket",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (ticket: UserTicket) => {
    if (ticket.isUsed) return "bg-gray-500/10 text-gray-500"
    if (ticket.eventDate < new Date()) return "bg-red-500/10 text-red-500"
    return "bg-green-500/10 text-green-500"
  }

  const getStatusText = (ticket: UserTicket) => {
    if (ticket.isUsed) return "used"
    if (ticket.eventDate < new Date()) return "expired"
    return "valid"
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Connect your wallet to browse, create, and mint NFT tickets</p>
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
          <h1 className="text-3xl font-bold mb-2">NFT Ticketing</h1>
          <p className="text-muted-foreground">Create and manage event tickets as NFTs with ultra-low gas fees</p>
        </div>

        {!isCorrectNetwork && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Wrong Network</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please switch to Shardeum Unstablenet to use NFT ticketing
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "browse" ? "default" : "outline"}
            onClick={() => setActiveTab("browse")}
            className="gap-2"
          >
            <Ticket className="h-4 w-4" />
            Browse Events
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
          <Button
            variant={activeTab === "my-tickets" ? "default" : "outline"}
            onClick={() => setActiveTab("my-tickets")}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            My Tickets ({userTickets.length})
          </Button>
        </div>

        {/* Browse Events Tab */}
        {activeTab === "browse" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Available Events</h2>
              <Button variant="ghost" size="sm" onClick={loadEvents} disabled={isLoadingEvents}>
                {isLoadingEvents ? <Spinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            {isLoadingEvents ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="mr-2" />
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Events Available</h3>
                  <p className="text-muted-foreground">Be the first to create an NFT event!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Ticket className="h-16 w-16 text-primary/40" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {event.eventDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.currentSupply}/{event.maxSupply} minted
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">{event.price} SHM</div>
                          <div className="text-xs text-muted-foreground">+ gas fees</div>
                        </div>
                        <Button
                          onClick={() => handleMintTicket(event)}
                          disabled={isLoading || event.currentSupply >= event.maxSupply || !isCorrectNetwork}
                          className="gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" />
                              Minting...
                            </>
                          ) : event.currentSupply >= event.maxSupply ? (
                            "Sold Out"
                          ) : (
                            <>
                              <Zap className="h-4 w-4" />
                              Mint Ticket
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Event Tab */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create NFT Event Tickets</CardTitle>
                <CardDescription>Deploy your own NFT ticket collection with minimal gas costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name *</Label>
                    <Input
                      id="event-name"
                      placeholder="My Awesome Event"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date *</Label>
                    <Input
                      id="event-date"
                      type="datetime-local"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-supply">Total Supply *</Label>
                    <Input
                      id="max-supply"
                      type="number"
                      placeholder="100"
                      value={newEvent.maxSupply}
                      onChange={(e) => setNewEvent({ ...newEvent, maxSupply: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (SHM) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Contract Deployment</span>
                    <span className="text-green-500 font-medium">~0.01 SHM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Per Mint Cost</span>
                    <span className="text-primary font-medium">~0.001 SHM</span>
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
                  onClick={handleCreateEvent}
                  disabled={isLoading || !newEvent.name || !newEvent.price || !isCorrectNetwork}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create NFT Tickets
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === "my-tickets" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My NFT Tickets</h2>
              <Button variant="ghost" size="sm" onClick={loadUserTickets} disabled={isLoadingTickets}>
                {isLoadingTickets ? <Spinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            {isLoadingTickets ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="mr-2" />
                Loading your tickets...
              </div>
            ) : userTickets.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
                  <p className="text-muted-foreground">Mint your first NFT ticket to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTickets.map((ticket) => (
                  <Card key={ticket.tokenId} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                      <Ticket className="h-16 w-16 text-primary/40" />
                      <Badge className={`absolute top-3 right-3 ${getStatusColor(ticket)}`}>
                        {getStatusText(ticket)}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{ticket.eventName}</CardTitle>
                      <div className="text-sm text-muted-foreground">Token ID: #{ticket.tokenId}</div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {ticket.eventDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {ticket.location}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                        <a
                          href={`https://explorer-unstable.shardeum.org/token/${NFT_CONTRACT_ADDRESS}?a=${ticket.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on Explorer
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
