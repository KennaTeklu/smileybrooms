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

const AccessibilityToolbar = dynamic(() => import("./accessibility-toolbar"), {
  ssr: false,
  loading: () => null,
})

export default function UnifiedFloatingWrapper() {
  return (
    <Suspense fallback={null}>
      <FloatingCartButton />
      <PersistentBookNowButton />
      <AccessibilityToolbar />
    </Suspense>
  )
}
