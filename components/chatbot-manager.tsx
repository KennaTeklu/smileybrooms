"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const SafeJotformChatbot = dynamic(() => import("./safe-jotform-chatbot"), {
  ssr: false,
})

export default function ChatbotManager() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Simple visibility logic without ServiceWorker
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  return <SafeJotformChatbot />
}
