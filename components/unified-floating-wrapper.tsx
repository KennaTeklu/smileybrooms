"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { CollapsibleSettingsPanel } from "./collapsible-settings-panel"
import { CollapsibleSharePanel } from "./collapsible-share-panel"
import { CollapsibleCartPanel } from "./collapsible-cart-panel"
import { CollapsibleChatbotPanel } from "./collapsible-chatbot-panel"
import PersistentBookNowButton from "./persistent-book-now-button"
import { useCart } from "@/lib/cart-context"

export default function UnifiedFloatingWrapper() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isCartPanelExpanded, setIsCartPanelExpanded] = useState(false)
  const [isSharePanelExpanded, setIsSharePanelExpanded] = useState(false)
  const [sharePanelHeight, setSharePanelHeight] = useState(0)

  // Determine if the PersistentBookNowButton should be shown
  const showBookNowButton = pathname !== "/pricing" && pathname !== "/calculator"

  // Determine if the Cart Panel should be shown
  const showCartPanel = cart.items && cart.items.length > 0

  // Callback for CollapsibleSharePanel to update its state
  const handleSharePanelStateChange = (info: { expanded: boolean; height: number }) => {
    setIsSharePanelExpanded(info.expanded)
    setSharePanelHeight(info.height)
  }

  return (
    <>
      {/* Persistent Book Now Button */}
      {showBookNowButton && <PersistentBookNowButton />}

      {/* Collapsible Settings Panel */}
      <CollapsibleSettingsPanel />

      {/* Collapsible Share Panel */}
      <CollapsibleSharePanel onPanelStateChange={handleSharePanelStateChange} />

      {/* Collapsible Cart Panel */}
      {showCartPanel && <CollapsibleCartPanel />}

      {/* Collapsible Chatbot Panel */}
      <CollapsibleChatbotPanel sharePanelInfo={{ expanded: isSharePanelExpanded, height: sharePanelHeight }} />
    </>
  )
}
