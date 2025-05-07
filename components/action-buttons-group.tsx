"use client"

import { useState, useEffect } from "react"
import { Settings, Share2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ActionButtonsGroup() {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-panel]") && !target.closest("[data-button]")) {
        setActivePanel(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName)
  }

  return (
    <div
      className={`fixed z-50 flex ${isMobile ? "flex-col bottom-24 right-4 gap-2" : "flex-row top-20 right-4 gap-2"}`}
    >
      <Button
        variant="outline"
        size="icon"
        className="bg-white dark:bg-gray-800 shadow-md"
        onClick={() => togglePanel("settings")}
        data-button="settings"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-white dark:bg-gray-800 shadow-md"
        onClick={() => togglePanel("share")}
        data-button="share"
        aria-label="Share"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-white dark:bg-gray-800 shadow-md"
        onClick={() => togglePanel("support")}
        data-button="support"
        aria-label="Support"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {activePanel === "settings" && (
        <div
          className="absolute right-12 top-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
          data-panel="settings"
        >
          <h3 className="font-medium mb-2">Settings</h3>
          {/* Settings content */}
        </div>
      )}

      {activePanel === "share" && (
        <div
          className="absolute right-12 top-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
          data-panel="share"
        >
          <h3 className="font-medium mb-2">Share</h3>
          {/* Share content */}
        </div>
      )}

      {activePanel === "support" && (
        <div
          className="absolute right-12 top-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
          data-panel="support"
        >
          <h3 className="font-medium mb-2">Support</h3>
          {/* Support content */}
        </div>
      )}
    </div>
  )
}
