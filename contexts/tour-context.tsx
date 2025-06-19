"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"

const TOUR_VERSION = "1.2"

interface TourState {
  hasCompleted: boolean
  showAgain: boolean
  lastStepCompleted: number
  version: string
  currentStep?: string
  isActive: boolean
}

interface TourContextType {
  tourState: TourState
  updateTourState: (updates: Partial<TourState>) => void
  startTour: () => void
  completeTour: () => void
  skipTour: () => void
  analytics: {
    trackEvent: (event: string, data?: any) => void
  }
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [tourState, setTourState] = useState<TourState>({
    hasCompleted: false,
    showAgain: true,
    lastStepCompleted: 0,
    version: TOUR_VERSION,
    isActive: false,
  })

  // Load from localStorage on mount
  useEffect(() => {
    const savedTour = localStorage.getItem("cleanpro_tour_settings")
    if (savedTour) {
      try {
        const parsedSettings = JSON.parse(savedTour)

        // Reset if version changed
        if (parsedSettings.version !== TOUR_VERSION) {
          console.log("Tour version updated, resetting preferences")
          trackEvent("tour_version_updated", {
            oldVersion: parsedSettings.version,
            newVersion: TOUR_VERSION,
          })
        } else {
          setTourState(parsedSettings)
        }
      } catch (e) {
        console.error("Failed to parse tour settings", e)
      }
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("cleanpro_tour_settings", JSON.stringify(tourState))
  }, [tourState])

  // Analytics tracking function
  const trackEvent = (event: string, data: any = {}) => {
    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", event, {
        event_category: "Tour",
        ...data,
      })
    }

    // Console log for development
    console.log(`Tour Event: ${event}`, data)
  }

  // Update state helper
  const updateTourState = (updates: Partial<TourState>) => {
    setTourState((prev) => {
      const newState = { ...prev, ...updates }

      // Track important state changes
      if ("hasCompleted" in updates && updates.hasCompleted) {
        trackEvent("tour_completed")
      }

      if ("showAgain" in updates && !updates.showAgain) {
        trackEvent("tour_opted_out")
      }

      return newState
    })
  }

  // Start tour function
  const startTour = () => {
    updateTourState({ isActive: true })
    trackEvent("tour_started")
  }

  // Complete tour function
  const completeTour = () => {
    updateTourState({
      hasCompleted: true,
      isActive: false,
      lastStepCompleted: 0,
    })
  }

  // Skip tour function
  const skipTour = () => {
    updateTourState({ isActive: false })
    trackEvent("tour_skipped")
  }

  const value: TourContextType = {
    tourState,
    updateTourState,
    startTour,
    completeTour,
    skipTour,
    analytics: { trackEvent },
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
