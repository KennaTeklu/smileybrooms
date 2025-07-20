"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { HelpPrompt } from "@/components/abandonment/help-prompt" // Import the new HelpPrompt component

type AbandonmentContextType = {}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

const INACTIVITY_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const [showHelpPrompt, setShowHelpPrompt] = useState(false)

  const updateLastActivity = useCallback(() => {
    localStorage.setItem("lastActivityTimestamp", Date.now().toString())
  }, [])

  useEffect(() => {
    // Set initial activity timestamp if not present
    if (!localStorage.getItem("lastActivityTimestamp")) {
      updateLastActivity()
    }

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem("lastActivityTimestamp")
      if (lastActivity) {
        const lastActivityTime = Number.parseInt(lastActivity, 10)
        if (Date.now() - lastActivityTime > INACTIVITY_THRESHOLD_MS) {
          setShowHelpPrompt(true)
        }
      }
    }

    // Check inactivity on mount
    checkInactivity()

    // Add event listeners for activity
    window.addEventListener("mousemove", updateLastActivity)
    window.addEventListener("keydown", updateLastActivity)
    window.addEventListener("scroll", updateLastActivity)
    window.addEventListener("click", updateLastActivity)

    // Set up an interval to periodically check for inactivity (e.g., daily)
    const interval = setInterval(checkInactivity, 24 * 60 * 60 * 1000) // Check daily

    return () => {
      window.removeEventListener("mousemove", updateLastActivity)
      window.removeEventListener("keydown", updateLastActivity)
      window.removeEventListener("scroll", updateLastActivity)
      window.removeEventListener("click", updateLastActivity)
      clearInterval(interval)
    }
  }, [updateLastActivity])

  const handleDismissHelpPrompt = useCallback(() => {
    setShowHelpPrompt(false)
    // Optionally reset activity timestamp to prevent immediate re-trigger
    updateLastActivity()
  }, [updateLastActivity])

  return (
    <AbandonmentContext.Provider value={{}}>
      {children}
      {showHelpPrompt && <HelpPrompt onDismiss={handleDismissHelpPrompt} />}
    </AbandonmentContext.Provider>
  )
}

export function useAbandonment() {
  const context = useContext(AbandonmentContext)
  if (context === undefined) {
    throw new Error("useAbandonment must be used within an AbandonmentProvider")
  }
  return context
}
