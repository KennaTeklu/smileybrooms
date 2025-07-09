"use client"

import type React from "react"
import { Suspense, useState } from "react"
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
import Footer from "@/components/footer"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { AnalyticsTracker } from "@/components/analytics-tracker"

const inter = Inter({ subsets: ["latin"] })

/**
 * Information reported from CollapsibleSharePanel so the chatbot
 * can stay exactly 100 px below its bottom edge.
 */
type SharePanelInfo = {
  expanded: boolean
  top: number
  height: number
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sharePanelInfo, setSharePanelInfo] = useState<SharePanelInfo>({
    expanded: false,
    top: 0,
    height: 0,
  })

  return (
    <QueryClientProvider>
      <ThemeProviderEnhanced>
        <AccessibilityProvider>
          <CartProvider>
            <RoomProvider>
              <TourProvider>
                <AbandonmentProvider>
                  <TooltipProvider>
                    <div className={`${inter.className} relative flex min-h-screen flex-col`}>
                      <EnhancedHeader />

                      <Suspense>
                        <main className="flex-1">{children}</main>
                      </Suspense>

                      <Footer />
                    </div>

                    {/* Floating / collapsible utilities */}
                    <CollapsibleSettingsPanel />
                    <CollapsibleSharePanel onPanelStateChange={setSharePanelInfo} />
                    <CollapsibleAddAllPanel />
                    <CollapsibleCartPanel />

                    {/* Chatbot that follows Share panel */}
                    <CollapsibleChatbotPanel sharePanelInfo={sharePanelInfo} />

                    <Toaster />
                    <AnalyticsTracker />
                  </TooltipProvider>
                </AbandonmentProvider>
              </TourProvider>
            </RoomProvider>
          </CartProvider>
        </AccessibilityProvider>
      </ThemeProviderEnhanced>
    </QueryClientProvider>
  )
}
