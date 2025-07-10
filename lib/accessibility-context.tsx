"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react"

// Define the structure for accessibility preferences
export interface AccessibilityPreferences {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  keyboardNavigation: boolean
  textAlignment: "left" | "center" | "right" | "justify"
  fontFamily: "sans" | "serif" | "mono"
  prefersDarkTheme: boolean
  prefersLightTheme: boolean
}

// Default preferences
export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  keyboardNavigation: false,
  textAlignment: "left",
  fontFamily: "sans",
  prefersDarkTheme: false,
  prefersLightTheme: false,
}

// Define the context value type
interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  setPreferences: Dispatch<SetStateAction<AccessibilityPreferences>>
  resetPreferences: () => void
  applySettings: (prefs: AccessibilityPreferences) => void
}

// Create the context
const InternalAccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Initialize from localStorage or default
    if (typeof window !== "undefined") {
      const savedPrefs = localStorage.getItem("accessibilityPreferences")
      return savedPrefs ? JSON.parse(savedPrefs) : DEFAULT_PREFERENCES
    }
    return DEFAULT_PREFERENCES
  })

  // Function to apply settings to the document body
  const applySettings = useCallback((prefs: AccessibilityPreferences) => {
    if (typeof document !== "undefined") {
      const body = document.body

      // High Contrast
      prefs.highContrast ? body.classList.add("high-contrast") : body.classList.remove("high-contrast")

      // Large Text
      prefs.largeText ? body.classList.add("large-text") : body.classList.remove("large-text")

      // Reduced Motion
      prefs.reducedMotion ? body.classList.add("reduced-motion") : body.classList.remove("reduced-motion")

      // Keyboard Navigation
      prefs.keyboardNavigation
        ? body.classList.add("keyboard-navigation-enabled")
        : body.classList.remove("keyboard-navigation-enabled")

      // Text Alignment
      body.style.textAlign = prefs.textAlignment

      // Font Family
      switch (prefs.fontFamily) {
        case "sans":
          body.style.fontFamily = "sans-serif"
          break
        case "serif":
          body.style.fontFamily = "serif"
          break
        case "mono":
          body.style.fontFamily = "monospace"
          break
        default:
          body.style.fontFamily = "sans-serif"
      }

      // Theme preferences
      if (prefs.prefersDarkTheme) {
        body.classList.add("prefers-dark-theme")
        body.classList.remove("prefers-light-theme")
      } else if (prefs.prefersLightTheme) {
        body.classList.add("prefers-light-theme")
        body.classList.remove("prefers-dark-theme")
      } else {
        body.classList.remove("prefers-dark-theme")
        body.classList.remove("prefers-light-theme")
      }
    }
  }, [])

  // Apply settings on initial load and when preferences change
  useEffect(() => {
    applySettings(preferences)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
    }
  }, [preferences, applySettings])

  // Reset preferences to default
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [])

  const value = {
    preferences,
    setPreferences,
    resetPreferences,
    applySettings,
  }

  return <InternalAccessibilityContext.Provider value={value}>{children}</InternalAccessibilityContext.Provider>
}

// Custom hook to use the accessibility context
export function useAccessibility() {
  const context = useContext(InternalAccessibilityContext)
  if (context === undefined) {
    // Provide a stub context during server-side rendering
    if (typeof window === "undefined") {
      return {
        preferences: DEFAULT_PREFERENCES,
        setPreferences: () => {},
        resetPreferences: () => {},
        applySettings: () => {},
      }
    }
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
