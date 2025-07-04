"use client"

import { useState } from "react"
import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Settings, ChevronRight, Share2, ChevronLeft } from "lucide-react" // Import ChevronLeft for share button
import { cn } from "@/lib/utils"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"

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

      {/* Settings Panel and Button */}
      <AnimatePresence>
        {isSettingsExpanded ? (
          <CollapsibleSettingsPanel onClose={() => setIsSettingsExpanded(false)} />
        ) : (
          <motion.button
            key="settings-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsSettingsExpanded(true)}
            className={cn(
              "fixed top-12 left-12 z-50 flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-r border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Share Panel and Button */}
      <AnimatePresence>
        {sharePanelInfo.expanded ? (
          <CollapsibleSharePanel
            onPanelStateChange={setSharePanelInfo}
            onClose={() => setSharePanelInfo({ expanded: false, height: 0 })}
          />
        ) : (
          <motion.button
            key="share-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setSharePanelInfo({ expanded: true, height: 0 })}
            className={cn(
              "fixed top-12 right-12 z-50 flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open share panel"
          >
            <Share2 className="h-5 w-5" />
            <ChevronLeft className="h-4 w-4" /> {/* ChevronLeft for share panel as it expands left */}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Panel and Button */}
      <AnimatePresence>
        {isSupportExpanded ? (
          <CollapsibleChatbotPanel sharePanelInfo={sharePanelInfo} onClose={() => setIsSupportExpanded(false)} />
        ) : (
          <motion.button
            key="support-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsSupportExpanded(true)}
            className={cn(
              "fixed top-24 right-12 z-50 flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open Customer Support"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">Support</span>
          </motion.button>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  )
}
