"use client"

import type { ReactNode } from "react"

interface SessionProviderProps {
  children: ReactNode
}

// Simple mock session provider that just renders children without any auth functionality
export function SessionProvider({ children }: SessionProviderProps) {
  return <>{children}</>
}
