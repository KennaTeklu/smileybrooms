"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type AccessibilityPreferences = {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  textAlignment: "left" | "center" | "right" | "justify"
  fontFamily: string
  language: string
  // Add other preferences as needed
}

type AccessibilityContextType = {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
  applySettings: (prefs: AccessibilityPreferences) => void
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: false,
  textAlignment: "left",
  fontFamily: "Inter, sans-serif",
  language: "en",
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem("accessibilityPreferences")
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences) as AccessibilityPreferences
        setPreferences((prev) => ({ ...prev, ...parsed })) // Merge to ensure new defaults are included
      }
    } catch (error) {
      console.error("Failed to load accessibility preferences from localStorage:", error)
    }
  }, [])

  // Apply settings to document body and save to localStorage whenever preferences change
  useEffect(() => {
    applySettings(preferences)
    try {
      localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save accessibility preferences to localStorage:", error)
    }
  }, [preferences])

  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [],
  )

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
    try {
      localStorage.removeItem("accessibilityPreferences")
    } catch (error) {
      console.error("Failed to clear accessibility preferences from localStorage:", error)
    }
  }, [])

  const applySettings = useCallback((prefs: AccessibilityPreferences) => {
    const body = document.body
    if (!body) return

    // High Contrast
    body.classList.toggle("high-contrast", prefs.highContrast)

    // Large Text
    body.classList.toggle("large-text", prefs.largeText)

    // Reduced Motion
    body.classList.toggle("reduced-motion", prefs.reducedMotion)

    // Screen Reader Mode
    body.classList.toggle("screen-reader-mode", prefs.screenReaderMode)

    // Keyboard Navigation
    body.classList.toggle("keyboard-navigation-enabled", prefs.keyboardNavigation)

    // Text Alignment
    body.style.textAlign = prefs.textAlignment

    // Font Family
    body.style.fontFamily = prefs.fontFamily

    // Language
    document.documentElement.lang = prefs.language
  }, [])

  const value = {
    preferences,
    updatePreference,
    resetPreferences,
    applySettings,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    // Provide a stub for SSR or when used outside the provider
    return {
      preferences: DEFAULT_PREFERENCES,
      updatePreference: () => {
        /* no-op */
      },
      resetPreferences: () => {
        /* no-op */
      },
      applySettings: () => {
        /* no-op */
      },
    }
  }
  return context
}
