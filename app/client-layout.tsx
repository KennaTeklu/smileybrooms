"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { Toaster } from "@/components/ui/toaster"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AccessibilityProvider>
          <CartProvider>
            <RoomProvider>
              {children}
              <Toaster />
            </RoomProvider>
          </CartProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
