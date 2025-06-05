"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTheme } from "next-themes"

type AccessibilityPreferences = {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  voiceControl: boolean
  keyboardOnly: boolean
  prefersDarkTheme: boolean // Added theme preference
  prefersLightTheme: boolean // Added theme preference
}

type AccessibilityContextType = {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
  announceToScreenReader: (message: string, assertive?: boolean) => void
}

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  voiceControl: false,
  keyboardOnly: false,
  prefersDarkTheme: false,
  prefersLightTheme: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)
  const [announcement, setAnnouncement] = useState("")
  const [isAssertive, setIsAssertive] = useState(false)
  const { setTheme } = useTheme()

  // Load preferences from localStorage on initial render
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem("accessibility-preferences")
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      } else {
        // Check for system preferences
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          updatePreference("reducedMotion", true)
        }
        if (window.matchMedia("(prefers-contrast: more)").matches) {
          updatePreference("highContrast", true)
        }
        // Check for color scheme preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          updatePreference("prefersDarkTheme", true)
        } else {
          updatePreference("prefersLightTheme", true)
        }
      }
    } catch (error) {
      console.error("Error loading accessibility preferences:", error)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("accessibility-preferences", JSON.stringify(preferences))

      // Apply preferences to document
      document.documentElement.classList.toggle("high-contrast", preferences.highContrast)
      document.documentElement.classList.toggle("large-text", preferences.largeText)
      document.documentElement.classList.toggle("reduced-motion", preferences.reducedMotion)
      document.documentElement.classList.toggle("screen-reader", preferences.screenReader)
      document.documentElement.classList.toggle("voice-control", preferences.voiceControl)
      document.documentElement.classList.toggle("keyboard-only", preferences.keyboardOnly)

      // Apply theme preferences
      if (preferences.prefersDarkTheme) {
        setTheme("dark")
      } else if (preferences.prefersLightTheme) {
        setTheme("light")
      }
    } catch (error) {
      console.error("Error saving accessibility preferences:", error)
    }
  }, [preferences, setTheme])

  // Clear announcement after it's been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement("")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [announcement])

  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [key]: value }

      // Handle theme preference changes
      if (key === "prefersDarkTheme" && value === true) {
        newPreferences.prefersLightTheme = false
      } else if (key === "prefersLightTheme" && value === true) {
        newPreferences.prefersDarkTheme = false
      }

      return newPreferences
    })
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
  }

  const announceToScreenReader = (message: string, assertive = false) => {
    setAnnouncement(message)
    setIsAssertive(assertive)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        announceToScreenReader,
      }}
    >
      {children}
      {/* Visually hidden announcement for screen readers */}
      <div aria-live={isAssertive ? "assertive" : "polite"} className="sr-only" role="status" aria-atomic="true">
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
