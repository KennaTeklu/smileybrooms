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
  prefersDarkTheme: boolean // Added for explicit theme preference
  prefersLightTheme: boolean // Added for explicit theme preference
  // Add other preferences as needed
}

type AccessibilityContextType = {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
  applySettings: (prefs: AccessibilityPreferences) => void
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: false,
  textAlignment: "left",
  fontFamily: "Inter, sans-serif",
  language: "en",
  prefersDarkTheme: false, // Default to light theme preference
  prefersLightTheme: true, // Default to light theme preference
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Helper to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : defaultValue
  } catch (error) {
    console.error(`Error loading preference ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    const saved = getInitialState("accessibilityPreferences", DEFAULT_PREFERENCES)
    // Merge saved preferences with default to ensure new keys are included
    return { ...DEFAULT_PREFERENCES, ...saved }
  })

  // Apply settings to document body
  const applySettings = useCallback((prefs: AccessibilityPreferences) => {
    const body = document.body
    if (!body) return

    body.classList.toggle("high-contrast", prefs.highContrast)
    body.classList.toggle("large-text", prefs.largeText)
    body.classList.toggle("reduced-motion", prefs.reducedMotion)
    body.classList.toggle("screen-reader-mode", prefs.screenReaderMode)
    body.classList.toggle("keyboard-navigation-enabled", prefs.keyboardNavigation)
    body.classList.toggle("prefers-dark-theme", prefs.prefersDarkTheme) // Apply dark theme class
    body.classList.toggle("prefers-light-theme", prefs.prefersLightTheme) // Apply light theme class

    body.style.textAlign = prefs.textAlignment
    body.style.fontFamily = prefs.fontFamily
    document.documentElement.lang = prefs.language
  }, [])

  // Save preferences to localStorage and apply them whenever they change
  useEffect(() => {
    applySettings(preferences)
    try {
      localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save accessibility preferences to localStorage:", error)
    }
  }, [preferences, applySettings])

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

  const value = {
    preferences,
    updatePreference,
    resetPreferences,
    applySettings, // Expose applySettings for direct use if needed
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

// Internal hook to get the raw context value (can be undefined)
export const _useAccessibilityContextInternal = () => {
  return useContext(AccessibilityContext)
}
