"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Bot, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"

export default function HomePage() {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)
  const [isSupportExpanded, setIsSupportExpanded] = useState(false)
  const [isShareExpanded, setIsShareExpanded] = useState(false)
  const [sharePanelHeight, setSharePanelHeight] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Function to handle state change from CollapsibleSharePanel
  const handleSharePanelStateChange = (info: { expanded: boolean; height: number }) => {
    setIsShareExpanded(info.expanded)
    setSharePanelHeight(info.height)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8">Welcome to our platform</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-md">
        Explore our services and find the perfect solution for your needs.
      </p>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-[1000]">
        <AnimatePresence>
          {/* Share Button */}
          {!isShareExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "rounded-l-lg rounded-r-lg border-l border-r", // Always apply these for consistent look
                  "shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors duration-200",
                  "flex items-center gap-2",
                )}
                onClick={() => {
                  setIsShareExpanded(true)
                  setIsSettingsExpanded(false) // Close settings if open
                  setIsSupportExpanded(false) // Close support if open
                }}
                aria-label="Open Share Panel"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">Share</span>
              </Button>
            </motion.div>
          )}

          {/* Support Button */}
          {!isSupportExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "rounded-l-lg rounded-r-lg border-l border-r", // Always apply these for consistent look
                  "shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors duration-200",
                  "flex items-center gap-2",
                )}
                onClick={() => {
                  setIsSupportExpanded(true)
                  setIsSettingsExpanded(false) // Close settings if open
                  setIsShareExpanded(false) // Close share if open
                }}
                aria-label="Open Customer Support"
              >
                <Bot className="h-5 w-5" />
                <span className="text-sm font-medium">Support</span>
              </Button>
            </motion.div>
          )}

          {/* Settings Button */}
          {!isSettingsExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "rounded-l-lg rounded-r-lg border-l border-r", // Always apply these for consistent look
                  "shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors duration-200",
                  "flex items-center gap-2",
                )}
                onClick={() => {
                  setIsSettingsExpanded(true)
                  setIsSupportExpanded(false) // Close support if open
                  setIsShareExpanded(false) // Close share if open
                }}
                aria-label="Open Settings Panel"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsible Panels */}
      <AnimatePresence>
        {isSettingsExpanded && (
          <CollapsibleSettingsPanel key="settings-panel" onClose={() => setIsSettingsExpanded(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSupportExpanded && (
          <CollapsibleChatbotPanel
            key="chatbot-panel"
            sharePanelInfo={{ expanded: isShareExpanded, height: sharePanelHeight }}
            onClose={() => setIsSupportExpanded(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareExpanded && (
          <CollapsibleSharePanel
            key="share-panel"
            onPanelStateChange={handleSharePanelStateChange}
            onClose={() => setIsShareExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
