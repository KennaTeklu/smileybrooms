"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ResponsiveHeader } from "@/components/responsive-header"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import UnifiedFooter from "@/components/unified-footer"
import AccessibilityPanel from "@/components/accessibility-panel"
import SharePanel from "@/components/share-panel"
import { CartProvider } from "@/lib/cart-context"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

function ConditionalHeader() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  if (isHomepage) return null

  return (
    <>
      <ResponsiveHeader />
      <div className="pt-16" />
    </>
  )
}

function ConditionalHeaderWrapper() {
  return (
    <Suspense fallback={<div className="pt-16" />}>
      <ConditionalHeader />
    </Suspense>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>
        <ConditionalHeaderWrapper />
        {children}
        <PersistentBookNowButton />
        <AccessibilityPanel />
        <SharePanel />
        <UnifiedFooter />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  )
}
