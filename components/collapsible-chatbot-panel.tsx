"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function CollapsibleChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => setIsOpen(!isOpen)

  // Close panel if ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
        onClick={togglePanel}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-4 right-4 z-50 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border bg-background shadow-lg sm:max-w-md",
              "border-purple-200 bg-purple-50/50 backdrop-blur-md dark:border-purple-800 dark:bg-purple-950/50",
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="chatbot-panel-title" className="text-xl font-bold text-purple-800 dark:text-purple-200">
                Chat with us!
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close chatbot panel">
                <X className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </Button>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />
            <div className="flex-1">
              {/* Placeholder for chatbot iframe/content */}
              <iframe
                src="https://www.chatbase.co/chatbot-iframe/YOUR_CHATBOT_ID" // Replace with your actual chatbot URL
                width="100%"
                height="100%"
                frameBorder="0"
                className="rounded-b-xl"
                title="Chatbot"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
