"use client"

import { useEffect, useState } from "react"
import { useDeviceDetection } from "@/hooks/use-device-detection"

type NotificationPriority = "low" | "normal" | "high"
type NotificationAction = {
  title: string
  action: () => void
}

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  priority?: NotificationPriority
  actions?: NotificationAction[]
  vibrate?: number[]
  silent?: boolean
  tag?: string
  requireInteraction?: boolean
}

export function useDeviceNotifications() {
  // Renamed from useDeviceNotifications for clarity
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const { isIOS, isAndroid, isMobile } = useDeviceDetection()

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied"
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return "denied"
    }
  }

  const sendNotification = async (title: string, options: Omit<NotificationOptions, "title">) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null
    }

    if (permission !== "granted") {
      const newPermission = await requestPermission()
      if (newPermission !== "granted") {
        return null
      }
    }

    // Device-specific optimizations
    const deviceOptions = { ...options }

    if (isIOS) {
      // iOS-specific options
      deviceOptions.silent = options.priority === "low" ? true : options.silent
      // iOS doesn't support vibration patterns via web notifications
      delete deviceOptions.vibrate
    } else if (isAndroid) {
      // Android-specific options
      deviceOptions.vibrate = options.priority === "high" ? [200, 100, 200] : options.vibrate
      deviceOptions.requireInteraction = options.priority === "high" ? true : options.requireInteraction
    }

    try {
      const notification = new Notification(title, {
        body: deviceOptions.body,
        icon: deviceOptions.icon,
        badge: deviceOptions.badge,
        image: deviceOptions.image,
        vibrate: deviceOptions.vibrate,
        silent: deviceOptions.silent,
        tag: deviceOptions.tag,
        requireInteraction: deviceOptions.requireInteraction,
      })

      // Handle notification actions
      if (deviceOptions.actions && deviceOptions.actions.length > 0) {
        notification.onclick = () => {
          deviceOptions.actions?.[0].action()
        }
      }

      return notification
    } catch (error) {
      console.error("Error creating notification:", error)
      return null
    }
  }

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  }
}
