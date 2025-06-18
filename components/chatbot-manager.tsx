"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import UnifiedChatbot from "./unified-chatbot"
import FloatingChatbotButton from "./floating-chatbot-button"
import { ChatbotProvider } from "@/lib/chatbot-context"

export default function ChatbotManager() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show chatbot after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  return (
    <ChatbotProvider>
      <FloatingChatbotButton />
      <UnifiedChatbot />
    </ChatbotProvider>
  )
}
