import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProviderEnhanced } from "@/components/theme-provider-enhanced"
import Header from "@/components/header"
import Footer from "@/components/footer" // Corrected import to default
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context"
import { RoomProvider } from "@/lib/room-context"
import { TourProvider } from "@/contexts/tour-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smileybrooms - Professional Cleaning Services",
  description: "Your trusted partner for a sparkling clean home or office.",
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
          <ThemeProviderEnhanced attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AccessibilityProvider>
              <CartProvider>
                <RoomProvider>
                  <TourProvider>
                    <TooltipProvider>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <Toaster />

                        {/* Fixed panels container */}
                        <div className="fixed left-0 top-20 z-50">
                          <CollapsibleSettingsPanel />
                        </div>

                        <div className="fixed right-0 top-20 z-50 flex flex-col items-end space-y-5">
                          <CollapsibleSharePanel />
                          <CollapsibleChatbotPanel />
                        </div>
                      </div>
                    </TooltipProvider>
                  </TourProvider>
                </RoomProvider>
              </CartProvider>
            </AccessibilityProvider>
          </ThemeProviderEnhanced>
        </QueryClientProvider>
      </body>
    </html>
  )
}
