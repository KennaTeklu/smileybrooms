"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Share2, Bot } from "lucide-react"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)
  const [isSupportExpanded, setIsSupportExpanded] = useState(false)
  const [sharePanelInfo, setSharePanelInfo] = useState({ expanded: false, height: 0 })

  const handleSettingsClose = () => {
    setIsSettingsExpanded(false)
  }

  const handleSupportClose = () => {
    setIsSupportExpanded(false)
  }

  const handleSharePanelStateChange = (info: { expanded: boolean; height: number }) => {
    setSharePanelInfo(info)
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Welcome to SmileyBrooms!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-md">
        Your trusted partner for a sparkling clean home. Explore our services and book your cleaning today.
      </p>

      {/* Settings Panel and Button */}
      <AnimatePresence>
        {isSettingsExpanded && <CollapsibleSettingsPanel onClose={handleSettingsClose} />}
      </AnimatePresence>
      {!isSettingsExpanded && (
        <motion.button
          key="settings-collapsed-button"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
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
          <span className="text-sm font-medium">Settings</span>
        </motion.button>
      )}

      {/* Share Panel and Button */}
      <AnimatePresence>
        {sharePanelInfo.expanded && (
          <CollapsibleSharePanel
            onPanelStateChange={handleSharePanelStateChange}
            onClose={() => setSharePanelInfo({ expanded: false, height: 0 })}
          />
        )}
      </AnimatePresence>
      {!sharePanelInfo.expanded && (
        <motion.button
          key="share-collapsed-button"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed top-12 right-12 z-[998] flex items-center justify-center h-12 w-12",
            "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800",
            "text-gray-600 dark:text-gray-400 hover:text-primary",
            "rounded-l-lg shadow-lg border border-gray-200 dark:border-gray-800",
            "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
          )}
          onClick={() => setSharePanelInfo({ expanded: true, height: 0 })}
          aria-label="Expand share panel"
        >
          <Share2 className="h-5 w-5" />
        </motion.button>
      )}

      {/* Chatbot Panel and Button */}
      <AnimatePresence>
        {isSupportExpanded && <CollapsibleChatbotPanel onClose={handleSupportClose} sharePanelInfo={sharePanelInfo} />}
      </AnimatePresence>
      {!isSupportExpanded && (
        <motion.button
          key="support-collapsed-button"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={() => setIsSupportExpanded(true)}
          className={cn(
            "fixed top-24 right-12 z-[999] flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
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
    </div>
  )
}
