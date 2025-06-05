import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import Header from "@/components/header"
import UnifiedFooter from "@/components/unified-footer"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import ClientLayout from "@/app/client-layout" // Import ClientLayout

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description: "Your trusted partner for sparkling clean homes and offices.",
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
          <AccessibilityProvider>
            <CartProvider>
              <AbandonmentProvider>
                <Header />
                <main className="flex-grow">
                  <ClientLayout>{children}</ClientLayout> {/* Wrap children with ClientLayout */}
                </main>
                <UnifiedFooter />
                <Toaster />
              </AbandonmentProvider>
            </CartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
