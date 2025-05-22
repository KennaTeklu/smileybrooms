"use client"

import type React from "react"

import { CartProvider } from "@/lib/cart-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import UnifiedCartButton from "@/components/unified-cart-button"
import AddedToCartNotification from "@/components/added-to-cart-notification"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider>
        <CartProvider>
          {children}
          <UnifiedCartButton />
          <AddedToCartNotification />
          <Toaster position="bottom-right" />
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
