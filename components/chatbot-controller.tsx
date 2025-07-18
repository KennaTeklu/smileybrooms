"use client"

import { useEffect } from "react"
import { useFeatureFlag } from "@/lib/server/feature-key"

export function useChatbotController() {
  const isChatbotEnabled = useFeatureFlag("NEXT_PUBLIC_CHATBOT_ENABLED")

  useEffect(() => {
    if (isChatbotEnabled) {
      // Load external chatbot script if enabled
      const script = document.createElement("script")
      script.src = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "https://example.com/chatbot.js" // Replace with actual chatbot script URL
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isChatbotEnabled])

  // You might return functions to interact with the chatbot,
  // e.g., openChat, sendMessage, etc., if the external script exposes them.
  return {
    isChatbotEnabled,
    // For now, no direct interaction functions are exposed
  }
}
