"use client"

import type React from "react"

import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import PageViewTracker from "@/components/page-view-tracker"
import { QueryClientProvider } from "@/components/providers/query-client-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider>
        <CartProvider>
          <PageViewTracker />
          {children}
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
