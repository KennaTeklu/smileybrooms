"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const FloatingCartButton = dynamic(() => import("./floating-cart-button"), {
  ssr: false,
  loading: () => null,
})

const PersistentBookNowButton = dynamic(() => import("./persistent-book-now-button"), {
  ssr: false,
  loading: () => null,
})

// Import the new unified side panel
const UnifiedSidePanel = dynamic(() => import("./unified-side-panel"), {
  ssr: false,
  loading: () => null,
})

export default function UnifiedFloatingWrapper() {
  return (
    <Suspense fallback={null}>
      <FloatingCartButton />
      <PersistentBookNowButton />
      {/* Render the new unified side panel */}
      <UnifiedSidePanel />
    </Suspense>
  )
}
