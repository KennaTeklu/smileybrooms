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
import { TermsEntryManager } from "@/components/terms-entry-manager"
import { TermsProvider } from "@/lib/terms-context"

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
          <TermsProvider>
            <CartProvider>
              <EnhancedNavigation />
              <div className="pt-16">{children}</div>
              <TermsEntryManager />
              <PersistentBookNowButton />
              <AccessibilityPanel />
              <SharePanel />
              <UnifiedFooter />
              <Toaster />
            </CartProvider>
          </TermsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
