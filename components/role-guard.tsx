"use client"

import { useAuth } from "@/components/auth-provider"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: ("user" | "admin")[]
  requireAdmin?: boolean
  fallback?: ReactNode
}

export function RoleGuard({
  children,
  allowedRoles = ["user", "admin"],
  requireAdmin = false,
  fallback = null,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <>{fallback}</>
  }

  if (requireAdmin && user.role !== "admin") {
    return <>{fallback}</>
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
