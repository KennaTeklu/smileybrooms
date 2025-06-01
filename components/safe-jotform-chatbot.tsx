"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export default function SafeJotformChatbot() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simple load simulation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded || !isVisible) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 transition-all duration-300"
      style={{
        transform: "translateZ(0)", // Force hardware acceleration
      }}
    >
      <button
        onClick={() => setIsVisible(false)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )
}
