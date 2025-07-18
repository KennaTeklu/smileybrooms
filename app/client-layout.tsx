"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import UnifiedFooter from "@/components/unified-footer"
import { useAccessibility } from "@/lib/accessibility-context"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useBatteryStatus } from "@/hooks/use-battery-status"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
import { useVibration } from "@/hooks/use-vibration"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useWebShare } from "@/hooks/use-web-share"
import { useClipboard } from "@/hooks/use-clipboard"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useTour } from "@/hooks/use-tour"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEnhancedDeviceDetection } from "@/hooks/use-enhanced-device-detection"
import { useScrollPhysics } from "@/hooks/use-scroll-physics"
import { useFloatingUI } from "@/hooks/useFloatingUI"
import { useAdvancedAnimations } from "@/hooks/useAdvancedAnimations"
import { useAdvancedCartFeatures } from "@/hooks/useAdvancedCartFeatures"
import { useOptimizedRendering } from "@/hooks/useOptimizedRendering"
import { useProductionOptimizations } from "@/hooks/useProductionOptimizations"
import { useCartA11y } from "@/hooks/useCartA11y"
import { useCartAnimation } from "@/hooks/useCartAnimation"
import { useAdvancedCartPosition } from "@/hooks/useAdvancedCartPosition"
import { useScrollContainerDetection } from "@/hooks/useScrollContainerDetection"
import { usePhysicsAnimation } from "@/hooks/usePhysicsAnimation"
import { useCookieConsentManager } from "@/components/legal/cookie-consent-manager"
import { useTermsGatekeeper } from "@/components/terms-gatekeeper"
import { useChatbotController } from "@/components/chatbot-controller"
import { useWebsiteTour } from "@/components/tour/website-tour"
import { useAbandonmentRescue } from "@/components/abandonment/abandonment-provider"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { preferences } = useAccessibility()

  // Initialize all hooks
  useNetworkStatus()
  useBatteryStatus()
  usePerformanceMonitor()
  useVibration()
  useKeyboardShortcuts()
  useWebShare()
  useClipboard()
  useGeolocation()
  useTour()
  useAnalytics()
  useEnhancedDeviceDetection()
  useScrollPhysics()
  useFloatingUI()
  useAdvancedAnimations()
  useAdvancedCartFeatures()
  useOptimizedRendering()
  useProductionOptimizations()
  useCartA11y()
  useCartAnimation()
  useAdvancedCartPosition()
  useScrollContainerDetection()
  usePhysicsAnimation()
  useCookieConsentManager()
  useTermsGatekeeper()
  useChatbotController()
  useWebsiteTour()
  useAbandonmentRescue()

  // Apply accessibility preferences
  useEffect(() => {
    document.documentElement.style.fontSize = preferences.largeText ? "1.125rem" : "1rem"
    document.documentElement.style.setProperty("--text-alignment", preferences.textAlignment)
    document.documentElement.style.fontFamily = preferences.fontFamily
    document.documentElement.lang = preferences.language

    if (preferences.reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }

    if (preferences.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (preferences.screenReaderMode) {
      document.documentElement.classList.add("screen-reader-mode")
    } else {
      document.documentElement.classList.remove("screen-reader-mode")
    }

    if (preferences.keyboardNavigation) {
      document.documentElement.classList.add("keyboard-navigation")
    } else {
      document.documentElement.classList.remove("keyboard-navigation")
    }
  }, [preferences])

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <UnifiedFooter />
      {/* Fixed Panels */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <CollapsibleCartPanel />
        <CollapsibleSettingsPanel />
        <CollapsibleSharePanel />
        <CollapsibleChatbotPanel />
      </div>
    </>
  )
}
