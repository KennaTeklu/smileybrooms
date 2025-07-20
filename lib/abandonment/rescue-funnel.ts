"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDeviceNotifications } from "@/lib/notifications/device-notifications"

interface RescueFunnelOptions {
  inactivityTimeoutMs?: number // Default to 1 month
  enableChatIntervention?: boolean
}

interface RescueFunnelState {
  lastInteractionTime: number
  hasTriggeredHelp: boolean
}

export function rescueFunnel(options: RescueFunnelOptions = {}) {
  const {
    inactivityTimeoutMs = 2592000000, // 1 month in milliseconds
    enableChatIntervention = true,
  } = options

  const [state, setState] = useState<RescueFunnelState>({
    lastInteractionTime: Date.now(),
    hasTriggeredHelp: false,
  })

  const [showHelpPrompt, setShowHelpPrompt] = useState(false)

  const router = useRouter()
  const { sendNotification, isSupported } = useDeviceNotifications()

  // Track user activity
  useEffect(() => {
    const updateLastInteraction = () => {
      setState((prev) => ({
        ...prev,
        lastInteractionTime: Date.now(),
      }))
    }

    // Set up event listeners
    window.addEventListener("mousemove", updateLastInteraction)
    window.addEventListener("click", updateLastInteraction)
    window.addEventListener("keydown", updateLastInteraction)
    window.addEventListener("scroll", updateLastInteraction)

    // Check for inactivity
    const inactivityInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastInteraction = now - state.lastInteractionTime

      // Trigger help if inactive for a month and help hasn't been triggered yet
      if (timeSinceLastInteraction > inactivityTimeoutMs && !state.hasTriggeredHelp) {
        checkCartAndTriggerHelp()
      }
    }, inactivityTimeoutMs / 2) // Check periodically, e.g., every half month

    return () => {
      window.removeEventListener("mousemove", updateLastInteraction)
      window.removeEventListener("click", updateLastInteraction)
      window.removeEventListener("keydown", updateLastInteraction)
      window.removeEventListener("scroll", updateLastInteraction)
      clearInterval(inactivityInterval)
    }
  }, [inactivityTimeoutMs, state.hasTriggeredHelp, state.lastInteractionTime])

  // Check for cart items and trigger help
  const checkCartAndTriggerHelp = () => {
    // Check if there are items in cart (simplified - replace with actual cart check)
    const hasItemsInCart =
      localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart") || '{"items":[]}').items.length > 0

    if (hasItemsInCart && enableChatIntervention) {
      setState((prev) => ({ ...prev, hasTriggeredHelp: true }))
      setShowHelpPrompt(true)

      // Optionally send a device notification if supported and user is not on the page
      if (document.visibilityState === "hidden" && isSupported) {
        sendNotification({
          title: "Need a hand with your booking?",
          body: "We noticed you haven't completed your cleaning service booking. Click to chat with us!",
          priority: "normal",
          actions: [
            {
              title: "Chat with Support",
              action: () => {
                router.push("/contact") // Or a specific chat page
              },
            },
          ],
        })
      }
    }
  }

  return {
    showHelpPrompt,
    setShowHelpPrompt,
  }
}
