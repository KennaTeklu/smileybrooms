"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import SafeJotformChatbot from "./safe-jotform-chatbot"

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

  return <SafeJotformChatbot />
}
