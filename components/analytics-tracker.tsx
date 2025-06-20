"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only track if NEXT_PUBLIC_ENABLE_ANALYTICS is explicitly set to 'true'
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") {
      const url = `${pathname}?${searchParams.toString()}`
      // In a real application, you would send this data to an analytics service
      // For demonstration, we'll log it to the console.
      console.log("[CLIENT ANALYTICS] Page view:", {
        page: url,
        timestamp: new Date().toISOString(),
        // userAgent and screen dimensions would typically be collected client-side
        // For this example, we'll omit them or get them from browser APIs if needed.
      })
    }
  }, [pathname, searchParams])

  return null // This component does not render any UI
}
