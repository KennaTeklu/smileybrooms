"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import AccessibilityPanel from "@/components/accessibility-panel"
import SharePanel from "@/components/share-panel"
import { FLOATING_LAYERS } from "@/lib/floating-system"
import { UnifiedFloatingWrapper } from "@/components/unified-floating-wrapper"

// Pages where floating controls should be hidden
const EXCLUDED_PATHS = ["/admin", "/dashboard", "/login", "/register", "/checkout", "/payment"]

export default function GlobalFloatingControls() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on excluded paths
  if (!mounted || EXCLUDED_PATHS.some((path) => pathname?.startsWith(path))) {
    return null
  }

  return (
    <>
      {/* Settings/Accessibility Panel - Left Side */}
      <UnifiedFloatingWrapper
        id="global-accessibility-panel"
        elementHeight={48}
        config={{
          layer: FLOATING_LAYERS.ACCESSIBILITY_PANEL,
          position: "left",
          offset: {
            bottom: 80,
            left: 0,
          },
          animation: {
            entrance: "slide",
            exit: "slide",
            duration: 300,
          },
        }}
      >
        <AccessibilityPanel />
      </UnifiedFloatingWrapper>

      {/* Share Panel - Right Side */}
      <UnifiedFloatingWrapper
        id="global-share-panel"
        elementHeight={48}
        config={{
          layer: FLOATING_LAYERS.FLOATING_BUTTONS,
          position: "right",
          offset: {
            bottom: 140,
            right: 0,
          },
          animation: {
            entrance: "slide",
            exit: "slide",
            duration: 300,
          },
        }}
      >
        <SharePanel />
      </UnifiedFloatingWrapper>
    </>
  )
}
