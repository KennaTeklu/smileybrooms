"use client"

import { useState } from "react"
import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false) // State to control button expansion

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
      </div>
      {/* Fixed button for customer support */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          key="collapsed"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={() => setIsExpanded(true)} // This would typically open a chat or support modal
          className="flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900 rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-l border-t border-b border-gray-200 dark:border-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open Customer Support"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </motion.button>
      </div>
    </ErrorBoundary>
  )
}
