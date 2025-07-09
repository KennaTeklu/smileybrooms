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
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description: "Professional cleaning services that bring joy to your home",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  generator: "v0.dev",
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
        {/* React Query / TanStack Query client */}
        <QueryClientProvider>
          {/* Theme & color-scheme handling */}
          <ThemeProviderEnhanced>
            {/* Global a11y context */}
            <AccessibilityProvider>
              {/* Shopping-cart context (fixes the runtime error) */}
              <CartProvider>
                {/* Room selection context */}
                <RoomProvider>
                  {/* Product-tour context */}
                  <TourProvider>
                    {/* Tooltips */}
                    <TooltipProvider>
                      {/* Main page structure */}
                      <div className="relative flex min-h-screen flex-col">
                        <EnhancedHeader />
                        <main className="flex-1">{children}</main>
                        <EnhancedFooter />
                      </div>

                      {/* Fixed utility panels */}
                      {/* Left – settings */}
                      <div className="fixed left-0 top-20 z-50">
                        <CollapsibleSettingsPanel />
                      </div>

                      {/* Right – share + chatbot (stacked with 20 px gap) */}
                      <div className="fixed right-0 top-20 z-50 flex flex-col items-end space-y-5">
                        <CollapsibleSharePanel />
                        <CollapsibleChatbotPanel />
                      </div>

                      {/* Other global floating panels */}
                      <CollapsibleAddAllPanel />
                      <CollapsibleCartPanel />

                      {/* Toasts */}
                      <Toaster />
                    </TooltipProvider>
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
