import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import Footer from "@/components/footer" // Corrected import to default export
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TourProvider } from "@/contexts/tour-context"
import { TooltipProvider } from "@/components/ui/tooltip"
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
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AccessibilityProvider>
              <CartProvider>
                <RoomProvider>
                  <TourProvider>
                    <TooltipProvider>
                      <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                      </div>
                      <Toaster />

                      {/* Fixed Panels Container */}
                      <div className="fixed top-20 left-0 z-50">
                        <CollapsibleSettingsPanel />
                      </div>

                      <div className="fixed top-20 right-0 z-50 flex flex-col items-end space-y-5">
                        <CollapsibleSharePanel />
                        <CollapsibleChatbotPanel />
                      </div>
                    </TooltipProvider>
                  </TourProvider>
                </RoomProvider>
              </CartProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
