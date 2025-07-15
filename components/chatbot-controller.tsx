"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ChatbotManager from "./chatbot-manager" // Assuming ChatbotManager handles the actual chat UI
import ChatbotStatusIndicator from "./chatbot-status-indicator" // Assuming this component exists
import { useChatbotAnalytics } from "@/hooks/use-chatbot-analytics" // Assuming this hook exists
import { Loader2 } from "lucide-react" // Declare Loader2 variable

interface ChatbotControllerProps {
  initialOpen?: boolean
  apiEndpoint?: string
  welcomeMessage?: string
  enabled?: boolean
}

export default function ChatbotController({
  initialOpen = false,
  apiEndpoint = "/api/chatbot",
  welcomeMessage = "Hi there! How can I help you today?",
  enabled = true,
}: ChatbotControllerProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isChatbotReady, setIsChatbotReady] = useState(false) // Simulate chatbot readiness
  const { trackChatbotEvent } = useChatbotAnalytics() // Use analytics hook

  useEffect(() => {
    if (enabled) {
      // Simulate chatbot initialization
      const timer = setTimeout(() => {
        setIsChatbotReady(true)
        trackChatbotEvent("chatbot_initialized")
      }, 1000) // Simulate API call or model loading
      return () => clearTimeout(timer)
    }
  }, [enabled, trackChatbotEvent])

  const toggleChatbot = () => {
    setIsOpen((prev) => {
      const newState = !prev
      if (newState) {
        trackChatbotEvent("chatbot_opened")
      } else {
        trackChatbotEvent("chatbot_closed")
      }
      return newState
    })
  }

  if (!enabled) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-4 w-80 sm:w-96 h-[450px] rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Smiley Brooms AI
              </h3>
              <Button variant="ghost" size="icon" onClick={toggleChatbot} aria-label="Close chatbot">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow overflow-hidden">
              {isChatbotReady ? (
                <ChatbotManager apiEndpoint={apiEndpoint} welcomeMessage={welcomeMessage} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading AI...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleChatbot}
        className="relative h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        <ChatbotStatusIndicator isReady={isChatbotReady} />
      </Button>
    </div>
  )
}
