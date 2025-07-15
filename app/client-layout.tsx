"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { CookieConsentManager } from "@/components/legal/cookie-consent-manager"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const queryClient = new QueryClient()

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Or a loading spinner
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <CartProvider>
            <RoomProvider>
              {children}
              <Toaster />
              <AccessibilityToolbar />
              <CookieConsentManager />
            </RoomProvider>
          </CartProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
