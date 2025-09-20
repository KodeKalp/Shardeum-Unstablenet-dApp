"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth, authService, type User } from "@/components/auth-provider"

export function useAdmin() {
  const { isAdmin, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getAllUsers = async (): Promise<User[]> => {
    if (!isAdmin) {
      throw new Error("Admin access required")
    }

    try {
      setIsLoading(true)
      return await authService.getAllUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: "user" | "admin") => {
    if (!isAdmin) {
      throw new Error("Admin access required")
    }

    try {
      setIsLoading(true)
      await authService.updateUserRole(userId, role)
      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      throw new Error("Admin access required")
    }

    try {
      setIsLoading(true)
      await authService.deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAdmin,
    currentUser: user,
    isLoading,
    getAllUsers,
    updateUserRole,
    deleteUser,
  }
}
