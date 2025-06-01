"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import EnhancedNavigation from "@/components/enhanced-navigation"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import UnifiedFooter from "@/components/unified-footer"
import { CartProvider } from "@/lib/cart-context"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import ChatbotManager from "@/components/chatbot-manager"
import GlobalFloatingControls from "@/components/global-floating-controls"

function ConditionalHeader() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"

  if (isHomepage) return null

  return (
    <>
      <EnhancedNavigation />
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
        <main>{children}</main>
        <PersistentBookNowButton />
        <UnifiedFooter />
        <Toaster />
        <ChatbotManager
          enableOnAllPages={true}
          excludePaths={["/admin", "/dashboard"]}
          customGreeting="Hi! Welcome to smileybrooms.com! How can I assist you today?"
        />
        <GlobalFloatingControls />
      </CartProvider>
    </ThemeProvider>
  )
}
