"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryClientProviderWrapper>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AccessibilityProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProviderWrapper>
  )
}
