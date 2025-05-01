"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"

// Define the types for our accessibility settings with simplified controls
export interface AccessibilitySettings {
  // Text settings
  fontSize: number
  lineHeight: number
  letterSpacing: number
  fontFamily: string
  fontWeight: "normal" | "medium" | "bold"

  // Visual settings
  highContrast: boolean
  colorFilter: "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
  darkMode: boolean
  reduceMotion: boolean
  reduceTransparency: boolean

  // Focus and navigation
  focusIndicator: boolean
  keyboardMode: boolean
  cursorSize: "normal" | "large" | "xlarge"

  // Reading aids
  readingGuide: boolean
  readingGuideHeight: number
  readingGuideColor: string
  readingGuidePosition: "fixed" | "follow"

  // Audio settings
  volume: number
  isPlaying: boolean

  // Simplification
  simplifiedUI: boolean
  imageDescriptions: boolean
  autoplayVideos: boolean
}

// Default settings with simplified options
const defaultSettings: AccessibilitySettings = {
  // Text settings
  fontSize: 1,
  lineHeight: 1.5,
  letterSpacing: 0,
  fontFamily: "system-ui",
  fontWeight: "normal",

  // Visual settings
  highContrast: false,
  colorFilter: "none",
  darkMode: false,
  reduceMotion: false,
  reduceTransparency: false,

  // Focus and navigation
  focusIndicator: false,
  keyboardMode: false,
  cursorSize: "normal",

  // Reading aids
  readingGuide: false,
  readingGuideHeight: 30,
  readingGuideColor: "rgba(255, 255, 0, 0.2)",
  readingGuidePosition: "fixed",

  // Audio settings
  volume: 1,
  isPlaying: false,

  // Simplification
  simplifiedUI: false,
  imageDescriptions: false,
  autoplayVideos: true,
}

