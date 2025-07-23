"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { HelpPrompt } from "./help-prompt"

interface AbandonmentContextType {
  triggerHelpPrompt: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export const useAbandonment = () => {
  const context = useContext(AbandonmentContext)
  if (!context) {
    throw new Error("useAbandonment must be used within an AbandonmentProvider")
  }
  return context
}

interface AbandonmentProviderProps {
  children: React.ReactNode
  inactivityThresholdDays?: number // Default to 30 days (1 month)
  onChatbotOpen: () => void // Callback to open the chatbot panel
}

export function AbandonmentProvider({
  children,
  inactivityThresholdDays = 30,
  onChatbotOpen,
}: AbandonmentProviderProps) {
  const [showHelpPrompt, setShowHelpPrompt] = useState(false)
  const lastActivityTimeRef = useRef<number>(Date.now())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetActivityTimer = useCallback(() => {
    lastActivityTimeRef.current = Date.now()
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    setShowHelpPrompt(false) // Hide prompt if user becomes active
  }, [])

  const checkInactivity = useCallback(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityTimeRef.current
    const thresholdMs = inactivityThresholdDays * 24 * 60 * 60 * 1000 // Convert days to milliseconds

    if (timeSinceLastActivity >= thresholdMs) {
      setShowHelpPrompt(true)
    } else {
      // Schedule next check
      const remainingTime = thresholdMs - timeSinceLastActivity
      inactivityTimerRef.current = setTimeout(checkInactivity, remainingTime)
    }
  }, [inactivityThresholdDays])

  useEffect(() => {
    // Set up initial timer
    inactivityTimerRef.current = setTimeout(checkInactivity, inactivityThresholdDays * 24 * 60 * 60 * 1000)

    const handleActivity = () => resetActivityTimer()

    // Listen for user activity
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("scroll", handleActivity)
    window.addEventListener("click", handleActivity)

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
    }
  }, [resetActivityTimer, checkInactivity, inactivityThresholdDays])

  const triggerHelpPrompt = useCallback(() => {
    setShowHelpPrompt(true)
  }, [])

  const contextValue = React.useMemo(() => ({ triggerHelpPrompt }), [triggerHelpPrompt])

  return (
    <AbandonmentContext.Provider value={contextValue}>
      {children}
      {showHelpPrompt && (
        <HelpPrompt
          onChatbotOpen={() => {
            onChatbotOpen()
            setShowHelpPrompt(false) // Hide prompt after opening chatbot
          }}
        />
      )}
    </AbandonmentContext.Provider>
  )
}
