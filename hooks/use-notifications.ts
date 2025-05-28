"use client"

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
