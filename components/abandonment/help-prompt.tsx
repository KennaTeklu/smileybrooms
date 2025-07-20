"use client"

import { motion } from "framer-motion"
import { ArrowDownRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelpPromptProps {
  onDismiss: () => void
}

export function HelpPrompt({ onDismiss }: HelpPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed bottom-20 right-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-xs text-sm"
    >
      <div className="flex-1">
        <p className="font-semibold">Need help?</p>
        <p>Click the chat icon below to talk to our support!</p>
      </div>
      <ArrowDownRight className="h-8 w-8 text-white flex-shrink-0" />
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="absolute top-1 right-1 text-white/80 hover:bg-white/20 hover:text-white"
        aria-label="Dismiss help prompt"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
