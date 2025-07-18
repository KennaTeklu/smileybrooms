"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import type { AccessibilityPreferences, AccessibilityContextType } from "@/lib/types"

const defaultPreferences: AccessibilityPreferences = {
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

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    if (typeof window !== "undefined") {
      const savedPreferences = localStorage.getItem("accessibilityPreferences")
      return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences
    }
    return defaultPreferences
  })

  useEffect(() => {
    localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
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
    setPreferences(defaultPreferences)
  }, [])

  const contextValue = useMemo(
    () => ({
      preferences,
      updatePreference,
      resetPreferences,
    }),
    [preferences, updatePreference, resetPreferences],
  )

  return <AccessibilityContext.Provider value={contextValue}>{children}</AccessibilityContext.Provider>
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
