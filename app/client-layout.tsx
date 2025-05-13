"use client"

import type React from "react"

import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import FixedFooter from "@/components/fixed-footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        <div className="flex min-h-screen flex-col pb-16">
          {children}
          <Toaster />
          <FixedFooter />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}