// Create the context with simplified functionality
interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  updateMultipleSettings: (updates: Partial<AccessibilitySettings>) => void
  resetSettings: () => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  savePreset: (name: string) => void
  loadPreset: (name: string) => void
  availablePresets: string[]
  deletePreset: (name: string) => void
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
  const [availablePresets, setAvailablePresets] = useState<string[]>([])

  // Refs for tracking mouse position for reading guide
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const readingGuideRef = useRef<HTMLDivElement | null>(null)
  const audioElementsRef = useRef<HTMLAudioElement[]>([])

  // Load saved settings on mount with error handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("accessibilitySettings")
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          // Validate settings before applying
          const validatedSettings = validateSettings(parsedSettings)
          setSettings(validatedSettings)
        }

        // Load available presets
        const presetKeys = Object.keys(localStorage)
          .filter((key) => key.startsWith("a11yPreset_"))
          .map((key) => key.replace("a11yPreset_", ""))
        setAvailablePresets(presetKeys)

        // Check for system preferences
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

        // Apply system preferences if no saved settings
        if (!savedSettings) {
          setSettings((prev) => ({
            ...prev,
            reduceMotion: prefersReducedMotion,
            darkMode: prefersDarkMode,
          }))
        }
      } catch (error) {
        console.error("Error loading accessibility settings:", error)
        // Fallback to defaults on error
        setSettings(defaultSettings)
      }
    }
  }, [])

  // Validate settings to ensure they're within acceptable ranges
  const validateSettings = (settings: any): AccessibilitySettings => {
    const validated = { ...defaultSettings }

    // Only copy valid properties and ensure they're within acceptable ranges
    if (typeof settings === "object" && settings !== null) {
      // Text settings
      if (typeof settings.fontSize === "number" && settings.fontSize >= 0.5 && settings.fontSize <= 2) {
        validated.fontSize = settings.fontSize
      }
      if (typeof settings.lineHeight === "number" && settings.lineHeight >= 1 && settings.lineHeight <= 3) {
        validated.lineHeight = settings.lineHeight
      }
      if (typeof settings.letterSpacing === "number" && settings.letterSpacing >= -2 && settings.letterSpacing <= 10) {
        validated.letterSpacing = settings.letterSpacing
      }
      if (typeof settings.fontFamily === "string") {
        validated.fontFamily = settings.fontFamily
      }
      if (settings.fontWeight === "normal" || settings.fontWeight === "medium" || settings.fontWeight === "bold") {
        validated.fontWeight = settings.fontWeight
      }

      // Visual settings
      if (typeof settings.highContrast === "boolean") {
        validated.highContrast = settings.highContrast
      }
      if (typeof settings.colorFilter === "string") {
        const validFilters = ["none", "protanopia", "deuteranopia", "tritanopia", "achromatopsia"]
        if (validFilters.includes(settings.colorFilter)) {
          validated.colorFilter = settings.colorFilter
        }
      }
      if (typeof settings.darkMode === "boolean") {
        validated.darkMode = settings.darkMode
      }
      if (typeof settings.reduceMotion === "boolean") {
        validated.reduceMotion = settings.reduceMotion
      }
      if (typeof settings.reduceTransparency === "boolean") {
        validated.reduceTransparency = settings.reduceTransparency
      }

      // Audio settings
      if (typeof settings.volume === "number" && settings.volume >= 0 && settings.volume <= 1) {
        validated.volume = settings.volume
      }
      if (typeof settings.isPlaying === "boolean") {
        validated.isPlaying = settings.isPlaying
      }

      // Continue with other settings...
    }

    return validated
  }

  // Save settings when they change with debounce
  const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear previous timeout
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current)
      }

      // Set new timeout to save settings
      debouncedSaveRef.current = setTimeout(() => {
        try {
          localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
        } catch (error) {
          console.error("Error saving accessibility settings:", error)
        }
      }, 500) // 500ms debounce
    }

    return () => {
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current)
      }
    }
  }, [settings])

  // Apply font size with performance optimization
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

  // Apply font weight
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--a11y-font-weight", settings.fontWeight)
    }
  }, [settings.fontWeight])

  // Apply font family with dynamic loading
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

  // Apply dark mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [settings.darkMode])

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

  // Apply reduced transparency
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.reduceTransparency) {
        document.body.classList.add("reduce-transparency")
      } else {
        document.body.classList.remove("reduce-transparency")
      }
    }
  }, [settings.reduceTransparency])

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

        // Add keyboard event listeners
        const handleKeyDown = (e: KeyboardEvent) => {
          // Add a visible focus indicator to the active element
          const activeElement = document.activeElement
          if (activeElement && activeElement instanceof HTMLElement) {
            activeElement.classList.add("keyboard-focus")
          }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
          document.removeEventListener("keydown", handleKeyDown)
        }
      } else {
        document.body.classList.remove("keyboard-mode")
        // Remove keyboard-focus class from all elements
        document.querySelectorAll(".keyboard-focus").forEach((el) => {
          el.classList.remove("keyboard-focus")
        })
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

  // Apply reading guide with mouse tracking
  useEffect(() => {
    if (typeof document !== "undefined" && settings.readingGuide) {
      // Create or get the reading guide element
      let guideElement = document.getElementById("a11y-reading-guide") as HTMLDivElement

      if (!guideElement) {
        guideElement = document.createElement("div")
        guideElement.id = "a11y-reading-guide"
        guideElement.setAttribute("aria-hidden", "true")
        guideElement.style.position = "fixed"
        guideElement.style.left = "0"
        guideElement.style.width = "100%"
        guideElement.style.pointerEvents = "none"
        guideElement.style.zIndex = "9999"
        document.body.appendChild(guideElement)
      }

      readingGuideRef.current = guideElement

      // Set initial styles
      guideElement.style.height = `${settings.readingGuideHeight}px`
      guideElement.style.backgroundColor = settings.readingGuideColor

      if (settings.readingGuidePosition === "follow") {
        // Track mouse position for the reading guide
        const handleMouseMove = (e: MouseEvent) => {
          mousePositionRef.current = { x: e.clientX, y: e.clientY }

          if (readingGuideRef.current) {
            readingGuideRef.current.style.top = `${mousePositionRef.current.y - settings.readingGuideHeight / 2}px`
          }
        }

        document.addEventListener("mousemove", handleMouseMove)

        return () => {
          document.removeEventListener("mousemove", handleMouseMove)
        }
      } else {
        // Fixed position in the middle of the screen
        guideElement.style.top = `${window.innerHeight / 2 - settings.readingGuideHeight / 2}px`
      }

      return () => {
        if (guideElement && guideElement.parentNode) {
          guideElement.parentNode.removeChild(guideElement)
        }
      }
    } else if (typeof document !== "undefined") {
      // Remove the reading guide if disabled
      const guideElement = document.getElementById("a11y-reading-guide")
      if (guideElement && guideElement.parentNode) {
        guideElement.parentNode.removeChild(guideElement)
      }
    }
  }, [settings.readingGuide, settings.readingGuideHeight, settings.readingGuideColor, settings.readingGuidePosition])

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

          // Try to generate a description based on the image URL or surrounding context
          let description = "Image"

          // Check if the image has a src that might contain descriptive text
          if (imgElement.src) {
            const srcParts = imgElement.src.split("/").pop()?.split(".")[0].split("-") || []
            if (srcParts.length > 0) {
              description = srcParts.join(" ")
            }
          }

          // Check if the image is inside a figure with a figcaption
          const figure = imgElement.closest("figure")
          if (figure) {
            const figcaption = figure.querySelector("figcaption")
            if (figcaption && figcaption.textContent) {
              description = figcaption.textContent.trim()
            }
          }

          imgElement.alt = `${description} ${index + 1}`
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

  // Apply autoplay video settings
  useEffect(() => {
    if (typeof document !== "undefined") {
      const videos = document.querySelectorAll("video")
      videos.forEach((video) => {
        if (!settings.autoplayVideos) {
          video.pause()
          video.autoplay = false
          video.setAttribute("data-a11y-autoplay-disabled", "true")
        } else {
          if (video.getAttribute("data-a11y-autoplay-disabled") === "true") {
            video.autoplay = true
            video.removeAttribute("data-a11y-autoplay-disabled")
            if (video.getAttribute("data-a11y-was-playing") === "true") {
              video.play().catch(() => {
                // Autoplay might be blocked by the browser
                console.log("Autoplay blocked by browser policy")
              })
            }
          }
        }
      })

      // Listen for new videos being added to the DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeName === "VIDEO") {
                const video = node as HTMLVideoElement
                if (!settings.autoplayVideos) {
                  video.pause()
                  video.autoplay = false
                  video.setAttribute("data-a11y-autoplay-disabled", "true")
                }
              } else if (node instanceof HTMLElement) {
                const videos = node.querySelectorAll("video")
                videos.forEach((video) => {
                  if (!settings.autoplayVideos) {
                    video.pause()
                    video.autoplay = false
                    video.setAttribute("data-a11y-autoplay-disabled", "true")
                  }
                })
              }
            })
          }
        })
      })

      observer.observe(document.body, { childList: true, subtree: true })

      return () => {
        observer.disconnect()
      }
    }
  }, [settings.autoplayVideos])

  // Track audio elements and apply volume settings
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Find all audio elements
      const audioElements = document.querySelectorAll("audio")
      audioElementsRef.current = Array.from(audioElements)

      // Apply volume to all audio elements
      audioElementsRef.current.forEach((audio) => {
        audio.volume = settings.volume

        // If volume is 0, pause audio
        if (settings.volume === 0) {
          audio.pause()
        } else if (settings.isPlaying) {
          // Only play if isPlaying is true and volume > 0
          audio.play().catch(() => {
            // Autoplay might be blocked by the browser
            console.log("Autoplay blocked by browser policy")
          })
        }
      })

      // Listen for new audio elements being added to the DOM
      const observer = new MutationObserver((mutations) => {
        let newAudioFound = false

        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeName === "AUDIO") {
                const audio = node as HTMLAudioElement
                audioElementsRef.current.push(audio)
                audio.volume = settings.volume

                if (settings.volume === 0) {
                  audio.pause()
                } else if (settings.isPlaying) {
                  audio.play().catch(() => {
                    console.log("Autoplay blocked by browser policy")
                  })
                }

                newAudioFound = true
              } else if (node instanceof HTMLElement) {
                const audioElements = node.querySelectorAll("audio")
                if (audioElements.length > 0) {
                  audioElements.forEach((audio) => {
                    audioElementsRef.current.push(audio)
                    audio.volume = settings.volume

                    if (settings.volume === 0) {
                      audio.pause()
                    } else if (settings.isPlaying) {
                      audio.play().catch(() => {
                        console.log("Autoplay blocked by browser policy")
                      })
                    }
                  })

                  newAudioFound = true
                }
              }
            })
          }
        })

        // Update the ref if new audio elements were found
        if (newAudioFound) {
          audioElementsRef.current = Array.from(document.querySelectorAll("audio"))
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })

      return () => {
        observer.disconnect()
      }
    }
  }, [settings.volume, settings.isPlaying])

  // Update a single setting
  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [],
  )

  // Update multiple settings at once for better performance
  const updateMultipleSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  // Reset all settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  // Toggle play/pause for audio
  const togglePlay = useCallback(() => {
    setSettings((prev) => {
      const newIsPlaying = !prev.isPlaying

      // Apply to all audio elements
      if (typeof document !== "undefined") {
        audioElementsRef.current.forEach((audio) => {
          if (newIsPlaying && prev.volume > 0) {
            audio.play().catch(() => {
              console.log("Play blocked by browser policy")
            })
          } else {
            audio.pause()
          }
        })
      }

      return {
        ...prev,
        isPlaying: newIsPlaying,
      }
    })
  }, [])

  // Set volume with special handling
  const setVolume = useCallback((volume: number) => {
    setSettings((prev) => {
      // Apply to all audio elements
      if (typeof document !== "undefined") {
        audioElementsRef.current.forEach((audio) => {
          audio.volume = volume

          // If volume is being set to 0, pause audio
          if (volume === 0) {
            audio.pause()
          }
          // If volume is being increased from 0 and isPlaying is true, resume audio
          else if (prev.volume === 0 && volume > 0 && prev.isPlaying) {
            audio.play().catch(() => {
              console.log("Play blocked by browser policy")
            })
          }
        })
      }

      return {
        ...prev,
        volume,
      }
    })
  }, [])

  // Preset management
  const savePreset = useCallback(
    (name: string) => {
      if (typeof window !== "undefined" && name) {
        try {
          localStorage.setItem(`a11yPreset_${name}`, JSON.stringify(settings))

          // Update available presets
          const presetKeys = Object.keys(localStorage)
            .filter((key) => key.startsWith("a11yPreset_"))
            .map((key) => key.replace("a11yPreset_", ""))
          setAvailablePresets(presetKeys)
        } catch (error) {
          console.error("Error saving accessibility preset:", error)
        }
      }
    },
    [settings],
  )

  const loadPreset = useCallback((name: string) => {
    if (typeof window !== "undefined" && name) {
      try {
        const savedPreset = localStorage.getItem(`a11yPreset_${name}`)
        if (savedPreset) {
          const parsedPreset = JSON.parse(savedPreset)
          // Validate settings before applying
          const validatedSettings = validateSettings(parsedPreset)
          setSettings(validatedSettings)
        }
      } catch (error) {
        console.error("Error loading accessibility preset:", error)
      }
    }
  }, [])

  const deletePreset = useCallback((name: string) => {
    if (typeof window !== "undefined" && name) {
      try {
        localStorage.removeItem(`a11yPreset_${name}`)

        // Update available presets
        const presetKeys = Object.keys(localStorage)
          .filter((key) => key.startsWith("a11yPreset_"))
          .map((key) => key.replace("a11yPreset_", ""))
        setAvailablePresets(presetKeys)
      } catch (error) {
        console.error("Error deleting accessibility preset:", error)
      }
    }
  }, [])

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        updateMultipleSettings,
        resetSettings,
        togglePlay,
        setVolume,
        savePreset,
        loadPreset,
        availablePresets,
        deletePreset,
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

      {children}

      {/* Global styles for accessibility features */}
      <style jsx global>{`
        :root {
          --a11y-font-size: ${settings.fontSize};
          --a11y-line-height: ${settings.lineHeight};
          --a11y-letter-spacing: ${settings.letterSpacing}px;
          --a11y-font-family: ${settings.fontFamily === "dyslexic" ? '"OpenDyslexic", sans-serif' : settings.fontFamily};
          --a11y-font-weight: ${settings.fontWeight};
          --a11y-cursor-size: ${settings.cursorSize === "normal" ? "1" : settings.cursorSize === "large" ? "1.5" : "2"};
          --a11y-color-filter: ${settings.colorFilter === "none" ? "none" : `url(#${settings.colorFilter})`};
        }
        
        html {
          font-size: calc(100% * var(--a11y-font-size));
        }
        
        body {
          font-family: var(--a11y-  * var(--a11y-font-size));
        }
        
        body {
          font-family: var(--a11y-font-family);
          line-height: var(--a11y-line-height);
          letter-spacing: var(--a11y-letter-spacing);
          font-weight: var(--a11y-font-weight);
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
          animation-duration: 0.001s !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001s !important;
          scroll-behavior: auto !important;
        }
        
        .reduce-transparency * {
          opacity: 1 !important;
          background-color: rgba(0, 0, 0, 1) !important;
        }
        
        .focus-visible :focus {
          outline: 3px solid #ff0 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 0, 0.5) !important;
        }
        
        .keyboard-mode a:focus, 
        .keyboard-mode button:focus, 
        .keyboard-mode input:focus, 
        .keyboard-mode select:focus, 
        .keyboard-mode textarea:focus {
          outline: 3px solid #ff0 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 0, 0.5) !important;
        }
        
        .keyboard-focus {
          outline: 3px solid #ff0 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 0, 0.5) !important;
        }
        
        .simplified-ui * {
          box-shadow: none !important;
          text-shadow: none !important;
          border-radius: 4px !important;
          background-image: none !important;
          background-color: var(--background, #fff) !important;
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
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001s !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </AccessibilityContext.Provider>
  )
}
