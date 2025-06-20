import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { PricingProvider } from "@/contexts/pricing-context"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import ClientLayout from "./ClientLayout" // Import the new ClientLayout
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PricingProvider>
            <CartProvider>
              <Suspense>
                <ClientLayout>{children}</ClientLayout>
              </Suspense>
            </CartProvider>
          </PricingProvider>
          <Toaster />
          <AnalyticsTracker />
        </ThemeProvider>
      </body>
    </html>
  )
}
