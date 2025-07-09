"use client"

import { useCallback } from "react"

interface AnalyticsEvent {
  [key: string]: any
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: AnalyticsEvent) => {
    // Mock analytics tracking - replace with your analytics provider
    if (typeof window !== "undefined") {
      console.log("Analytics Event:", eventName, properties)

      // Example: Google Analytics 4
      if (window.gtag) {
        window.gtag("event", eventName, properties)
      }

      // Example: Facebook Pixel
      if (window.fbq) {
        window.fbq("track", eventName, properties)
      }

      // Example: Custom analytics
      if (window.analytics) {
        window.analytics.track(eventName, properties)
      }
    }
  }, [])

  const trackPageView = useCallback(
    (page: string) => {
      trackEvent("page_view", { page })
    },
    [trackEvent],
  )

  const trackPurchase = useCallback(
    (value: number, currency = "USD") => {
      trackEvent("purchase", { value, currency })
    },
    [trackEvent],
  )

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
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
