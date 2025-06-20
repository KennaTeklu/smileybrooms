"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SemicircleFooter from "@/components/semicircle-footer"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { ClientOnlyWrapper } from "@/components/client-only-wrapper"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { useState, useCallback } from "react"
import type React from "react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false)
  const [isAddAllPanelOpen, setIsAddAllPanelOpen] = useState(false)
  const [isChatbotPanelOpen, setIsChatbotPanelOpen] = useState(false)

  const [sharePanelHeight, setSharePanelHeight] = useState(0)
  const [addAllPanelHeight, setAddAllPanelHeight] = useState(0)
  const [chatbotPanelHeight, setChatbotPanelHeight] = useState(0)

  const calculateDynamicTop = useCallback(
    (panelName: "share" | "addAll" | "chatbot") => {
      let topOffset = 20 // Base offset from the top

      if (panelName === "share") {
        // Share panel is always at the top if open
        return topOffset
      }

      if (panelName === "addAll") {
        if (isSharePanelOpen) {
          topOffset += sharePanelHeight + 10 // Add share panel height + margin
        }
        return topOffset
      }

      if (panelName === "chatbot") {
        if (isSharePanelOpen) {
          topOffset += sharePanelHeight + 10
        }
        if (isAddAllPanelOpen) {
          topOffset += addAllPanelHeight + 10
        }
        return topOffset
      }

      return topOffset
    },
    [isSharePanelOpen, isAddAllPanelOpen, sharePanelHeight, addAllPanelHeight, chatbotPanelHeight],
  ) // Include all heights in dependency array

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryClientProvider>
            <ClientOnlyWrapper>
              <Suspense>{children}</Suspense>
              <Toaster />
              <SemicircleFooter />

              <CollapsibleSharePanel
                isOpen={isSharePanelOpen}
                onClose={() => setIsSharePanelOpen(false)}
                shareUrl={typeof window !== "undefined" ? window.location.href : ""}
                shareText="Check out this awesome cleaning service!"
                dynamicTop={calculateDynamicTop("share")}
                setPanelHeight={setSharePanelHeight}
              />
              <CollapsibleAddAllPanel
                isOpen={isAddAllPanelOpen}
                onClose={() => setIsAddAllPanelOpen(false)}
                onAddAll={() => console.log("Add all clicked")} // Placeholder, actual logic in PriceCalculator
                totalRooms={0} // Placeholder
                totalPrice={0} // Placeholder
                dynamicTop={calculateDynamicTop("addAll")}
                setPanelHeight={setAddAllPanelHeight}
              />
              <CollapsibleChatbotPanel
                isOpen={isChatbotPanelOpen}
                onClose={() => setIsChatbotPanelOpen(false)}
                dynamicTop={calculateDynamicTop("chatbot")}
                setPanelHeight={setChatbotPanelHeight}
              />
            </ClientOnlyWrapper>
          </QueryClientProvider>
          <AnalyticsTracker />
        </ThemeProvider>
      </body>
    </html>
  )
}
