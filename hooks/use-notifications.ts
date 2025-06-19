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

import { useState, useCallback } from "react"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied"
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        return null
      }

      if (permission === "granted") {
        return new Notification(title, options)
      } else if (permission === "default") {
        const newPermission = await requestPermission()
        if (newPermission === "granted") {
          return new Notification(title, options)
        }
      }

      return null
    },
    [permission, requestPermission],
  )

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  }
}
