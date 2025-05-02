"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the types for our accessibility settings
export interface AccessibilitySettings {
  // Text settings
  fontSize: number
  lineHeight: number
  letterSpacing: number
  fontFamily: string

  // Visual settings
  highContrast: boolean
  colorFilter: "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
  darkMode: boolean
  reduceMotion: boolean

  // Focus and navigation
  focusIndicator: boolean
  keyboardMode: boolean
  cursorSize: "normal" | "large" | "xlarge"

  // Reading aids
  readingGuide: boolean
  readingGuideHeight: number
  readingGuideColor: string

  // Audio and speech
  speechRate: number
  speechPitch: number
  speechVolume: number
  showCaptions: boolean

  // Simplification
  simplifiedUI: boolean
  imageDescriptions: boolean
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  // Text settings
  fontSize: 1,
  lineHeight: 1.5,
  letterSpacing: 0,
  fontFamily: "system-ui",

  // Visual settings
  highContrast: false,
  colorFilter: "none",
  darkMode: false,
  reduceMotion: false,

  // Focus and navigation
  focusIndicator: false,
  keyboardMode: false,
  cursorSize: "normal",

  // Reading aids
  readingGuide: false,
  readingGuideHeight: 30,
  readingGuideColor: "rgba(255, 255, 0, 0.2)",

  // Audio and speech
  speechRate: 1,
  speechPitch: 1,
  speechVolume: 1,
  showCaptions: false,

  // Simplification
  simplifiedUI: false,
  imageDescriptions: false,
}

