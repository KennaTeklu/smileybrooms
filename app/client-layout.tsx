"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import EnhancedNavigation from "@/components/enhanced-navigation"
import UnifiedFooter from "@/components/unified-footer"
import FixedFooter from "@/components/fixed-footer"
import GlobalFloatingControls from "@/components/global-floating-controls"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <EnhancedNavigation />
        <main className="min-h-screen">{children}</main>
        <UnifiedFooter />
        <FixedFooter />
        <GlobalFloatingControls />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
