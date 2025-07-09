import type React from "react"
import "./globals.css"
import "./accessibility.css"
import "./device-themes.css"
import "./payment-themes.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Smileybrooms",
  description: "Professional cleaning services for your home and office.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />

          {/* Fixed panels container on the left */}
          <div className="fixed left-0 top-20 z-50">
            <CollapsibleSettingsPanel />
          </div>

          {/* Fixed panels container on the right */}
          <div className="fixed right-0 top-20 z-50 flex flex-col items-end space-y-5">
            <CollapsibleSharePanel />
            <CollapsibleChatbotPanel />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
