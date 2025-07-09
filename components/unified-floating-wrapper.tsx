"use client"

import { Suspense, useState } from "react"
import dynamic from "next/dynamic"

const FloatingCartButton = dynamic(() => import("./floating-cart-button"), {
  ssr: false,
  loading: () => null,
})

const PersistentBookNowButton = dynamic(() => import("./persistent-book-now-button"), {
  ssr: false,
  loading: () => null,
})

const CollapsibleSharePanel = dynamic(() => import("./collapsible-share-panel"), {
  ssr: false,
  loading: () => null,
})

const CollapsibleChatbotPanel = dynamic(() => import("./collapsible-chatbot-panel"), {
  ssr: false,
  loading: () => null,
})

export default function UnifiedFloatingWrapper() {
  const [sharePanelInfo, setSharePanelInfo] = useState({ expanded: false, height: 0 })

  return (
    <Suspense fallback={null}>
      <FloatingCartButton />
      <PersistentBookNowButton />
      {/* Removed AccessibilityToolbar as per previous request */}
      <CollapsibleSharePanel onPanelStateChange={setSharePanelInfo} />
      <CollapsibleChatbotPanel sharePanelInfo={sharePanelInfo} />
    </Suspense>
  )
}
