"use client"

import dynamic from "next/dynamic"

const FloatingCartButton = dynamic(() => import("./floating-cart-button"), {
  ssr: false,
})

const PersistentBookNowButton = dynamic(() => import("./persistent-book-now-button"), {
  ssr: false,
})

const AccessibilityToolbar = dynamic(() => import("./accessibility-toolbar"), {
  ssr: false,
})

export default function UnifiedFloatingWrapper() {
  return (
    <>
      <FloatingCartButton />
      <PersistentBookNowButton />
      <AccessibilityToolbar />
    </>
  )
}
