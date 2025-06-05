"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context" // Moved RoomProvider here
import { AddAllToCartModal } from "@/components/add-all-to-cart-modal" // Moved AddAllToCartModal here
import { GlobalAddToCartContainer } from "@/components/global-add-to-cart-container" // Import the new container

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
                <GlobalAddToCartContainer>
                  <AddAllToCartModal />
                </GlobalAddToCartContainer>
              </RoomProvider>
            </CartProvider>
          </AbandonmentProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
