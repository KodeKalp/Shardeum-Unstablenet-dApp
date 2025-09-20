"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/hooks/use-admin"
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  MoreHorizontal,
  UserCheck,
  UserX,
  Crown,
  Calendar,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { User } from "@/components/auth-provider"

export default function AdminDashboard() {
  const { getAllUsers, updateUserRole, deleteUser, isLoading, currentUser } = useAdmin()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      await updateUserRole(userId, newRole)
      await loadUsers() // Refresh the list
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      await loadUsers() // Refresh the list
      setSelectedUser(null)
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      description: "Registered users",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Admin Users",
      value: users.filter((u) => u.role === "admin").length.toString(),
      description: "Admin privileges",
      icon: Shield,
      color: "text-accent",
    },
    {
      title: "Active Today",
      value: users
        .filter((u) => {
          const today = new Date()
          const lastLogin = new Date(u.lastLogin)
          return lastLogin.toDateString() === today.toDateString()
        })
        .length.toString(),
      description: "Users active today",
      icon: Activity,
      color: "text-chart-2",
    },
    {
      title: "Growth",
      value: "+12%",
      description: "vs last month",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users and platform settings</p>
              </div>
            </div>
            <Badge variant="secondary">Logged in as {currentUser?.name} (Admin)</Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {user.role === "admin" ? (
                            <Crown className="h-5 w-5 text-primary" />
                          ) : (
                            <UserCheck className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          {user.walletAddress && (
                            <div className="text-xs text-muted-foreground font-mono">
                              {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.role === "user" ? (
                              <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")} disabled={isLoading}>
                                <Crown className="h-4 w-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, "user")}
                                disabled={isLoading || user.id === currentUser?.id}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Remove Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setSelectedUser(user)
                                  }}
                                  disabled={user.id === currentUser?.id}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
