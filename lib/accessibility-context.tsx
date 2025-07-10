"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

export interface AccessibilityPreferences {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreference: (key: keyof AccessibilityPreferences, value: boolean) => void
  resetPreferences: () => void
}

export const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
}

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)

  useEffect(() => {
    // Load preferences from localStorage on mount
    const saved = localStorage.getItem("accessibility-preferences")
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse accessibility preferences:", error)
      }
    }
  }, [])

  const updatePreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    localStorage.setItem("accessibility-preferences", JSON.stringify(newPreferences))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem("accessibility-preferences")
  }

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  )
}
