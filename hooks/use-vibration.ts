"use client"

import { useCallback } from "react"

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern)
      return true
    }
    return false
  }, [])

  const vibratePattern = useCallback(
    (pattern: number[]) => {
      return vibrate(pattern)
    },
    [vibrate],
  )

  const stopVibration = useCallback(() => {
    return vibrate(0)
  }, [vibrate])

  const isSupported = "vibrate" in navigator

  return {
    vibrate,
    vibratePattern,
    stopVibration,
    isSupported,
  }
}
