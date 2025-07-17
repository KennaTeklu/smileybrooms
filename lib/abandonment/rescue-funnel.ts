"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDeviceNotifications } from "@/lib/notifications/device-notifications"

interface RescueFunnelOptions {
  exitIntentEnabled?: boolean
  inactivityTimeoutMs?: number
  abandonedCartReminderMs?: number
  discountPercentage?: number // This default will no longer be used for offers
  maxDiscountPercentage?: number // This will no longer be used for offers
  discountSteps?: number[]
  enableSmsReminders?: boolean
  enableChatIntervention?: boolean
}

interface RescueFunnelState {
  discountOffered: number
  remindersSent: number
  lastInteractionTime: number
  hasExitIntent: boolean
  hasAbandonedCart: boolean
}

export function useAbandonmentRescue(options: RescueFunnelOptions = {}) {
  const {
    exitIntentEnabled = true,
    inactivityTimeoutMs = 60000, // 1 minute
    abandonedCartReminderMs = 300000, // 5 minutes
    discountPercentage = 10, // Default, but will not be used for offers if discountSteps is empty
    maxDiscountPercentage = 20, // Will not be used for offers if discountSteps is empty
    discountSteps = [10, 15, 20], // This will be overridden by the provider to []
    enableSmsReminders = false,
    enableChatIntervention = true,
  } = options

  const [state, setState] = useState<RescueFunnelState>({
    discountOffered: 0,
    remindersSent: 0,
    lastInteractionTime: Date.now(),
    hasExitIntent: false,
    hasAbandonedCart: false,
  })

  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showChatPrompt, setShowChatPrompt] = useState(false)

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

    const trackMouseLeave = (e: MouseEvent) => {
      // Exit intent detection - mouse moving toward top of page
      if (exitIntentEnabled && e.clientY <= 5 && !state.hasExitIntent) {
        setState((prev) => ({ ...prev, hasExitIntent: true }))
        handleExitIntent()
      }
    }

    // Set up event listeners
    window.addEventListener("mousemove", updateLastInteraction)
    window.addEventListener("click", updateLastInteraction)
    window.addEventListener("keydown", updateLastInteraction)
    window.addEventListener("scroll", updateLastInteraction)
    window.addEventListener("mouseleave", trackMouseLeave)

    // Check for inactivity
    const inactivityInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastInteraction = now - state.lastInteractionTime

      // Check for inactivity timeout
      if (timeSinceLastInteraction > inactivityTimeoutMs) {
        checkCartAndTriggerRescue()
      }
    }, inactivityTimeoutMs / 2)

    return () => {
      window.removeEventListener("mousemove", updateLastInteraction)
      window.removeEventListener("click", updateLastInteraction)
      window.removeEventListener("keydown", updateLastInteraction)
      window.removeEventListener("scroll", updateLastInteraction)
      window.removeEventListener("mouseleave", trackMouseLeave)
      clearInterval(inactivityInterval)
    }
  }, [exitIntentEnabled, inactivityTimeoutMs, state.hasExitIntent, state.lastInteractionTime])

  // Check for cart items
  const checkCartAndTriggerRescue = () => {
    // Check if there are items in cart (simplified - replace with actual cart check)
    const hasItemsInCart =
      localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart") || '{"items":[]}').items.length > 0

    if (hasItemsInCart && !state.hasAbandonedCart) {
      setState((prev) => ({ ...prev, hasAbandonedCart: true }))

      // Schedule abandoned cart reminder
      setTimeout(() => {
        if (document.visibilityState === "hidden") {
          sendAbandonmentNotification()
        } else {
          // If discountSteps is empty, this will fall through to chat intervention
          offerDiscount()
        }
      }, abandonedCartReminderMs)
    }
  }

  // Handle exit intent
  const handleExitIntent = () => {
    const hasItemsInCart =
      localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart") || '{"items":[]}').items.length > 0

    if (hasItemsInCart && state.remindersSent === 0) {
      // If discountSteps is empty, this will fall through to chat intervention
      offerDiscount()
    }
  }

  // Offer discount (or trigger chat if no discounts are configured)
  const offerDiscount = () => {
    if (discountSteps.length > 0 && state.remindersSent < discountSteps.length) {
      const currentDiscount = discountSteps[state.remindersSent]

      setState((prev) => ({
        ...prev,
        discountOffered: currentDiscount,
        remindersSent: prev.remindersSent + 1,
      }))

      setShowDiscountModal(true)

      // Store discount in localStorage
      localStorage.setItem("rescueDiscount", currentDiscount.toString())
    } else if (enableChatIntervention && !showChatPrompt) {
      setShowChatPrompt(true)
    }
  }

  // Send notification for abandoned cart
  const sendAbandonmentNotification = () => {
    if (isSupported) {
      sendNotification({
        title: "Your cleaning service is waiting!",
        body: `Complete your booking now!`, // Removed discount mention
        priority: "normal",
        actions: [
          {
            title: "Complete Booking",
            action: () => {
              router.push("/cart")
            },
          },
        ],
      })

      setState((prev) => ({
        ...prev,
        remindersSent: prev.remindersSent + 1,
      }))
    }
  }

  // Send SMS reminder (would connect to actual SMS service)
  const sendSmsReminder = (phoneNumber: string) => {
    if (enableSmsReminders) {
      console.log(`Would send SMS to ${phoneNumber} with offer`) // Removed discount mention
      // In real implementation, this would call an API to send SMS
    }
  }

  return {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount: state.discountOffered, // This will now be 0 if no discounts are offered
    sendSmsReminder,
    rescueState: state,
  }
}
