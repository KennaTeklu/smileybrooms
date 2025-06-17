"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import AiChatbot from "./ai-chatbot" // Import the new AI chatbot component

export default function ChatbotManager() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Simple visibility logic
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  // Render the AI Chatbot
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AiChatbot />
    </div>
  )
}
