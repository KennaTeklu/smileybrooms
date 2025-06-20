"use client"

import { useCallback } from "react"

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])

  const isSupported = typeof window !== "undefined" && !!navigator.vibrate

  return {
    vibrate,
    isSupported,
  }
}
