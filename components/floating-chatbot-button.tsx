"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Bot, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatbot } from "@/lib/chatbot-context"
import { useEnhancedDeviceDetection } from "@/hooks/use-enhanced-device-detection"
import { cn } from "@/lib/utils"

export default function FloatingChatbotButton() {
  const { isOpen, toggleChat, openAiChat, openJotformChat } = useChatbot()
  const { isMobile } = useEnhancedDeviceDetection()
  const [showOptions, setShowOptions] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleMainButtonClick = () => {
    if (isOpen) {
      toggleChat()
      setShowOptions(false)
    } else {
      setShowOptions(!showOptions)
    }
  }

  const handleOptionClick = (mode: "ai" | "support") => {
    setShowOptions(false)
    if (mode === "ai") {
      openAiChat()
    } else {
      openJotformChat()
    }
  }

  // Position the button in the bottom-left corner
  const buttonPosition = {
    bottom: isMobile ? "20px" : "24px",
    left: isMobile ? "16px" : "24px",
  }

  return (
    <div className="fixed z-40" style={buttonPosition}>
      {/* Options Menu */}
      {showOptions && !isOpen && (
        <div className="absolute bottom-16 left-0 mb-2 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
          <Button
            onClick={() => handleOptionClick("ai")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-4 py-2 whitespace-nowrap"
            size="sm"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
          <Button
            onClick={() => handleOptionClick("support")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-full px-4 py-2 whitespace-nowrap"
            size="sm"
          >
            <HelpCircle className="h-4 w-4" />
            Live Support
          </Button>
        </div>
      )}

      {/* Main Floating Button */}
      <Button
        onClick={handleMainButtonClick}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105",
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : showOptions
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700",
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </Button>

      {/* Pulse animation when closed */}
      {!isOpen && !showOptions && <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />}
    </div>
  )
}
