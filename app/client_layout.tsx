"use client" // This is now a client component to use usePathname

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { RoomProvider } from "@/lib/room-context"
import { usePathname } from "next/navigation" // Import usePathname

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname() // Get current path

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccessibilityProvider>
            <CartProvider>
              <RoomProvider>
                {pathname !== "/" && <Header />} {/* Conditionally render Header */}
                {children}
                <Toaster />
                {/* Global Collapsible Panels */}
                <CollapsibleSettingsPanel />
                <CollapsibleSharePanel />
                <CollapsibleChatbotPanel />
                <CollapsibleAddAllPanel />
              </RoomProvider>
            </CartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
