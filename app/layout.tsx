import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalPanelControlProvider } from "@/contexts/global-panel-control-context"
import { CollapseAllPanelsButton } from "@/components/collapse-all-panels-button"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smiley Brooms Cleaning Service",
  description: "Professional cleaning services with a smile.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalPanelControlProvider>
            {children}
            <Toaster />

            {/* Floating panels and the new collapse button */}
            <CollapsibleCartPanel /> {/* This one is positioned independently */}

            <div className="centered-fixed-panels">
              <CollapsibleSettingsPanel />
              <CollapsibleSharePanel />
              <CollapsibleChatbotPanel />
              <CollapseAllPanelsButton /> {/* New button */}
            </div>
          </GlobalPanelControlProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
