"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  className?: string
}

export default function LoadingAnimation({ className }: LoadingAnimationProps) {
  const [currentEmoji, setCurrentEmoji] = useState("😊")
  const [isAnimating, setIsAnimating] = useState(false)
  const [explosiveEffect, setExplosiveEffect] = useState(false)

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setIsAnimating(true)
      setExplosiveEffect(true)

      setTimeout(() => {
        setCurrentEmoji((prev) => (prev === "😊" ? "🧹" : "😊"))
        setExplosiveEffect(false)
      }, 150)

      setTimeout(() => setIsAnimating(false), 500)
    }, 1000)

    return () => clearInterval(emojiInterval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        <div
          className={cn(
            "text-8xl transition-all duration-300",
            isAnimating && "animate-bounce",
            explosiveEffect && "animate-ping",
            className,
          )}
        >
          {currentEmoji}
        </div>
        {explosiveEffect && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="animate-ping-fast text-8xl opacity-75">{currentEmoji === "😊" ? "🧹" : "😊"}</div>
          </div>
        )}
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-700 dark:text-gray-200">Loading...</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Preparing your sparkling clean experience</p>
    </div>
  )
}

export { LoadingAnimation }
