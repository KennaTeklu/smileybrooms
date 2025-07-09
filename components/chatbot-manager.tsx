"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import SuperChatbot from "./super-chatbot"

export default function ChatbotManager() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Enhanced visibility logic with page-specific timing
    const getDelay = () => {
      switch (pathname) {
        case "/checkout":
          return 5000 // Longer delay on checkout to avoid interruption
        case "/":
          return 3000 // Medium delay on homepage
        default:
          return 2000 // Quick appearance on other pages
      }
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, getDelay())

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  // No wrapper div needed - SuperChatbot handles its own positioning
  return <SuperChatbot />
}
