"\"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { track } from "@vercel/analytics"

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Only track if the path has changed
    if (previousPathRef.current !== pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

      // Track page view
      track("page_view", {
        page_path: pathname,
        page_url: url,
        page_title: document.title,
        referrer: document.referrer || "direct",
        timestamp: new Date().toISOString(),
      })

      // Update the previous path
      previousPathRef.current = pathname
    }
  }, [pathname, searchParams])

  // This component doesn't render anything
  return null
}

export default PageViewTracker
