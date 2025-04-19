"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  className?: string
}

export default function LoadingAnimation({ className }: LoadingAnimationProps) {
  const [emoji, setEmoji] = useState("😊")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    // Alternate between smiley face and broom emoji every second
    const emojiInterval = setInterval(() => {
      setEmoji((prev) => (prev === "😊" ? "🧹" : "😊"))
      setShake(true)

      // Reset shake after animation completes
      setTimeout(() => setShake(false), 500)
    }, 1000)

    return () => clearInterval(emojiInterval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      <div className={cn("text-8xl transition-transform duration-500", shake ? "animate-shake" : "", className)}>
        {emoji}
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-700 dark:text-gray-200">Loading...</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Preparing your sparkling clean experience</p>
    </div>
  )
}
