"use client"

import { useState } from "react"
import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { motion, AnimatePresence } from "framer-motion" // Import AnimatePresence
import { Bot, Settings, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CollapsibleSettingsPanel } from "@/components/collapsible-settings-panel" // Import the settings panel

export default function Home() {
  const [isSupportExpanded, setIsSupportExpanded] = useState(false)
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
      </div>
      {/* Fixed buttons for customer support and settings */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center">
        {/* Settings Panel (rendered conditionally) */}
        <AnimatePresence>{isSettingsExpanded && <CollapsibleSettingsPanel />}</AnimatePresence>

        {/* Settings Button */}
        {!isSettingsExpanded && ( // Only show the button if the panel is not expanded
          <motion.button
            key="settings-collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsSettingsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}

        {/* Support Button */}
        <motion.button
          key="support-collapsed"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={() => setIsSupportExpanded(true)} // This would typically open a chat or support modal
          className={cn(
            "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
            "shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
            "border-t border-b border-gray-200 dark:border-gray-800",
            isSettingsExpanded ? "rounded-r-lg border-r" : "rounded-r-lg border-r", // Adjust border/rounding based on settings panel
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
          )}
          aria-label="Open Customer Support"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </motion.button>
      </div>
    </ErrorBoundary>
  )
}
