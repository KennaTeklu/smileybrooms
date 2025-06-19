"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useCallback } from "react"

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

export function useWebShare() {
  const shareData = useCallback(async (data: ShareData) => {
    if (typeof window === "undefined" || !navigator.share) {
      // Fallback to copying URL
      if (data.url && navigator.clipboard) {
        await navigator.clipboard.writeText(data.url)
        return true
      }
      return false
    }

    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.error("Error sharing:", error)
      return false
    }
  }, [])

  const canShare = useCallback((data?: ShareData) => {
    if (typeof window === "undefined" || !navigator.canShare) {
      return false
    }

    return data ? navigator.canShare(data) : true
  }, [])

  return {
    shareData,
    canShare,
    isSupported: typeof window !== "undefined" && !!navigator.share,
  }
}
