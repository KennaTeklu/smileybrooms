"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Track page view
    trackEvent("page_view", {
      page: pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
    })
  }, [pathname, trackEvent])

  return null
}
