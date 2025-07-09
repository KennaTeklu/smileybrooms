"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { TourProvider } from "@/contexts/tour-context"
import { Header } from "@/components/header"
import UnifiedFloatingWrapper from "@/components/unified-floating-wrapper"
import UnifiedFooter from "@/components/unified-footer"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { ErrorBoundary } from "@/components/error-boundary"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Determine if the header should be shown based on pathname
  const showHeader = pathname !== "/checkout" && pathname !== "/success" && pathname !== "/canceled"

  return (
    <ErrorBoundary>
      <QueryClientProviderWrapper>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AccessibilityProvider>
            <CartProvider>
              <TourProvider>
                <AnalyticsTracker />
                {showHeader && <Header />}
                <main className="flex-grow">{children}</main>
                <UnifiedFooter />
                <UnifiedFloatingWrapper />
                <Toaster />
              </TourProvider>
            </CartProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryClientProviderWrapper>
    </ErrorBoundary>
  )
}
