"use client"

import React from "react"

import type { ReactNode } from "react"
import { createContext, useState, useEffect, useCallback } from "react"
import { useAccessibility as useAccessibilityHook } from "@/hooks/use-accessibility" // Renamed to avoid conflict

interface AccessibilityPreferences {
  fontSize: "small" | "medium" | "large"
  highContrast: boolean
  animationsEnabled: boolean
  keyboardNavigation: boolean
  prefersDarkTheme: boolean // Added for theme toggle
  prefersLightTheme: boolean // Added for theme toggle
  fontFamily: string // Added for font family selection
  language: string // Added for language selection
  lineHeight: number // Added for line height
  letterSpacing: number // Added for letter spacing
  textAlignment: "left" | "center" | "right" // Added for text alignment
  colorScheme: "default" | "green" | "blue" // New: Added for custom color schemes
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreference: (key: keyof AccessibilityPreferences, value: any) => void
  resetPreferences: () => void
  announceToScreenReader: (message: string, polite?: boolean) => void
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: "medium",
  highContrast: false,
  animationsEnabled: true,
  keyboardNavigation: false,
  prefersDarkTheme: false, // Default to light
  prefersLightTheme: true,
  fontFamily: "Inter, sans-serif",
  language: "en",
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlignment: "left",
  colorScheme: "default", // Default color scheme
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)
  const liveRegionRef = React.createRef<HTMLDivElement>()

  // Load preferences from local storage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem("accessibilityPreferences")
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences))
      }
    } catch (error) {
      console.error("Failed to load accessibility preferences from local storage:", error)
    }
  }, [])

  // Save preferences to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save accessibility preferences to local storage:", error)
    }
  }, [preferences])

  const updatePreference = (key: keyof AccessibilityPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
  }

  const announceToScreenReader = useCallback((message: string, polite = false) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute("aria-live", polite ? "polite" : "assertive")
      liveRegionRef.current.textContent = message
      // Clear after a short delay to allow new announcements
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = ""
        }
      }, 1000)
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences, announceToScreenReader }}>
      {children}
      {/* Live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-atomic="true"
        aria-live="polite" // Default to polite
      />
    </AccessibilityContext.Provider>
  )
}

// Re-export the hook for convenience
export const useAccessibility = useAccessibilityHook
