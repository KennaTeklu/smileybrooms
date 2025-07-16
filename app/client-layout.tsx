"use client"

import type React from "react"

import { RoomProvider } from "@/lib/room-context"
import { CartProvider } from "@/lib/cart-context"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { TourProvider } from "@/contexts/tour-context"
import { CookieConsentManager } from "@/components/legal/cookie-consent-manager"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { EnhancedHeader } from "@/components/enhanced-header"
import UnifiedFooter from "@/components/unified-footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <QueryClientProviderWrapper>
      <AccessibilityProvider>
        <RoomProvider>
          <CartProvider>
            <AbandonmentProvider>
              <TourProvider>
                <EnhancedHeader />
                <main className="flex-1">{children}</main>
                <Toaster />
                <CookieConsentManager />
                <UnifiedFooter />
              </TourProvider>
            </AbandonmentProvider>
          </CartProvider>
        </RoomProvider>
      </AccessibilityProvider>
    </QueryClientProviderWrapper>
  )
}
