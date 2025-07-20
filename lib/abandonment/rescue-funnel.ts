"use client"

import { useRef } from "react"

import { useState, useEffect, useCallback } from "react"

interface RescueFunnelOptions {
  exitIntentEnabled?: boolean
  inactivityTimeoutMs?: number
  discountPercentage?: number
}

interface DiscountOffer {
  percentage: number
  code: string
}

export function rescueFunnel(options?: RescueFunnelOptions) {
  const {
    exitIntentEnabled = true,
    inactivityTimeoutMs = 30000, // Default to 30 seconds
    discountPercentage = 10, // Default discount
  } = options || {}

  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showChatPrompt, setShowChatPrompt] = useState(false)
  const [currentDiscount, setCurrentDiscount] = useState<DiscountOffer | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (!showDiscountModal && !showChatPrompt) {
        setCurrentDiscount({ percentage: discountPercentage, code: `SAVE${discountPercentage}` })
        setShowDiscountModal(true)
      }
    }, inactivityTimeoutMs)
  }, [inactivityTimeoutMs, showDiscountModal, showChatPrompt, discountPercentage])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (exitIntentEnabled && event.clientY < 10 && !showDiscountModal && !showChatPrompt) {
        setCurrentDiscount({ percentage: discountPercentage, code: `SAVE${discountPercentage}` })
        setShowDiscountModal(true)
      }
      resetInactivityTimer()
    },
    [exitIntentEnabled, showDiscountModal, showChatPrompt, discountPercentage, resetInactivityTimer],
  )

  const handleKeyDown = useCallback(() => {
    resetInactivityTimer()
  }, [resetInactivityTimer])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("keydown", handleKeyDown)
    resetInactivityTimer() // Initialize timer on mount

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyDown)
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [handleMouseMove, handleKeyDown, resetInactivityTimer])

  const sendSmsReminder = (phoneNumber: string) => {
    console.log(`Sending SMS reminder to ${phoneNumber} with discount: ${currentDiscount?.code}`)
    // In a real application, you would integrate with an SMS API here.
    // For example: fetch('/api/send-sms', { method: 'POST', body: JSON.stringify({ phoneNumber, discount: currentDiscount }) });
  }

  return {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount,
    sendSmsReminder,
  }
}
