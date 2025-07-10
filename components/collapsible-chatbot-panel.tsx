"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function CollapsibleChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const togglePanel = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500) // Simulate loading time for the iframe
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50, x: 50, transition: { duration: 0.2 } },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={togglePanel}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-40 flex h-[80vh] w-full max-w-[90vw] flex-col rounded-xl border border-purple-200 bg-background shadow-lg sm:max-w-md"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="chatbot-panel-title" className="text-xl font-semibold">
                Chat with us!
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close chatbot panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <div className="relative flex-1">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              )}
              <iframe
                src="https://form.jotform.com/241806000000000" // Replace with your actual JotForm chatbot URL
                className="h-full w-full rounded-b-xl"
                title="Chatbot"
                onLoad={() => setIsLoading(false)}
                style={{ border: "none" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
