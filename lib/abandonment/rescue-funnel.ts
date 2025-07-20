"use client"

import { useEffect, useRef } from "react"

interface RescueFunnelOptions {
  thresholdSeconds?: number // Time in seconds before considering abandonment
  onAbandonmentDetected: () => void // Callback when abandonment is detected
  enabled?: boolean // Whether the rescue funnel is enabled
}

export function rescueFunnel({ thresholdSeconds = 30, onAbandonmentDetected, enabled = true }: RescueFunnelOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    lastActivityTimeRef.current = Date.now()
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        onAbandonmentDetected()
      }, thresholdSeconds * 1000)
    }
  }

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const handleActivity = () => {
      resetTimer()
    }

    // Listen for common user activities
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("scroll", handleActivity)
    window.addEventListener("click", handleActivity)

    resetTimer() // Initialize the timer

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
    }
  }, [thresholdSeconds, onAbandonmentDetected, enabled])

  // This function can be called externally to manually trigger a reset or check
  return { resetTimer }
}
