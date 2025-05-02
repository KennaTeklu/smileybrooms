"use client"

import { useEffect } from "react"
import { useAccessibility } from "./accessibility-provider"

export default function KeyboardShortcuts() {
  const { settings, updateSetting, isReading, startReading, stopReading } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Alt key combinations
      if (!e.altKey) return

      switch (e.key) {
        case "r":
          // Toggle screen reader
          if (isReading) {
            stopReading()
          } else {
            startReading()
          }
          break
        case "+":
        case "=": // For keyboards where + requires shift
          // Increase font size
          if (settings.fontSize < 1.5) {
            updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 1.5))
          }
          break
        case "-":
          // Decrease font size
          if (settings.fontSize > 0.8) {
            updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.8))
          }
          break
        case "c":
          // Toggle high contrast
          updateSetting("highContrast", !settings.highContrast)
          break
        case "d":
          // Toggle dark mode
          updateSetting("darkMode", !settings.darkMode)
          // Apply dark mode
          if (typeof document !== "undefined") {
            if (!settings.darkMode) {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          }
          break
        case "m":
          // Toggle motion reduction
          updateSetting("reduceMotion", !settings.reduceMotion)
          break
        case "k":
          // Toggle keyboard navigation mode
          updateSetting("keyboardMode", !settings.keyboardMode)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [settings, updateSetting, isReading, startReading, stopReading])

  return null // This component doesn't render anything
}
