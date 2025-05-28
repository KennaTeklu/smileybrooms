"use client"

import { useState, useCallback, useEffect } from "react"

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [isSupported])

  const showNotification = useCallback(
    async (options: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        return null
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          badge: options.badge,
          tag: options.tag,
          requireInteraction: options.requireInteraction,
        })

        return notification
      } catch (error) {
        console.error("Error showing notification:", error)
        return null
      }
    },
    [isSupported, permission],
  )

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
  }
}
