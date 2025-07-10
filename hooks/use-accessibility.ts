"use client"

import { _useAccessibilityContextInternal } from "@/lib/accessibility-context"

// Public hook that provides a safe interface for accessing accessibility context
export function useAccessibility() {
  const context = _useAccessibilityContextInternal()

  // If we're on the server or context is not available, return a stub
  if (!context) {
    return {
      preferences: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReaderMode: false,
        keyboardNavigation: false,
        textAlignment: "left" as const,
        fontFamily: "Inter, sans-serif",
        language: "en",
        prefersDarkTheme: false,
        prefersLightTheme: true,
      },
      updatePreference: () => {},
      resetPreferences: () => {},
      applySettings: () => {},
    }
  }

  return context
}
