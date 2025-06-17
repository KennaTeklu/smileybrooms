"use client"

import { useCallback } from "react"
import { usePathname } from "next/navigation"

interface AnalyticsEvent {
  [key: string]: any
}

export function useAnalytics() {
  const pathname = usePathname()

  const trackEvent = useCallback(
    (eventName: string, properties?: AnalyticsEvent) => {
      // Send to server-side endpoint
      if (typeof window !== "undefined") {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName,
            properties: {
              ...properties,
              page: pathname,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              screenWidth: window.innerWidth,
              screenHeight: window.innerHeight,
            },
          }),
        }).catch((error) => console.error("Failed to send analytics event to server:", error))

        // Example: Google Analytics 4 (if gtag is available)
        if (window.gtag) {
          window.gtag("event", eventName, properties)
        }

        // Example: Facebook Pixel (if fbq is available)
        if (window.fbq) {
          window.fbq("track", eventName, properties)
        }

        // Console log for development
        if (process.env.NODE_ENV === "development") {
          console.log("✨ Analytics Event:", eventName, properties)
        }
      }
    },
    [pathname],
  )

  const trackPageView = useCallback(
    (page: string) => {
      trackEvent("page_view", { page })
    },
    [trackEvent],
  )

  const trackPurchase = useCallback(
    (value: number, currency = "USD", transactionId?: string, items?: any[]) => {
      trackEvent("purchase", { value, currency, transactionId, items })
    },
    [trackEvent],
  )

  const trackButtonClick = useCallback(
    (buttonName: string, location?: string, additionalData?: AnalyticsEvent) => {
      trackEvent("button_click", { buttonName, location, ...additionalData })
    },
    [trackEvent],
  )

  const trackFormSubmission = useCallback(
    (formName: string, status: "success" | "failure", error?: string, additionalData?: AnalyticsEvent) => {
      trackEvent("form_submission", { formName, status, error, ...additionalData })
    },
    [trackEvent],
  )

  const trackElementVisibility = useCallback(
    (elementName: string, isVisible: boolean, additionalData?: AnalyticsEvent) => {
      trackEvent("element_visibility", { elementName, isVisible, ...additionalData })
    },
    [trackEvent],
  )

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackButtonClick,
    trackFormSubmission,
    trackElementVisibility,
  }
}

// Extend window type for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
    analytics?: {
      track: (event: string, properties?: any) => void
    }
  }
}
