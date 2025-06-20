"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RoomProvider } from "@/lib/room-context"
import { CartProvider } from "@/lib/cart-context"
import SemicircleFooter from "@/components/semicircle-footer"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { useState, useCallback } from "react"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { PricingProvider } from "@/contexts/pricing-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // State for each panel's expanded status and height
  const [sharePanelState, setSharePanelState] = useState({ isExpanded: false, height: 0 })
  const [chatbotPanelState, setChatbotPanelState] = useState({ isExpanded: false, height: 0 })
  const [addAllPanelState, setAddAllPanelState] = useState({ isExpanded: false, height: 0 })

  const PANEL_GAP = 10 // Gap in pixels between panels

  // Approximate collapsed heights for calculation when actual height isn't available yet
  const COLLAPSED_HEIGHT_SHARE = 60 // Approx height of collapsed share button
  const COLLAPSED_HEIGHT_CHATBOT = 60 // Approx height of collapsed chatbot button
  const COLLAPSED_HEIGHT_ADD_ALL = 70 // Approx height of collapsed add-all button

  // Calculate dynamic top positions for each panel
  // Panels are ordered by z-index (Chatbot highest, then Share, then AddAll)
  // So, Chatbot is at the top, Share is below Chatbot, AddAll is below Share.
  const getDynamicTop = useCallback(() => {
    const currentOffset = 20 // Initial offset from the top of the viewport for the highest panel (Chatbot)

    const tops = {
      chatbot: currentOffset,
      share: 0,
      addAll: 0,
    }

    // Calculate position for Share Panel (below Chatbot)
    const chatbotActualHeight = chatbotPanelState.isExpanded ? chatbotPanelState.height : COLLAPSED_HEIGHT_CHATBOT
    tops.share = currentOffset + chatbotActualHeight + PANEL_GAP

    // Calculate position for AddAll Panel (below Share Panel)
    const shareActualHeight = sharePanelState.isExpanded ? sharePanelState.height : COLLAPSED_HEIGHT_SHARE
    tops.addAll = tops.share + shareActualHeight + PANEL_GAP

    return tops
  }, [chatbotPanelState, sharePanelState])

  const dynamicTops = getDynamicTop()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RoomProvider>
        <CartProvider>
          <PricingProvider>
            <Suspense>
              {children}
              <CollapsibleChatbotPanel
                isExpanded={chatbotPanelState.isExpanded}
                setIsExpanded={(expanded) => setChatbotPanelState((prev) => ({ ...prev, isExpanded: expanded }))}
                setPanelHeight={(height) => setChatbotPanelState((prev) => ({ ...prev, height }))}
                dynamicTop={dynamicTops.chatbot}
              />
              <CollapsibleSharePanel
                isExpanded={sharePanelState.isExpanded}
                setIsExpanded={(expanded) => setSharePanelState((prev) => ({ ...prev, isExpanded: expanded }))}
                setPanelHeight={(height) => setSharePanelState((prev) => ({ ...prev, height }))}
                dynamicTop={dynamicTops.share}
              />
              <CollapsibleAddAllPanel
                isExpanded={addAllPanelState.isExpanded}
                setIsExpanded={(expanded) => setAddAllPanelState((prev) => ({ ...prev, isExpanded: expanded }))}
                setPanelHeight={(height) => setAddAllPanelState((prev) => ({ ...prev, height }))}
                dynamicTop={dynamicTops.addAll}
              />
              <Toaster />
              <SemicircleFooter />
              <AnalyticsTracker />
            </Suspense>
          </PricingProvider>
        </CartProvider>
      </RoomProvider>
    </ThemeProvider>
  )
}
