"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"
import { useAccessibility as useAccessibilityHook } from "@/hooks/use-accessibility" // Renamed to avoid conflict

interface AccessibilityPreferences {
  fontSize: "small" | "medium" | "large"
  highContrast: boolean
  animationsEnabled: boolean
  keyboardNavigation: boolean
  // Add more preferences as needed
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreference: (key: keyof AccessibilityPreferences, value: any) => void
  resetPreferences: () => void
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: "medium",
  highContrast: false,
  animationsEnabled: true,
  keyboardNavigation: false,
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)

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

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// Re-export the hook for convenience
export const useAccessibility = useAccessibilityHook