// Create the context
interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  resetSettings: () => void
  isReading: boolean
  startReading: () => void
  stopReading: () => void
  pauseReading: () => void
  resumeReading: () => void
  currentReadingText: string
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // State for all accessibility settings
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // State for screen reader functionality
  const [isReading, setIsReading] = useState(false)
  const [currentReadingText, setCurrentReadingText] = useState("")
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  // Load saved settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("accessibilitySettings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Error loading accessibility settings:", error)
      }
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
      } catch (error) {
        console.error("Error saving accessibility settings:", error)
      }
    }
  }, [settings])

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance()
      u.rate = settings.speechRate
      u.pitch = settings.speechPitch
      u.volume = settings.speechVolume

      // Handle speech events
      u.onstart = () => setIsReading(true)
      u.onend = () => {
        setIsReading(false)
        setCurrentReadingText("")
      }
      u.onpause = () => setIsReading(false)
      u.onresume = () => setIsReading(true)
      u.onboundary = (event) => {
        if (event.name === "word" && settings.showCaptions) {
          const text = u.text.substring(event.charIndex, event.charIndex + event.charLength)
          setCurrentReadingText(text)
        }
      }

      setUtterance(u)

      return () => {
        window.speechSynthesis.cancel()
      }
    }
  }, [settings.speechRate, settings.speechPitch, settings.speechVolume, settings.showCaptions])

  // Apply font size
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--a11y-font-size", settings.fontSize.toString())
    }
  }, [settings.fontSize])

  // Apply line height
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--a11y-line-height", settings.lineHeight.toString())
    }
  }, [settings.lineHeight])

  // Apply letter spacing
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--a11y-letter-spacing", `${settings.letterSpacing}px`)
    }
  }, [settings.letterSpacing])

  // Apply font family
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.fontFamily === "dyslexic") {
        document.documentElement.style.setProperty("--a11y-font-family", '"OpenDyslexic", sans-serif')
        // Load OpenDyslexic font if not already loaded
        if (!document.getElementById("dyslexic-font")) {
          const link = document.createElement("link")
          link.id = "dyslexic-font"
          link.rel = "stylesheet"
          link.href = "https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css"
          document.head.appendChild(link)
        }
      } else {
        document.documentElement.style.setProperty("--a11y-font-family", settings.fontFamily)
      }
    }
  }, [settings.fontFamily])

  // Apply high contrast
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }
    }
  }, [settings.highContrast])

  // Apply color filter
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--a11y-color-filter",
        settings.colorFilter === "none" ? "none" : `url(#${settings.colorFilter})`,
      )
    }
  }, [settings.colorFilter])

  // Apply reduced motion
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.reduceMotion) {
        document.body.classList.add("reduce-motion")
      } else {
        document.body.classList.remove("reduce-motion")
      }
    }
  }, [settings.reduceMotion])

  // Apply focus indicator
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.focusIndicator) {
        document.body.classList.add("focus-visible")
      } else {
        document.body.classList.remove("focus-visible")
      }
    }
  }, [settings.focusIndicator])

  // Apply keyboard mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.keyboardMode) {
        document.body.classList.add("keyboard-mode")
      } else {
        document.body.classList.remove("keyboard-mode")
      }
    }
  }, [settings.keyboardMode])

  // Apply cursor size
  useEffect(() => {
    if (typeof document !== "undefined") {
      const size = settings.cursorSize === "normal" ? "1" : settings.cursorSize === "large" ? "1.5" : "2"
      document.documentElement.style.setProperty("--a11y-cursor-size", size)
    }
  }, [settings.cursorSize])

  // Apply simplified UI
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.simplifiedUI) {
        document.body.classList.add("simplified-ui")
      } else {
        document.body.classList.remove("simplified-ui")
      }
    }
  }, [settings.simplifiedUI])

  // Apply image descriptions
  useEffect(() => {
    if (typeof document !== "undefined" && settings.imageDescriptions) {
      // Find all images without alt text and add a placeholder
      const images = document.querySelectorAll('img:not([alt]), img[alt=""]')
      images.forEach((img, index) => {
        const imgElement = img as HTMLImageElement
        if (!imgElement.getAttribute("data-original-alt")) {
          imgElement.setAttribute("data-original-alt", imgElement.alt || "")
          imgElement.alt = `Image ${index + 1} - No description available`
        }
      })

      return () => {
        // Restore original alt text
        const images = document.querySelectorAll("img[data-original-alt]")
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement
          imgElement.alt = imgElement.getAttribute("data-original-alt") || ""
        })
      }
    }
  }, [settings.imageDescriptions])

  // Update a single setting
  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  // Screen reader functions
  const startReading = () => {
    if (!utterance || !window.speechSynthesis) return

    // Get all visible text from the page
    const textContent = document.body.innerText
    utterance.text = textContent
    utterance.rate = settings.speechRate
    utterance.pitch = settings.speechPitch
    utterance.volume = settings.speechVolume

    // Start reading
    window.speechSynthesis.speak(utterance)
  }

  const stopReading = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsReading(false)
    setCurrentReadingText("")
  }

  const pauseReading = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.pause()
  }

  const resumeReading = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.resume()
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isReading,
        startReading,
        stopReading,
        pauseReading,
        resumeReading,
        currentReadingText,
      }}
    >
      {/* SVG Filters for Color Blindness Simulation */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Protanopia (red-blind) */}
          <filter id="protanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>

          {/* Deuteranopia (green-blind) */}
          <filter id="deuteranopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>

          {/* Tritanopia (blue-blind) */}
          <filter id="tritanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>

          {/* Achromatopsia (monochromacy) */}
          <filter id="achromatopsia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0.299, 0.587, 0.114, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Reading guide */}
      {settings.readingGuide && (
        <div
          className="fixed pointer-events-none z-[100]"
          style={{
            left: 0,
            top: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
            width: "100%",
            height: `${settings.readingGuideHeight}px`,
            backgroundColor: settings.readingGuideColor,
          }}
          aria-hidden="true"
        />
      )}

      {/* Captions for screen reader */}
      {settings.showCaptions && isReading && currentReadingText && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg text-lg max-w-2xl text-center z-[100]">
          {currentReadingText}
        </div>
      )}

      {children}

      {/* Global styles for accessibility features */}
      <style jsx global>{`
        :root {
          --a11y-font-size: ${settings.fontSize};
          --a11y-line-height: ${settings.lineHeight};
          --a11y-letter-spacing: ${settings.letterSpacing}px;
          --a11y-font-family: ${settings.fontFamily === "dyslexic" ? '"OpenDyslexic", sans-serif' : settings.fontFamily};
          --a11y-cursor-size: ${settings.cursorSize === "normal" ? "1" : settings.cursorSize === "large" ? "1.5" : "2"};
          --a11y-color-filter: ${settings.colorFilter === "none" ? "none" : `url(#${settings.colorFilter})`};
        }
        
        html {
          font-size: calc(100% * var(--a11y-font-size));
        }
        
        body {
          font-family: var(--a11y-font-family);
          line-height: var(--a11y-line-height);
          letter-spacing: var(--a11y-letter-spacing);
          filter: var(--a11y-color-filter);
        }
        
        .high-contrast {
          filter: contrast(1.5);
        }
        
        .high-contrast * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        
        .high-contrast img {
          filter: grayscale(100%) contrast(1.5);
        }
        
        .reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
        
        .focus-visible :focus {
          outline: 3px solid #ff0 !important;
          outline-offset: 3px !important;
        }
        
        .keyboard-mode a:focus, 
        .keyboard-mode button:focus, 
        .keyboard-mode input:focus, 
        .keyboard-mode select:focus, 
        .keyboard-mode textarea:focus {
          outline: 3px solid #ff0 !important;
          outline-offset: 3px !important;
        }
        
        .simplified-ui * {
          box-shadow: none !important;
          text-shadow: none !important;
          border-radius: 4px !important;
        }
        
        .simplified-ui img {
          opacity: 0.8;
        }
        
        a, button, [role="button"], input, select, textarea {
          cursor: pointer;
          transform: scale(var(--a11y-cursor-size));
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </AccessibilityContext.Provider>
  )
}
