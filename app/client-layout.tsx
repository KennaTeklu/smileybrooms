"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context"
import { QueryClientProvider } from "@/components/providers/query-client-provider"
import { CookieConsentManager } from "@/components/legal/cookie-consent-manager"
import { AbandonmentProvider } from "@/components/abandonment/abandonment-provider"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useBatteryStatus } from "@/hooks/use-battery-status"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useVibration } from "@/hooks/use-vibration"
import { useWebShare } from "@/hooks/use-web-share"
import { useWebAuthn } from "@/hooks/use-web-authn"
import { useClipboard } from "@/hooks/use-clipboard"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVoiceCommands } from "@/lib/voice/voice-command-engine"
import { useTour } from "@/hooks/use-tour"
import { Toaster } from "@/components/ui/toaster"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useFeatureFlag } from "@/lib/server/feature-key"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { EnhancedHeader } from "@/components/enhanced-header"
import { UnifiedFooter } from "@/components/unified-footer"
import { ChatbotController } from "@/components/chatbot-controller"
import { EnhancedWebsiteTour } from "@/components/tour/enhanced-website-tour"
import { ImprovedTermsModal } from "@/components/improved-terms-modal"
import { RoomProvider } from "@/lib/room-context"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAnalytics } from "@/hooks/use-analytics" // Import the useAnalytics hook

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { applyAccessibilityPreferences } = useAccessibility()
  const [arePanelsVisible, setArePanelsVisible] = useState(true)

  // Feature flags
  const enableAnalytics = useFeatureFlag("NEXT_PUBLIC_ENABLE_ANALYTICS")
  const enableMultiLanguage = useFeatureFlag("NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE")
  const enableVersionComparison = useFeatureFlag("NEXT_PUBLIC_ENABLE_VERSION_COMPARISON")
  const enableAdminInterface = useFeatureFlag("NEXT_PUBLIC_ENABLE_ADMIN_INTERFACE")
  const enableAnalyticsTracking = useFeatureFlag("NEXT_PUBLIC_ENABLE_ANALYTICS_TRACKING")
  const enableEmailConfirmation = useFeatureFlag("NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION")
  const enableChatbot = useFeatureFlag("NEXT_PUBLIC_CHATBOT_ENABLED")
  const enableAccessibilityToolbar = useFeatureFlag("NEXT_PUBLIC_ACCESSIBILITY_TOOLBAR_ENABLED")
  const enableWebsiteTour = useFeatureFlag("NEXT_PUBLIC_WEBSITE_TOUR_ENABLED")
  const enableAbandonmentRescue = useFeatureFlag("NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE")
  const enableTermsAgreementPopup = useFeatureFlag("NEXT_PUBLIC_FEATURE_TERMS_AGREEMENT_POPUP")
  const enableDynamicPaymentOptions = useFeatureFlag("NEXT_PUBLIC_FEATURE_DYNAMIC_PAYMENT_OPTIONS")
  const enableEnhancedAccessibility = useFeatureFlag("NEXT_PUBLIC_FEATURE_ENHANCED_ACCESSIBILITY")
  const enableGeolocationServices = useFeatureFlag("NEXT_PUBLIC_FEATURE_GEOLOCATION_SERVICES")
  const enableBiometricAuthentication = useFeatureFlag("NEXT_PUBLIC_FEATURE_BIOMETRIC_AUTHENTICATION")
  const enableWebShareAPI = useFeatureFlag("NEXT_PUBLIC_FEATURE_WEB_SHARE_API")
  const enableVoiceCommands = useFeatureFlag("NEXT_PUBLIC_FEATURE_VOICE_COMMANDS")
  const enablePerformanceMonitoring = useFeatureFlag("NEXT_PUBLIC_FEATURE_PERFORMANCE_MONITORING")
  const enableNetworkStatusIndicator = useFeatureFlag("NEXT_PUBLIC_FEATURE_NETWORK_STATUS_INDICATOR")
  const enableBatteryStatusOptimization = useFeatureFlag("NEXT_PUBLIC_FEATURE_BATTERY_STATUS_OPTIMIZATION")
  const enableVibrationFeedback = useFeatureFlag("NEXT_PUBLIC_FEATURE_VIBRATION_FEEDBACK")
  const enableKeyboardShortcuts = useFeatureFlag("NEXT_PUBLIC_FEATURE_KEYBOARD_SHORTCUTS")
  const enableClipboardIntegration = useFeatureFlag("NEXT_PUBLIC_FEATURE_CLIPBOARD_INTEGRATION")
  const enableDragAndDropSupport = useFeatureFlag("NEXT_PUBLIC_FEATURE_DRAG_AND_DROP_SUPPORT")
  const enableCookieConsentManager = useFeatureFlag("NEXT_PUBLIC_FEATURE_COOKIE_CONSENT_MANAGER")

  // Hooks for various features, always called in the same order
  const analyticsHook = useAnalytics()
  const networkStatusHook = useNetworkStatus()
  const batteryStatusHook = useBatteryStatus()
  const performanceMonitorHook = usePerformanceMonitor()
  const geolocationHook = useGeolocation()
  const vibrationHook = useVibration()
  const webShareHook = useWebShare()
  const webAuthnHook = useWebAuthn()
  const clipboardHook = useClipboard()
  const keyboardShortcutsHook = useKeyboardShortcuts()
  const voiceCommandsHook = useVoiceCommands()
  const tourHook = useTour()

  // Apply accessibility preferences on mount and when preferences change
  useEffect(() => {
    applyAccessibilityPreferences()
  }, [applyAccessibilityPreferences])

  const isPricingPage = pathname === "/pricing"
  const isCheckoutPage = pathname.startsWith("/checkout")
  const isCartPage = pathname === "/cart"

  return (
    <QueryClientProvider>
      <AccessibilityProvider>
        <CartProvider>
          <RoomProvider>
            {enableAbandonmentRescue && <AbandonmentProvider />}
            {enableTermsAgreementPopup && <ImprovedTermsModal />}
            {enableCookieConsentManager && <CookieConsentManager />}

            <div className="flex min-h-screen flex-col">
              <EnhancedHeader />
              <main className="flex-1">{children}</main>
              <UnifiedFooter />
            </div>

            {isPricingPage && <CollapsibleAddAllPanel />}
            {isCartPage && <CollapsibleCartPanel />}
            {!isCheckoutPage && !isCartPage && <FloatingCartButton />}

            {enableChatbot && <ChatbotController />}
            {enableWebsiteTour && <EnhancedWebsiteTour />}
            <Toaster />

            {/* Toggle button for panels */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full bg-gray-800/90 text-white shadow-lg hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                onClick={() => setArePanelsVisible(!arePanelsVisible)}
                aria-label={arePanelsVisible ? "Hide panels" : "Show panels"}
              >
                {arePanelsVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>

            {/* Centered Fixed Panels - Solution 2 */}
            <AnimatePresence>
              {arePanelsVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="centered-fixed-panels"
                >
                  <CollapsibleSettingsPanel />
                  <CollapsibleSharePanel />
                  <CollapsibleChatbotPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </RoomProvider>
        </CartProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  )
}
