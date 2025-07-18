"use client"

import { Suspense, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils" // Assuming cn utility is available
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

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

export default function UnifiedFloatingWrapper() {
  const [isHidden, setIsHidden] = useState(false)
  const [activePanel, setActivePanel] = useState<"none" | "chatbot" | "share">("none")

  const handlePanelClick = useCallback((panelName: "chatbot" | "share") => {
    setActivePanel(panelName)
  }, [])

  // Define base z-index values
  const baseZIndex = 997
  const activeZIndex = 999

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-[1001] rounded-full w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsHidden(!isHidden)}
        aria-label={isHidden ? "Show panels" : "Hide panels"}
      >
        {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      {!isHidden && (
        <Suspense fallback={null}>
          <FloatingCartButton />
          <PersistentBookNowButton />
          <AccessibilityToolbar />

          {/* Chatbot Panel */}
          <div
            className={cn("fixed", {
              [`z-[${activePanel === "chatbot" ? activeZIndex : baseZIndex}]`]: true,
            })}
          >
            <CollapsibleChatbotPanel onPanelClick={handlePanelClick} />
          </div>

          {/* Share Panel */}
          <div
            className={cn("fixed", {
              [`z-[${activePanel === "share" ? activeZIndex : baseZIndex}]`]: true,
            })}
          >
            <CollapsibleSharePanel onPanelClick={handlePanelClick} />
          </div>
        </Suspense>
      )}
    </>
  )
}
