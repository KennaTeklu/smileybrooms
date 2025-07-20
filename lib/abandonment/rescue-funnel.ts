"use client"

import { useEffect, useRef, useCallback } from "react"

interface RescueFunnelOptions {
  thresholdSeconds?: number
  onAbandonment?: () => void
  onRescue?: () => void
  enabled?: boolean
}

export function rescueFunnel({
  thresholdSeconds = 30,
  onAbandonment,
  onRescue,
  enabled = true,
}: RescueFunnelOptions = {}) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityTimeRef = useRef(Date.now())

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    lastActivityTimeRef.current = Date.now()
    if (enabled) {
      timerRef.current = setTimeout(() => {
        if (onAbandonment) {
          onAbandonment()
        }
      }, thresholdSeconds * 1000)
    }
  }, [thresholdSeconds, onAbandonment, enabled])

  const handleActivity = useCallback(() => {
    const currentTime = Date.now()
    const idleTime = (currentTime - lastActivityTimeRef.current) / 1000

    if (idleTime >= thresholdSeconds && onRescue) {
      onRescue()
    }
    resetTimer()
  }, [thresholdSeconds, onRescue, resetTimer])

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      return
    }

    resetTimer()

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"]
    events.forEach((event) => window.addEventListener(event, handleActivity))

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach((event) => window.removeEventListener(event, handleActivity))
    }
  }, [handleActivity, resetTimer, enabled])

  // Expose a way to manually trigger a reset if needed from outside the hook
  return { resetFunnel: resetTimer }
}
