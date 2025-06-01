"use client"

import { useState, useEffect } from "react"
import { useAdaptiveScrollPositioning } from "@/hooks/use-adaptive-scroll-positioning"

export default function SafeJotformChatbot() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { elementRef, style } = useAdaptiveScrollPositioning({
    basePosition: { bottom: 20, right: 20 },
    elementType: "chatbot",
    priority: "high",
  })

  useEffect(() => {
    // Simple load check without ServiceWorker
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) return null

  return (
    <div ref={elementRef} style={style} className="fixed z-50 transition-all duration-300">
      <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2 22L7.72 20.99C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            fill="currentColor"
          />
          <path d="M8 12H16M8 8H16M8 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
