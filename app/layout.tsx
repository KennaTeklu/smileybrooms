import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./client-layout" // Import the client layout
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms",
  description: "Professional cleaning services for your home and office.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientLayout>
            {children}
            {/* Fixed panels for global access, now centered */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
              <CollapsibleSettingsPanel />
              <CollapsibleSharePanel />
              <CollapsibleChatbotPanel />
              {/* CollapsibleAddAllPanel is now rendered directly on pricing page */}
            </div>
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
