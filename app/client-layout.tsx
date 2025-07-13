"use client"

import type React from "react"

import { RoomProvider } from "@/lib/room-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { ChatbotManager } from "@/components/chatbot-manager"
import { TourProvider } from "@/contexts/tour-context"
import { CookieConsentManager } from "@/components/legal/cookie-consent-manager"
import { TermsAgreementPopup } from "@/components/terms-agreement-popup"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showFloatingElements, setShowFloatingElements] = useState(true)

  useEffect(() => {
    // Hide floating elements on checkout pages
    if (pathname.startsWith("/checkout") || pathname.startsWith("/success") || pathname.startsWith("/canceled")) {
      setShowFloatingElements(false)
    } else {
      setShowFloatingElements(true)
    }
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccessibilityProvider>
        <RoomProvider>
          <CartProvider>
            <AbandonmentProvider>
              <TourProvider>
                {children}
                <Toaster />
                {process.env.NEXT_PUBLIC_FEATURE_AI_POWERED_CHATBOT === "true" && <ChatbotManager />}
                {process.env.NEXT_PUBLIC_FEATURE_TERMS_AGREEMENT_POPUP === "true" && <TermsAgreementPopup />}
                {process.env.NEXT_PUBLIC_FEATURE_COOKIE_CONSENT_MANAGER === "true" && <CookieConsentManager />}

                {showFloatingElements && (
                  <>
                    {process.env.NEXT_PUBLIC_FEATURE_FLOATING_CART_BUTTON === "true" && <FloatingCartButton />}
                    {process.env.NEXT_PUBLIC_FEATURE_ADVANCED_CART === "true" && <CollapsibleAddAllPanel />}
                    {process.env.NEXT_PUBLIC_FEATURE_AI_POWERED_CHATBOT === "true" && <CollapsibleChatbotPanel />}
                    {process.env.NEXT_PUBLIC_FEATURE_WEB_SHARE_API === "true" && <CollapsibleSharePanel />}
                    {process.env.NEXT_PUBLIC_FEATURE_ENHANCED_ACCESSIBILITY === "true" && <CollapsibleSettingsPanel />}
                  </>
                )}
              </TourProvider>
            </AbandonmentProvider>
          </CartProvider>
        </RoomProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
