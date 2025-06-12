"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { CartProvider } from "@/lib/cart-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider>
        <AccessibilityProvider>
          <AbandonmentProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AbandonmentProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
