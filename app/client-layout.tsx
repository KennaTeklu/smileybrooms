"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import CollapsibleSettingsPanel from "@/components/collapsible-settings-panel"
import CollapsibleSharePanel from "@/components/collapsible-share-panel"
import CollapsibleCartPanel from "@/components/collapsible-cart-panel"
import CollapsibleChatbotPanel from "@/components/collapsible-chatbot-panel"
import CollapsibleAddAllPanel from "@/components/collapsible-add-all-panel"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const hideHeader = pathname === "/"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AccessibilityProvider>
        <RoomProvider>
          <CartProvider>
            {!hideHeader && <Header />}
            {children}
            <CollapsibleSettingsPanel />
            <CollapsibleSharePanel />
            <CollapsibleCartPanel />
            <CollapsibleChatbotPanel />
            <CollapsibleAddAllPanel />
            <Toaster />
          </CartProvider>
        </RoomProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
