"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"

// Define the structure for accessibility preferences
export type AccessibilityPreferences = {
  prefersDarkTheme: boolean
  prefersLightTheme: boolean
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  keyboardNavigation: boolean
  fontFamily: string
  language: string
  colorScheme: "default" | "green" | "blue"
  lineHeight: number
  letterSpacing: number
  textAlignment: "left" | "center" | "right"
}

// Define default preferences
const defaultPreferences: AccessibilityPreferences = {
  prefersDarkTheme: false,
  prefersLightTheme: true,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  keyboardNavigation: false,
  fontFamily: "Inter, sans-serif",
  language: "en",
  colorScheme: "default",
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlignment: "left",
}

// Define the context type
type AccessibilityContextType = {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
  announceToScreenReader: (message: string, polite?: boolean) => void
}

// Create the context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Create the provider component
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)
  const { setTheme } = useTheme()
  const { toast } = useToast()

  // Load preferences from local storage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem("accessibilityPreferences")
      if (storedPreferences) {
        const parsedPreferences: AccessibilityPreferences = JSON.parse(storedPreferences)
        setPreferences((prev) => ({ ...prev, ...parsedPreferences }))
      }
    } catch (error) {
      console.error("Failed to load accessibility preferences from local storage:", error)
    }
  }, [])

  // Apply preferences to document.documentElement and body
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Apply theme
      setTheme(preferences.prefersDarkTheme ? "dark" : "light")

      // Apply high contrast
      if (preferences.highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }

      // Apply large text
      document.documentElement.style.setProperty("--accessibility-font-scale", preferences.largeText ? "1.2" : "1")
      if (preferences.largeText) {
        document.body.classList.add("large-text")
      } else {
        document.body.classList.remove("large-text")
      }

      // Apply reduced motion
      if (preferences.reducedMotion) {
        document.body.classList.add("motion-reduced")
      } else {
        document.body.classList.remove("motion-reduced")
      }

      // Apply keyboard navigation focus indicators
      if (preferences.keyboardNavigation) {
        document.body.classList.add("keyboard-navigation-active")
      } else {
        document.body.classList.remove("keyboard-navigation-active")
      }

      // Apply font family
      document.documentElement.style.setProperty("--accessibility-font-family", preferences.fontFamily)

      // Apply color scheme
      document.documentElement.classList.remove("theme-green", "theme-blue")
      if (preferences.colorScheme === "green") {
        document.documentElement.classList.add("theme-green")
      } else if (preferences.colorScheme === "blue") {
        document.documentElement.classList.add("theme-blue")
      }

      // Apply line height
      document.documentElement.style.setProperty("--accessibility-line-height", preferences.lineHeight.toString())

      // Apply letter spacing
      document.documentElement.style.setProperty("--accessibility-letter-spacing", `${preferences.letterSpacing}em`)

      // Apply text alignment
      document.documentElement.style.setProperty("--accessibility-text-align", preferences.textAlignment)
    }
  }, [preferences, setTheme])

  // Update a specific preference and save to local storage
  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
      setPreferences((prev) => {
        const newPreferences = { ...prev, [key]: value }
        try {
          localStorage.setItem("accessibilityPreferences", JSON.stringify(newPreferences))
        } catch (error) {
          console.error("Failed to save accessibility preferences to local storage:", error)
          toast({
            title: "Error saving settings",
            description: "Could not save your accessibility preferences. Please try again.",
            variant: "destructive",
          })
        }
        return newPreferences
      })
    },
    [toast],
  )

  // Reset all preferences to default
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
    try {
      localStorage.removeItem("accessibilityPreferences")
    } catch (error) {
      console.error("Failed to clear accessibility preferences from local storage:", error)
      toast({
        title: "Error resetting settings",
        description: "Could not reset your accessibility preferences. Please try again.",
        variant: "destructive",
      })
    }
    // Ensure theme is reset correctly
    setTheme(defaultPreferences.prefersDarkTheme ? "dark" : "light")
  }, [setTheme, toast])

  // Announce messages to screen readers
  const announceToScreenReader = useCallback((message: string, polite = false) => {
    const liveRegion = document.getElementById("accessibility-live-region")
    if (liveRegion) {
      liveRegion.setAttribute("aria-live", polite ? "polite" : "assertive")
      liveRegion.textContent = message
      // Clear after a short delay
      setTimeout(() => {
        liveRegion.textContent = ""
      }, 1000)
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences, announceToScreenReader }}>
      {children}
      {/* Live region for screen reader announcements */}
      <div id="accessibility-live-region" aria-live="polite" className="sr-only" role="status"></div>
    </AccessibilityContext.Provider>
  )
}

// Custom hook to use the accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
