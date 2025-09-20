"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { User, Mail, Calendar, Wallet, Shield, Crown } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {user.role === "admin" ? (
                    <>
                      <Crown className="h-4 w-4 text-primary" />
                      <Badge variant="default">Administrator</Badge>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">User</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Member Since</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Last Login</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Information
                  </CardTitle>
                  <CardDescription>Your connected wallet details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.walletAddress ? (
                    <div className="flex items-center gap-3">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Wallet Address</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-4">No wallet connected</p>
                      <Button variant="outline" size="sm">
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Admin Features */}
            {user.role === "admin" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Crown className="h-5 w-5" />
                    Administrator Features
                  </CardTitle>
                  <CardDescription>You have administrative privileges on this platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">User Management</Badge>
                    <Badge variant="outline">Platform Settings</Badge>
                    <Badge variant="outline">Analytics Access</Badge>
                    <Badge variant="outline">System Monitoring</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
