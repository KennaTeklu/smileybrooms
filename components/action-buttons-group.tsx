"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SharePanel } from "@/components/share-panel"
import { AccessibilityPanel } from "@/components/accessibility-panel"
import { Settings, Share2, Accessibility } from "lucide-react"

export function ActionButtonsGroup() {
  const [activePanel, setActivePanel] = useState(null)

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      <div className="relative">
        {activePanel === "share" && <SharePanel />}
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full shadow-md ${
            activePanel === "share" ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
          }`}
          onClick={() => togglePanel("share")}
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>

      <div className="relative">
        {activePanel === "accessibility" && <AccessibilityPanel />}
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full shadow-md ${
            activePanel === "accessibility" ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
          }`}
          onClick={() => togglePanel("accessibility")}
        >
          <Accessibility className="h-5 w-5" />
          <span className="sr-only">Accessibility</span>
        </Button>
      </div>

      <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white dark:bg-gray-800" asChild>
        <a href="/settings">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </a>
      </Button>
    </div>
  )
}
