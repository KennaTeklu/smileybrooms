"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the floating components
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

const CollapsibleChatbotPanel = dynamic(() => import("./collapsible-chatbot-panel"), {
  ssr: false,
  loading: () => null,
})

const CollapsibleSharePanel = dynamic(() => import("./collapsible-share-panel"), {
  ssr: false,
  loading: () => null,
})

const CollapsibleSettingsPanel = dynamic(() => import("./collapsible-settings-panel"), {
  ssr: false,
  loading: () => null,
})

export default function UnifiedFloatingWrapper() {
  // No activePanel state needed here, as each panel manages its own expanded state
  // and their expanded positions are fixed at the top. Z-index will handle overlaps.

  return (
    <Suspense fallback={null}>
      <FloatingCartButton />
      <PersistentBookNowButton />
      <AccessibilityToolbar />

      {/* Chatbot Panel (bottom-right when collapsed, top-right when expanded) */}
      <CollapsibleChatbotPanel />

      {/* Share Panel (bottom-left when collapsed, top-left when expanded) */}
      <CollapsibleSharePanel />

      {/* Settings Panel (bottom-center when collapsed, top-center when expanded) */}
      <CollapsibleSettingsPanel />
    </Suspense>
  )
}
