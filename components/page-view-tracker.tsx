"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface PageViewTrackerProps {
  pageName?: string
}

export function PageViewTracker({ pageName }: PageViewTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    try {
      // Track page view
      const pageToTrack = pageName || pathname

      // Example tracking code - replace with your actual analytics implementation
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: pageToTrack,
        })
      }

      console.log(`Page view tracked: ${pageToTrack}`)
    } catch (error) {
      console.error("Error tracking page view:", error)
    }
  }, [pathname, pageName])

  // This component doesn't render anything
  return null
}
