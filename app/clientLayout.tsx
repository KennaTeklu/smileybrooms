"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import UnifiedHeader from "@/components/unified-header"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import UnifiedFooter from "@/components/unified-footer"
import AccessibilityPanel from "@/components/accessibility-panel"
import SharePanel from "@/components/share-panel"
import { CartProvider } from "@/lib/cart-context"
import { EnhancedCartProvider } from "@/lib/enhanced-cart-context"
import { useEffect } from "react"
import { detectAndFixScrollIssues, resetIOSOverscroll } from "@/lib/scroll-utils"
import { PersistentViewCart } from "@/components/persistent-view-cart"

const inter = Inter({ subsets: ["latin"] })

// Client component to handle scroll fixes
function ScrollFixer() {
  useEffect(() => {
    // Apply scroll fixes on mount
    resetIOSOverscroll()

    // Check for scroll issues periodically
    const interval = setInterval(() => {
      detectAndFixScrollIssues()
    }, 1000)

    // Handle resize events
    const handleResize = () => {
      detectAndFixScrollIssues()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return null
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <EnhancedCartProvider>
            <CartProvider>
              <UnifiedHeader />
              <main className="pt-16 scrollable-container">{children}</main>
              <PersistentBookNowButton />
              <PersistentViewCart />
              <AccessibilityPanel />
              <SharePanel />
              <UnifiedFooter />
              <Toaster position="bottom-right" />
              <ScrollFixer />
            </CartProvider>
          </EnhancedCartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
