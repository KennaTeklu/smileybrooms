"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CollapsibleChatbotPanelProps {
  onClose: () => void
  sharePanelInfo: { expanded: boolean; height: number }
}

const CHATBOT_PANEL_WIDTH = 350
const CHATBOT_PANEL_HEIGHT = 500
const DEFAULT_CHATBOT_TOP_OFFSET = 96 // Corresponds to 'top-24' (96px) in app/page.tsx
const SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET = 500 // New offset when share panel is active

export function CollapsibleChatbotPanel({ onClose, sharePanelInfo }: CollapsibleChatbotPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Always expanded when rendered by parent
  const [currentTop, setCurrentTop] = useState(DEFAULT_CHATBOT_TOP_OFFSET)

  useEffect(() => {
    if (sharePanelInfo.expanded) {
      setCurrentTop(SHARE_PANEL_ACTIVE_CHATBOT_TOP_OFFSET)
    } else {
      setCurrentTop(DEFAULT_CHATBOT_TOP_OFFSET)
    }
  }, [sharePanelInfo.expanded])

  const topTransitionClass = sharePanelInfo.expanded ? "transition-none" : "transition-all duration-300 ease-in-out"

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: CHATBOT_PANEL_WIDTH }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: CHATBOT_PANEL_WIDTH }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed right-12 z-50",
            `w-[${CHATBOT_PANEL_WIDTH}px] h-[${CHATBOT_PANEL_HEIGHT}px]`,
            "bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800",
            topTransitionClass,
          )}
          style={{ top: currentTop }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Customer Support
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chatbot">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-auto">
              {/* Chatbot content goes here */}
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome! How can I assist you today?</p>
              {/* Placeholder for chat messages */}
              <div className="mt-4 space-y-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg self-start max-w-[80%]">
                  <p className="text-sm">Hello! I'm here to help with your cleaning service questions.</p>
                </div>
                <div className="bg-primary text-primary-foreground p-2 rounded-lg self-end max-w-[80%] ml-auto">
                  <p className="text-sm">Hi! I need help with my booking.</p>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t dark:border-gray-800">
              {/* Placeholder for chat input */}
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
