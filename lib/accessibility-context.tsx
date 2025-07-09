"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type TextAlignment = "left" | "center" | "right" | "justify"
type FontFamily = "sans" | "serif" | "mono"
type Language = "en" | "es" | "fr" | "de"

interface AccessibilityContextType {
  highContrast: boolean
  toggleHighContrast: () => void
  fontSize: number
  setFontSize: (size: number) => void
  grayscale: boolean
  toggleGrayscale: () => void
  invertColors: boolean
  toggleInvertColors: () => void
  lineHeight: number
  setLineHeight: (height: number) => void
  letterSpacing: number
  setLetterSpacing: (spacing: number) => void
  animations: boolean
  toggleAnimations: () => void
  screenReaderMode: boolean
  toggleScreenReaderMode: () => void
  linkHighlight: boolean
  toggleLinkHighlight: () => void
  textAlignment: TextAlignment
  setTextAlignment: (alignment: TextAlignment) => void
  fontFamily: FontFamily
  setFontFamily: (family: FontFamily) => void
  keyboardNavigation: boolean
  toggleKeyboardNavigation: () => void
  language: Language
  setLanguage: (language: Language) => void
  resetAccessibilitySettings: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const DEFAULT_FONT_SIZE = 100
const DEFAULT_LINE_HEIGHT = 1.5
const DEFAULT_LETTER_SPACING = 0
const DEFAULT_TEXT_ALIGNMENT: TextAlignment = "left"
const DEFAULT_FONT_FAMILY: FontFamily = "sans"
const DEFAULT_LANGUAGE: Language = "en"

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(() => getInitialState("highContrast", false))
  const [fontSize, setFontSize] = useState(() => getInitialState("fontSize", DEFAULT_FONT_SIZE))
  const [grayscale, setGrayscale] = useState(() => getInitialState("grayscale", false))
  const [invertColors, setInvertColors] = useState(() => getInitialState("invertColors", false))
  const [lineHeight, setLineHeight] = useState(() => getInitialState("lineHeight", DEFAULT_LINE_HEIGHT))
  const [letterSpacing, setLetterSpacing] = useState(() => getInitialState("letterSpacing", DEFAULT_LETTER_SPACING))
  const [animations, setAnimations] = useState(() => getInitialState("animations", true))
  const [screenReaderMode, setScreenReaderMode] = useState(() => getInitialState("screenReaderMode", false))
  const [linkHighlight, setLinkHighlight] = useState(() => getInitialState("linkHighlight", false))
  const [textAlignment, setTextAlignment] = useState<TextAlignment>(() =>
    getInitialState("textAlignment", DEFAULT_TEXT_ALIGNMENT),
  )
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => getInitialState("fontFamily", DEFAULT_FONT_FAMILY))
  const [keyboardNavigation, setKeyboardNavigation] = useState(() => getInitialState("keyboardNavigation", false))
  const [language, setLanguage] = useState<Language>(() => getInitialState("language", DEFAULT_LANGUAGE))

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("highContrast", JSON.stringify(highContrast))
  }, [highContrast])
  useEffect(() => {
    localStorage.setItem("fontSize", JSON.stringify(fontSize))
  }, [fontSize])
  useEffect(() => {
    localStorage.setItem("grayscale", JSON.stringify(grayscale))
  }, [grayscale])
  useEffect(() => {
    localStorage.setItem("invertColors", JSON.stringify(invertColors))
  }, [invertColors])
  useEffect(() => {
    localStorage.setItem("lineHeight", JSON.stringify(lineHeight))
  }, [lineHeight])
  useEffect(() => {
    localStorage.setItem("letterSpacing", JSON.stringify(letterSpacing))
  }, [letterSpacing])
  useEffect(() => {
    localStorage.setItem("animations", JSON.stringify(animations))
  }, [animations])
  useEffect(() => {
    localStorage.setItem("screenReaderMode", JSON.stringify(screenReaderMode))
  }, [screenReaderMode])
  useEffect(() => {
    localStorage.setItem("linkHighlight", JSON.stringify(linkHighlight))
  }, [linkHighlight])
  useEffect(() => {
    localStorage.setItem("textAlignment", JSON.stringify(textAlignment))
  }, [textAlignment])
  useEffect(() => {
    localStorage.setItem("fontFamily", JSON.stringify(fontFamily))
  }, [fontFamily])
  useEffect(() => {
    localStorage.setItem("keyboardNavigation", JSON.stringify(keyboardNavigation))
  }, [keyboardNavigation])
  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language))
  }, [language])

  const applySettings = useCallback(() => {
    const root = document.documentElement
    root.style.setProperty("--font-size-multiplier", `${fontSize / 100}`)
    root.style.setProperty("--line-height-multiplier", `${lineHeight}`)
    root.style.setProperty("--letter-spacing-em", `${letterSpacing}em`)
    root.style.setProperty("--text-align", textAlignment)

    if (fontFamily === "serif") {
      root.style.setProperty("--font-family", "Georgia, serif")
    } else if (fontFamily === "mono") {
      root.style.setProperty("--font-family", "monospace")
    } else {
      root.style.setProperty("--font-family", "sans-serif")
    }

    root.classList.toggle("high-contrast", highContrast)
    root.classList.toggle("grayscale", grayscale)
    root.classList.toggle("invert-colors", invertColors)
    root.classList.toggle("animations-disabled", !animations)
    root.classList.toggle("screen-reader-mode", screenReaderMode)
    root.classList.toggle("link-highlight", linkHighlight)
    root.classList.toggle("keyboard-navigation-enabled", keyboardNavigation)
    root.lang = language // Set HTML lang attribute
  }, [
    fontSize,
    lineHeight,
    letterSpacing,
    textAlignment,
    fontFamily,
    highContrast,
    grayscale,
    invertColors,
    animations,
    screenReaderMode,
    linkHighlight,
    keyboardNavigation,
    language,
  ])

  useEffect(() => {
    applySettings()
  }, [applySettings])

  const toggleHighContrast = useCallback(() => setHighContrast((prev) => !prev), [])
  const toggleGrayscale = useCallback(() => setGrayscale((prev) => !prev), [])
  const toggleInvertColors = useCallback(() => setInvertColors((prev) => !prev), [])
  const toggleAnimations = useCallback(() => setAnimations((prev) => !prev), [])
  const toggleScreenReaderMode = useCallback(() => setScreenReaderMode((prev) => !prev), [])
  const toggleLinkHighlight = useCallback(() => setLinkHighlight((prev) => !prev), [])
  const toggleKeyboardNavigation = useCallback(() => setKeyboardNavigation((prev) => !prev), [])

  const resetAccessibilitySettings = useCallback(() => {
    setHighContrast(false)
    setFontSize(DEFAULT_FONT_SIZE)
    setGrayscale(false)
    setInvertColors(false)
    setLineHeight(DEFAULT_LINE_HEIGHT)
    setLetterSpacing(DEFAULT_LETTER_SPACING)
    setAnimations(true)
    setScreenReaderMode(false)
    setLinkHighlight(false)
    setTextAlignment(DEFAULT_TEXT_ALIGNMENT)
    setFontFamily(DEFAULT_FONT_FAMILY)
    setKeyboardNavigation(false)
    setLanguage(DEFAULT_LANGUAGE)

    // Clear localStorage for all accessibility settings
    if (typeof window !== "undefined") {
      localStorage.removeItem("highContrast")
      localStorage.removeItem("fontSize")
      localStorage.removeItem("grayscale")
      localStorage.removeItem("invertColors")
      localStorage.removeItem("lineHeight")
      localStorage.removeItem("letterSpacing")
      localStorage.removeItem("animations")
      localStorage.removeItem("screenReaderMode")
      localStorage.removeItem("linkHighlight")
      localStorage.removeItem("textAlignment")
      localStorage.removeItem("fontFamily")
      localStorage.removeItem("keyboardNavigation")
      localStorage.removeItem("language")
    }
  }, [])

  const value = {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    grayscale,
    toggleGrayscale,
    invertColors,
    toggleInvertColors,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    animations,
    toggleAnimations,
    screenReaderMode,
    toggleScreenReaderMode,
    linkHighlight,
    toggleLinkHighlight,
    textAlignment,
    setTextAlignment,
    fontFamily,
    setFontFamily,
    keyboardNavigation,
    toggleKeyboardNavigation,
    language,
    setLanguage,
    resetAccessibilitySettings,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
