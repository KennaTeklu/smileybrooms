import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { TourProvider } from "@/contexts/tour-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description: "Professional cleaning services that bring smiles to your home",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccessibilityProvider>
            <CartProvider>
              <TourProvider>
                <div className="min-h-screen flex flex-col">
                  <EnhancedHeader />
                  <main className="flex-1">{children}</main>
                  <EnhancedFooter />
                </div>
                <Toaster />
              </TourProvider>
            </CartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
