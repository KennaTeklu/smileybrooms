"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
// Removed AddAllToCartModal import - functionality now integrated into IntelligentCartButton

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider>
        <AccessibilityProvider>
          <AbandonmentProvider>
            <CartProvider>
              <RoomProvider>
                {children}
                <Toaster />
                {/* Removed AddAllToCartModal - now integrated into header */}
              </RoomProvider>
            </CartProvider>
          </AbandonmentProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
