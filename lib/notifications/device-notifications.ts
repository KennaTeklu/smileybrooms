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

  const sendNotification = async (options: NotificationOptions) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null
    }

    if (permission !== "granted") {
      const newPermission = await requestPermission()
      if (newPermission !== "granted") {
        return null
      }
    }

    const deviceOptions = { ...options }

    if (isIOS) {
      deviceOptions.silent = options.priority === "low" ? true : options.silent
      delete deviceOptions.vibrate
    } else if (isAndroid) {
      deviceOptions.vibrate = options.priority === "high" ? [200, 100, 200] : options.vibrate
      deviceOptions.requireInteraction = options.priority === "high" ? true : options.requireInteraction
    }

    try {
      const notification = new Notification(deviceOptions.title, {
        body: deviceOptions.body,
        icon: deviceOptions.icon,
        badge: deviceOptions.badge,
        image: deviceOptions.image,
        vibrate: deviceOptions.vibrate,
        silent: deviceOptions.silent,
        tag: deviceOptions.tag,
        requireInteraction: deviceOptions.requireInteraction,
      })

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

// Example usage for the requested notification message:
// import { useDeviceNotifications } from "@/lib/notifications/device-notifications";
// const { sendNotification } = useDeviceNotifications();
//
// // Call this function when the user successfully completes checkout and has opted in
// sendNotification({
//   title: "Your Cleaning is Booked!",
//   body: "😊smileybrooms.com is waiting for you!",
//   icon: "/favicon.png",
//   tag: "checkout-success",
// });
