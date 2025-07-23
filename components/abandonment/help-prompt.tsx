"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HelpPromptProps {
  onChatbotOpen: () => void
}

export function HelpPrompt({ onChatbotOpen }: HelpPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="fixed bottom-20 right-4 z-30 p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-xl flex items-center gap-3 max-w-xs"
    >
      <Bot className="h-6 w-6 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">Need a hand?</p>
        <p className="text-xs opacity-90">Our chatbot is here to help you with any questions.</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onChatbotOpen}
        className={cn(
          "text-white hover:bg-white/20 rounded-full transition-all duration-200",
          "w-8 h-8 p-0 flex items-center justify-center",
        )}
        aria-label="Open chatbot for help"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
