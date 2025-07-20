"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowDownRight } from "lucide-react"

interface HelpPromptProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpPrompt({ isOpen, onClose }: HelpPromptProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20, x: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="fixed bottom-20 right-4 z-30 bg-blue-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 cursor-pointer"
        onClick={onClose} // Close when clicked, implying user will then click chatbot
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-sm font-medium">Need help? Click the chat icon!</span>
        <ArrowDownRight className="h-5 w-5 animate-bounce-slow" />
      </motion.div>
    </AnimatePresence>
  )
}
