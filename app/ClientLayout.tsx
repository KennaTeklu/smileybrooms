"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SemicircleFooter from "@/components/semicircle-footer"
import ClientOnlyWrapper from "@/components/client-only-wrapper" // Corrected to default import
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { useState, useCallback } from "react"
import type React from "react"
import { Suspense } from "react"
import { QueryClientProvider } from "@/components/providers/query-client-provider" // Ensure QueryClientProvider is imported

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false)
  const [isShareExpanded, setIsShareExpanded] = useState(false)
  const [isAddAllExpanded, setIsAddAllExpanded] = useState(false)

  const [chatbotHeight, setChatbotHeight] = useState(0)
  const [shareHeight, setShareHeight] = useState(0)
  const [addAllHeight, setAddAllHeight] = useState(0)

  const calculateDynamicTop = useCallback(
    (panelType: "chatbot" | "share" | "addAll") => {
      let offset = 20 // Base offset from the bottom

      // Chatbot is always at the bottom, so its offset is fixed
      // Share panel is above chatbot
      if (panelType === "share") {
        if (isChatbotExpanded) {
          offset += chatbotHeight + 10 // Add chatbot height + margin
        }
      }
      // AddAll panel is above share panel
      if (panelType === "addAll") {
        if (isChatbotExpanded) {
          offset += chatbotHeight + 10
        }
        if (isShareExpanded) {
          offset += shareHeight + 10
        }
      }
      return offset
    },
    [isChatbotExpanded, isShareExpanded, chatbotHeight, shareHeight],
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryClientProvider>
            <ClientOnlyWrapper>
              <Suspense>{children}</Suspense>
              <Toaster />
              <SemicircleFooter />

              {/* Collapsible Panels */}
              <CollapsibleChatbotPanel
                isExpanded={isChatbotExpanded}
                setIsExpanded={setIsChatbotExpanded}
                setPanelHeight={setChatbotHeight}
                dynamicBottom={calculateDynamicTop("chatbot")}
              />
              <CollapsibleSharePanel
                isExpanded={isShareExpanded}
                setIsExpanded={setIsShareExpanded}
                setPanelHeight={setShareHeight}
                dynamicBottom={calculateDynamicTop("share")}
              />
              <CollapsibleAddAllPanel
                isExpanded={isAddAllExpanded}
                setIsExpanded={setIsAddAllExpanded}
                setPanelHeight={setAddAllHeight}
                dynamicBottom={calculateDynamicTop("addAll")}
              />
            </ClientOnlyWrapper>
          </QueryClientProvider>
          <AnalyticsTracker />
        </ThemeProvider>
      </body>
    </html>
  )
}
