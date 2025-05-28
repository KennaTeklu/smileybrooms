"use client"

import { useCallback } from "react"

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

export function useWebShare() {
  const isSupported = typeof navigator !== "undefined" && "share" in navigator

  const share = useCallback(
    async (data: ShareData) => {
      if (!isSupported) {
        // Fallback to copying URL to clipboard
        if (data.url && "clipboard" in navigator) {
          try {
            await navigator.clipboard.writeText(data.url)
            return { success: true, method: "clipboard" }
          } catch (error) {
            return { success: false, error: "Share not supported and clipboard failed" }
          }
        }
        return { success: false, error: "Web Share API not supported" }
      }

      try {
        await navigator.share(data)
        return { success: true, method: "native" }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return { success: false, error: "Share cancelled by user" }
        }
        return { success: false, error: "Share failed" }
      }
    },
    [isSupported],
  )

  const canShare = useCallback(
    (data: ShareData) => {
      if (!isSupported) return false

      if ("canShare" in navigator) {
        return (navigator as any).canShare(data)
      }

      return true
    },
    [isSupported],
  )

  return {
    isSupported,
    share,
    canShare,
  }
}
