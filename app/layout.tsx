import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./device-themes.css"
import { ThemeProviderEnhanced } from "@/components/theme-provider-enhanced"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TourProvider } from "@/contexts/tour-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { AddAllToCartModal } from "@/components/add-all-to-cart-modal"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description: "Professional cleaning services that bring joy to your home",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider>
          <ThemeProviderEnhanced>
            <AccessibilityProvider>
              <CartProvider>
                <RoomProvider>
                  <TourProvider>
                    {/* Main layout container */}
                    <div className="relative flex min-h-screen flex-col">
                      <EnhancedHeader />
                      <main className="flex-1">{children}</main>
                      <EnhancedFooter />
                    </div>

                    {/* Left side panels */}
                    <CollapsibleSettingsPanel />

                    {/* Right side panels */}
                    <CollapsibleSharePanel />
                    <AddAllToCartModal />

                    {/* New Cart Panel - positioned below Add All to Cart */}
                    <CollapsibleCartPanel />

                    <Toaster />
                  </TourProvider>
                </RoomProvider>
              </CartProvider>
            </AccessibilityProvider>
          </ThemeProviderEnhanced>
        </QueryClientProvider>
      </body>
    </html>
  )
}
