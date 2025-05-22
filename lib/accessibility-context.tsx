"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AccessibilityContextType {
  fontSize: number
  setFontSize: (size: number) => void
  contrast: number
  setContrast: (contrast: number) => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  screenReader: boolean
  setScreenReader: (enabled: boolean) => void
  cursorSize: number
  setCursorSize: (size: number) => void
  resetAll: () => void
}

const defaultContext: AccessibilityContextType = {
  fontSize: 100,
  setFontSize: () => {},
  contrast: 100,
  setContrast: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  screenReader: false,
  setScreenReader: () => {},
  cursorSize: 16,
  setCursorSize: () => {},
  resetAll: () => {},
}

const AccessibilityContext = createContext<AccessibilityContextType>(defaultContext)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(100)
  const [contrast, setContrastState] = useState(100)
  const [reducedMotion, setReducedMotionState] = useState(false)
  const [highContrast, setHighContrastState] = useState(false)
  const [screenReader, setScreenReaderState] = useState(false)
  const [cursorSize, setCursorSizeState] = useState(16)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("accessibility-settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setFontSizeState(settings.fontSize || 100)
        setContrastState(settings.contrast || 100)
        setReducedMotionState(settings.reducedMotion || false)
        setHighContrastState(settings.highContrast || false)
        setScreenReaderState(settings.screenReader || false)
        setCursorSizeState(settings.cursorSize || 16)
      }
    } catch (error) {
      console.error("Error loading accessibility settings:", error)
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    document.documentElement.style.setProperty("--font-size-multiplier", `${fontSize / 100}`)
    document.documentElement.style.setProperty("--contrast-multiplier", `${contrast / 100}`)
    document.documentElement.style.setProperty("--cursor-size", `${cursorSize}px`)

    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }

    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Save settings to localStorage
    try {
      localStorage.setItem(
        "accessibility-settings",
        JSON.stringify({
          fontSize,
          contrast,
          reducedMotion,
          highContrast,
          screenReader,
          cursorSize,
        }),
      )
    } catch (error) {
      console.error("Error saving accessibility settings:", error)
    }
  }, [fontSize, contrast, reducedMotion, highContrast, screenReader, cursorSize])

  const setFontSize = (size: number) => {
    setFontSizeState(size)
  }

  const setContrast = (value: number) => {
    setContrastState(value)
  }

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled)
  }

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled)
  }

  const setScreenReader = (enabled: boolean) => {
    setScreenReaderState(enabled)
  }

  const setCursorSize = (size: number) => {
    setCursorSizeState(size)
  }

  const resetAll = () => {
    setFontSizeState(100)
    setContrastState(100)
    setReducedMotionState(false)
    setHighContrastState(false)
    setScreenReaderState(false)
    setCursorSizeState(16)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrast,
        setContrast,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        screenReader,
        setScreenReader,
        cursorSize,
        setCursorSize,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)

export default AccessibilityContext
