import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TourProvider } from "@/contexts/tour-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { AddAllToCartModal } from "@/components/add-all-to-cart-modal"
import { EnhancedCart } from "@/components/enhanced-cart"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description: "Professional cleaning services that bring joy to your home",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AccessibilityProvider>
              <CartProvider>
                <TourProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <EnhancedHeader />
                    <main className="flex-1">{children}</main>
                    <EnhancedFooter />
                  </div>

                  {/* Left side panels */}
                  <CollapsibleSettingsPanel />

                  {/* Right side panels */}
                  <CollapsibleSharePanel />
                  <AddAllToCartModal />
                  <EnhancedCart />

                  <Toaster />
                </TourProvider>
              </CartProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
