"use client"

import { useState, useEffect, useCallback } from "react"

interface RescueFunnelOptions {
  exitIntentEnabled?: boolean
  inactivityTimeoutMs?: number
  discountOffer?: {
    percentage: number
    code: string
  }
}

export function rescueFunnel(options?: RescueFunnelOptions) {
  const {
    exitIntentEnabled = true,
    inactivityTimeoutMs = 60000, // Default to 1 minute
    discountOffer = { percentage: 10, code: "SAVE10" },
  } = options || {}

  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showChatPrompt, setShowChatPrompt] = useState(false)
  const [currentDiscount, setCurrentDiscount] = useState(discountOffer)
  const [lastActivity, setLastActivity] = useState(Date.now())

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now())
  }, [])

  const handleExitIntent = useCallback(
    (event: MouseEvent) => {
      if (exitIntentEnabled && event.clientY < 10 && !showDiscountModal && !showChatPrompt) {
        setShowDiscountModal(true)
      }
    },
    [exitIntentEnabled, showDiscountModal, showChatPrompt],
  )

  useEffect(() => {
    if (exitIntentEnabled) {
      document.addEventListener("mouseleave", handleExitIntent)
    }
    return () => {
      if (exitIntentEnabled) {
        document.removeEventListener("mouseleave", handleExitIntent)
      }
    }
  }, [exitIntentEnabled, handleExitIntent])

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        if (!showDiscountModal && !showChatPrompt) {
          setShowChatPrompt(true)
        }
      }, inactivityTimeoutMs)
    }

    document.addEventListener("mousemove", handleActivity)
    document.addEventListener("keydown", handleActivity)
    document.addEventListener("click", handleActivity)

    resetTimer() // Initial setup

    return () => {
      clearTimeout(inactivityTimer)
      document.removeEventListener("mousemove", handleActivity)
      document.removeEventListener("keydown", handleActivity)
      document.removeEventListener("click", handleActivity)
    }
  }, [inactivityTimeoutMs, handleActivity, showDiscountModal, showChatPrompt])

  const sendSmsReminder = useCallback(
    async (phoneNumber: string) => {
      // Simulate sending SMS
      console.log(`Sending SMS reminder to ${phoneNumber} with discount code: ${currentDiscount.code}`)
      // In a real application, you would make an API call here
      return new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    },
    [currentDiscount],
  )

  return {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount,
    sendSmsReminder,
  }
}
