"use client"

import { useEffect } from "react"
import { useAccessibility } from "./accessibility-provider"

export default function KeyboardShortcuts() {
  const { settings, updateSetting, isReading, startReading, stopReading } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if Alt key is pressed
      if (e.altKey) {
        switch (e.key) {
          case "r":
            e.preventDefault()
            if (isReading) {
              stopReading()
            } else {
              startReading()
            }
            break
          case "+":
            e.preventDefault()
            updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 2))
            break
          case "-":
            e.preventDefault()
            updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.5))
            break
          case "c":
            e.preventDefault()
            updateSetting("highContrast", !settings.highContrast)
            break
          case "d":
            e.preventDefault()
            updateSetting("darkMode", !settings.darkMode)
            break
          case "g":
            e.preventDefault()
            updateSetting("readingGuide", !settings.readingGuide)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    isReading,
    settings.fontSize,
    settings.highContrast,
    settings.darkMode,
    settings.readingGuide,
    startReading,
    stopReading,
    updateSetting,
  ])

  return null
}
