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
import { TooltipProvider } from "@/components/ui/tooltip"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider" // Ensure this is imported
import { AnalyticsTracker } from "@/components/analytics-tracker" // Import the new component
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "smileybrooms - Professional Cleaning Services", // Metadata title is plain text
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
        <QueryClientProvider>
          <ThemeProviderEnhanced>
            <AccessibilityProvider>
              <CartProvider>
                <RoomProvider>
                  <TourProvider>
                    <AbandonmentProvider>
                      {" "}
                      {/* Ensure AbandonmentProvider wraps content */}
                      <TooltipProvider>
                        {/* Main layout container */}
                        <div className="relative flex min-h-screen flex-col">
                          <EnhancedHeader />
                          <Suspense>
                            <main className="flex-1">{children}</main>
                          </Suspense>
                          <EnhancedFooter />
                        </div>
                        {/* Left side panels */}
                        <CollapsibleSettingsPanel />
                        {/* Right side panels - properly aligned */}
                        <CollapsibleSharePanel />
                        <CollapsibleAddAllPanel />
                        <CollapsibleCartPanel />
                        <Toaster />
                        <AnalyticsTracker /> {/* Add the AnalyticsTracker here */}
                      </TooltipProvider>
                    </AbandonmentProvider>
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
