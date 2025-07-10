"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AccessibilityProvider>
            <CartProvider>
              <RoomProvider>
                {!isHomePage && <Header />} {/* Conditionally render Header */}
                {children}
                <CollapsibleSettingsPanel />
                <CollapsibleSharePanel />
                <CollapsibleChatbotPanel />
                <CollapsibleAddAllPanel />
              </RoomProvider>
            </CartProvider>
          </AccessibilityProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
