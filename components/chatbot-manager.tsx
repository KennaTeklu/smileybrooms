"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import SafeJotFormChatbot from "./safe-jotform-chatbot"
import ChatbotController from "./chatbot-controller"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"

interface ChatbotManagerProps {
  enableOnAllPages?: boolean
  excludePaths?: string[]
  customGreeting?: string
}

export default function ChatbotManager({
  enableOnAllPages = true,
  excludePaths = [],
  customGreeting,
}: ChatbotManagerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const pathname = usePathname()

  // Check if chatbot should be enabled on current page
  const shouldShowChatbot = enableOnAllPages && !excludePaths.includes(pathname)

  useEffect(() => {
    // Track user interaction with the page
    const handleUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
      }
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("scroll", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("scroll", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [hasInteracted])

  if (!shouldShowChatbot) return null

  return (
    <>
      {/* Chatbot Controller - Prevents auto-opening */}
      <ChatbotController />

      {/* JotForm Chatbot Component */}
      {isVisible && <SafeJotFormChatbot skipWelcome={true} maximizable={true} position="right" autoOpen={false} />}

      {/* Custom Chatbot Controls */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {/* Minimize/Maximize Control */}
        {isVisible && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
            aria-label={isMinimized ? "Maximize chatbot" : "Minimize chatbot"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        )}

        {/* Toggle Visibility Control */}
        <Button
          variant={isVisible ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className={`${isVisible ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          aria-label={isVisible ? "Hide chatbot" : "Show chatbot"}
        >
          {isVisible ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </Button>
      </div>

      {/* Custom Greeting Overlay */}
      {customGreeting && hasInteracted && isVisible && (
        <div className="fixed bottom-20 right-4 z-40 max-w-sm">
          <div className="bg-white rounded-lg shadow-lg border p-4 animate-in slide-in-from-bottom-2">
            <p className="text-sm text-gray-700">{customGreeting}</p>
            <Button variant="ghost" size="sm" onClick={() => setHasInteracted(false)} className="mt-2 text-xs">
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
