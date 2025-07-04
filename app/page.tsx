"use client"

import { useState } from "react"
import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Settings, ChevronRight, Share2 } from "lucide-react" // Import Share2 icon
import { cn } from "@/lib/utils"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel" // Import the chatbot panel
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel" // Import the share panel

export default function Home() {
  const [isSupportExpanded, setIsSupportExpanded] = useState(false)
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)
  const [sharePanelInfo, setSharePanelInfo] = useState({ expanded: false, height: 0 })

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
      </div>
      {/* Fixed panels and buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center">
        {/* Share Panel (rendered conditionally) */}
        <AnimatePresence>
          {sharePanelInfo.expanded && (
            <CollapsibleSharePanel
              onPanelStateChange={setSharePanelInfo}
              onClose={() => setSharePanelInfo({ expanded: false, height: 0 })}
            />
          )}
        </AnimatePresence>

        {/* Chatbot Panel (rendered conditionally) */}
        <AnimatePresence>
          {isSupportExpanded && (
            <CollapsibleChatbotPanel sharePanelInfo={sharePanelInfo} onClose={() => setIsSupportExpanded(false)} />
          )}
        </AnimatePresence>

        {/* Settings Panel (rendered conditionally) */}
        <AnimatePresence>
          {isSettingsExpanded && <CollapsibleSettingsPanel onClose={() => setIsSettingsExpanded(false)} />}
        </AnimatePresence>

        {/* Buttons (rendered conditionally based on panel expansion) */}
        {!sharePanelInfo.expanded && ( // Only show share button if panel is not expanded
          <motion.button
            key="share-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setSharePanelInfo({ expanded: true, height: 0 })}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-t border-b border-gray-200 dark:border-gray-800",
              isSettingsExpanded || isSupportExpanded ? "" : "rounded-l-lg border-l", // Adjust rounding if other panels are open
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open share panel"
          >
            <Share2 className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}

        {!isSettingsExpanded && ( // Only show settings button if panel is not expanded
          <motion.button
            key="settings-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsSettingsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-t border-b border-gray-200 dark:border-gray-800",
              sharePanelInfo.expanded ? "" : "rounded-l-lg border-l", // Adjust rounding if share panel is open
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}

        {!isSupportExpanded && ( // Only show support button if panel is not expanded
          <motion.button
            key="support-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsSupportExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-t border-b border-gray-200 dark:border-gray-800",
              isSettingsExpanded || sharePanelInfo.expanded ? "" : "rounded-l-lg border-l", // Adjust rounding if other panels are open
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open Customer Support"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">Support</span>
          </motion.button>
        )}
      </div>
    </ErrorBoundary>
  )
}
