import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import EnhancedNavigation from "@/components/enhanced-navigation"
import { PersistentBookNowButton } from "@/components/persistent-book-now-button"
import UnifiedFooter from "@/components/unified-footer"
import PageViewTracker from "@/components/page-view-tracker"
import { PhoneNumberProvider } from "@/components/providers/phone-number-provider"
import { SupportBotProvider } from "@/lib/support-bot-context"
import { SupportBot } from "@/components/support-bot"
import { CartProvider } from "@/lib/cart-context"
import { SkipToContent } from "@/components/skip-to-content"
import { ScreenReaderAnnouncer } from "@/components/screen-reader-announcer"
import { TranslationProvider } from "@/lib/i18n/client"
import UnifiedActionButtons from "@/components/unified-action-buttons"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smiley Brooms - Professional Cleaning Services",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TranslationProvider>
            <PhoneNumberProvider>
              <CartProvider>
                <SupportBotProvider>
                  <PageViewTracker />
                  <SkipToContent />
                  <EnhancedNavigation />
                  <main id="main-content" className="pt-16">
                    {children}
                  </main>
                  <PersistentBookNowButton />
                  <UnifiedActionButtons />
                  <UnifiedFooter />
                  <SupportBot />
                  <Toaster />
                  <ScreenReaderAnnouncer messages={[]} />
                </SupportBotProvider>
              </CartProvider>
            </PhoneNumberProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
