import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartPanelVisibilityProvider } from "@/contexts/cart-panel-visibility-context"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/shopping-cart-context"
import { QueryClientProvider } from "@/components/query-client-provider"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Toaster } from "@/components/ui/toaster"
import { ProductionCartSystem } from "@/components/production-cart-system"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <QueryClientProvider>
              <AnalyticsTracker />
              <CartPanelVisibilityProvider>
                <ProductionCartSystem />
                {children}
              </CartPanelVisibilityProvider>
              <Toaster />
            </QueryClientProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
