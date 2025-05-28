"use client"

import { useCallback } from "react"

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== "undefined") {
      // Mock analytics tracking
      console.log("Analytics Event:", event)

      // In a real implementation, you would send to your analytics service
      // Example: gtag('event', event.name, event.properties)
    }
  }, [])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      console.log("Analytics Identify:", { userId, traits })
    }
  }, [])

  const page = useCallback((name: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      console.log("Analytics Page:", { name, properties })
    }
  }, [])

  return { track, identify, page }
}
