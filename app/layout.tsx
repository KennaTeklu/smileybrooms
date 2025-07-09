import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TourProvider } from "@/contexts/tour-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

import "./globals.css"
import "./accessibility.css"
import "./device-themes.css"
import "./payment-themes.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Define the JotForm URL here
  const jotformUrl = "https://form.jotform.com/241896009000045" // Replace with your actual JotForm URL

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AccessibilityProvider>
            <CartProvider>
              <RoomProvider>
                <TourProvider>
                  <TooltipProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <Toaster />

                    {/* Fixed panels container */}
                    <div className="fixed top-20 left-0 z-50 flex flex-col items-start">
                      <CollapsibleSettingsPanel />
                    </div>

                    <div className="fixed top-20 right-0 z-50 flex flex-col items-end space-y-5">
                      <CollapsibleSharePanel />
                      <CollapsibleChatbotPanel jotformUrl={jotformUrl} />
                    </div>
                  </TooltipProvider>
                </TourProvider>
              </RoomProvider>
            </CartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
