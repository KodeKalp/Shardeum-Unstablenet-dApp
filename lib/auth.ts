"use client"

import { createContext, useContext } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  walletAddress?: string
  createdAt: Date
  lastLogin: Date
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock user database - in production, this would be a real database
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@shardeum.com",
    name: "Admin User",
    role: "admin",
    walletAddress: "0x742d35Cc6634C0532925a3b8D0C9C0532925a6C87",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "John Doe",
    role: "user",
    walletAddress: "0x123d35Cc6634C0532925a3b8D0C9C0532925a123",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
]

// Mock password storage - in production, use proper hashing
const mockPasswords: Record<string, string> = {
  "admin@shardeum.com": "admin123",
  "user@example.com": "user123",
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (!user || mockPasswords[email] !== password) {
      throw new Error("Invalid email or password")
    }

    // Update last login
    user.lastLogin = new Date()

    // Store in localStorage (in production, use secure tokens)
    localStorage.setItem("auth_user", JSON.stringify(user))

    return user
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "user",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    // Add to mock database
    mockUsers.push(newUser)
    mockPasswords[email] = password

    // Store in localStorage
    localStorage.setItem("auth_user", JSON.stringify(newUser))

    return newUser
  },

  logout(): void {
    localStorage.removeItem("auth_user")
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem("auth_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  async getAllUsers(): Promise<User[]> {
    // Admin only function
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUsers
  },

  async updateUserRole(userId: string, role: "user" | "admin"): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.role = role
    }
  },

  async deleteUser(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockUsers.findIndex((u) => u.id === userId)
    if (index > -1) {
      const user = mockUsers[index]
      delete mockPasswords[user.email]
      mockUsers.splice(index, 1)
    }
  },
}
