"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { useState } from "react" // Import useState

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [chatbotPanelInfo, setChatbotPanelInfo] = useState({ top: 0, height: 0, isExpanded: false })
  const [sharePanelInfo, setSharePanelInfo] = useState({ expanded: false, height: 0 }) // Keep this for chatbot to react to share panel

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <CollapsibleChatbotPanel
            sharePanelInfo={sharePanelInfo}
            onChatbotPanelChange={setChatbotPanelInfo} // Pass callback to update chatbot info
          />
          <CollapsibleSharePanel
            chatbotPanelInfo={chatbotPanelInfo} // Pass chatbot info to share panel
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
