"use client"

import type React from "react"

// Simplified mock provider that doesn't require any environment variables
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
