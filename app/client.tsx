"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { FeedbackSurvey } from "@/components/feedback-survey"
import { Header } from "@/components/header"
import { UnifiedFooter } from "@/components/unified-footer"
import { TourProvider } from "@/contexts/tour-context"
import { PricingProvider } from "@/contexts/pricing-context"
import { ErrorBoundary } from "@/components/error-boundary"

import "@/styles/globals.css"
import "@/app/accessibility.css"
import "@/app/device-themes.css"
import "@/app/payment-themes.css"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <TourProvider>
              <PricingProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <UnifiedFooter />
                <FeedbackSurvey />
                <Toaster />
                <AnalyticsTracker />
              </PricingProvider>
            </TourProvider>
          </CartProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
