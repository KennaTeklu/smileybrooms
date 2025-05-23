import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import EnhancedNavigation from "@/components/enhanced-navigation"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import UnifiedFooter from "@/components/unified-footer"
import AccessibilityPanel from "@/components/accessibility-panel"
import SharePanel from "@/components/share-panel"
import { CartProvider } from "@/lib/cart-context"
import { Breadcrumb } from "@/components/breadcrumb"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "smileybrooms - Professional Cleaning Services",
  description: "Professional cleaning services for homes and offices with a smile.",
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
          <CartProvider>
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white dark:focus:bg-gray-900 focus:z-50"
            >
              Skip to content
            </a>

            <EnhancedNavigation />

            <div className="container mx-auto px-4">
              <Breadcrumb />
            </div>

            <main id="main-content" className="pt-4">
              {children}
            </main>

            <PersistentBookNowButton />
            <AccessibilityPanel />
            <SharePanel />
            <UnifiedFooter />
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
