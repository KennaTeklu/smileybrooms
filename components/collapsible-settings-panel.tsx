"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Palette,
  Accessibility,
  Text,
  Languages,
  ChevronDown,
  Volume2,
  Eye,
  EyeOff,
  Mouse,
  Zap,
  RefreshCw,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Monitor,
  Contrast,
  Type,
  Focus,
  Navigation,
  Headphones,
  Mic,
  Timer,
  Activity,
} from "lucide-react"
import { useAccessibility } from "@/lib/accessibility-context"
import { cn } from "@/lib/utils"

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("accessibility")
  const [previewMode, setPreviewMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [announcements, setAnnouncements] = useState(true)
  const [focusRingStyle, setFocusRingStyle] = useState("default")
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [colorBlindnessMode, setColorBlindnessMode] = useState("none")
  const [readingMode, setReadingMode] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState(1)
  const [autoSave, setAutoSave] = useState(true)
  const [complianceScore, setComplianceScore] = useState(85)

  // Voice Reader State Management
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [currentSentence, setCurrentSentence] = useState<string>("")
  const [sentences, setSentences] = useState<string[]>([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0)

  const expandedPanelRef = useRef<HTMLDivElement>(null)
  const collapsedButtonRef = useRef<HTMLButtonElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate compliance score based on active settings
  useEffect(() => {
    const activeSettings = [
      preferences.highContrast,
      preferences.largeText,
      preferences.reducedMotion,
      preferences.screenReaderMode,
      preferences.keyboardNavigation,
      soundEnabled,
      announcements,
      readingMode,
    ].filter(Boolean).length

    const newScore = Math.min(100, 60 + activeSettings * 5)
    setComplianceScore(newScore)
  }, [preferences, soundEnabled, announcements, readingMode])

  // Enhanced click outside detection with better performance
  useEffect(() => {
    if (!isMounted || !isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      if (collapsedButtonRef.current?.contains(target)) return
      if (expandedPanelRef.current?.contains(target)) return
      if (backdropRef.current && (backdropRef.current === target || backdropRef.current.contains(target))) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        collapsedButtonRef.current?.focus()
      }
    }

    // Enhanced keyboard navigation
    const handleKeyNavigation = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "Tab") {
        // Trap focus within panel
        const focusableElements = expandedPanelRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside, true)
    document.addEventListener("touchstart", handleClickOutside, true)
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("keydown", handleKeyNavigation)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("keydown", handleKeyNavigation)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, isMounted])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isMounted) {
      const settings = {
        soundEnabled,
        announcements,
        focusRingStyle,
        animationSpeed,
        colorBlindnessMode,
        readingMode,
        voiceSpeed,
      }
      localStorage.setItem("advancedAccessibilitySettings", JSON.stringify(settings))
    }
  }, [
    soundEnabled,
    announcements,
    focusRingStyle,
    animationSpeed,
    colorBlindnessMode,
    readingMode,
    voiceSpeed,
    autoSave,
    isMounted,
  ])

  // Load saved settings
  useEffect(() => {
    if (isMounted) {
      try {
        const saved = localStorage.getItem("advancedAccessibilitySettings")
        if (saved) {
          const settings = JSON.parse(saved)
          setSoundEnabled(settings.soundEnabled ?? false)
          setAnnouncements(settings.announcements ?? true)
          setFocusRingStyle(settings.focusRingStyle ?? "default")
          setAnimationSpeed(settings.animationSpeed ?? 1)
          setColorBlindnessMode(settings.colorBlindnessMode ?? "none")
          setReadingMode(settings.readingMode ?? false)
          setVoiceSpeed(settings.voiceSpeed ?? 1)
        }
      } catch (error) {
        console.error("Failed to load advanced settings:", error)
      }
    }
  }, [isMounted])

  const playSound = useCallback(
    (type: "success" | "toggle" | "error" = "toggle") => {
      if (!soundEnabled) return

      // Create audio context for better browser support
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        const frequencies = { success: 800, toggle: 600, error: 300 }
        oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (error) {
        // Fallback for browsers without Web Audio API
        console.log(`Sound: ${type}`)
      }
    },
    [soundEnabled],
  )

  const announceToScreenReader = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (!announcements) return

      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", priority)
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = message

      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
    },
    [announcements],
  )

  const handleReset = () => {
    resetPreferences()
    setSoundEnabled(false)
    setAnnouncements(true)
    setFocusRingStyle("default")
    setAnimationSpeed(1)
    setColorBlindnessMode("none")
    setReadingMode(false)
    setVoiceSpeed(1)
    playSound("success")
    announceToScreenReader("All settings have been reset to defaults", "assertive")
  }

  const handleSettingChange = (setting: string, value: any) => {
    playSound("toggle")
    announceToScreenReader(`${setting} ${value ? "enabled" : "disabled"}`)
  }

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
    { value: "it", label: "Italiano", flag: "🇮🇹" },
    { value: "pt", label: "Português", flag: "🇵🇹" },
    { value: "ja", label: "日本語", flag: "🇯🇵" },
    { value: "ko", label: "한국어", flag: "🇰🇷" },
    { value: "zh", label: "中文", flag: "🇨🇳" },
    { value: "ar", label: "العربية", flag: "🇸🇦" },
  ]

  const fontFamilyOptions = [
    { value: "Inter, sans-serif", label: "Default (Inter)", preview: "Aa" },
    { value: "Arial, sans-serif", label: "Arial", preview: "Aa" },
    { value: "Georgia, serif", label: "Georgia", preview: "Aa" },
    { value: "Times New Roman, serif", label: "Times New Roman", preview: "Aa" },
    { value: "Helvetica, sans-serif", label: "Helvetica", preview: "Aa" },
    { value: "Verdana, sans-serif", label: "Verdana", preview: "Aa" },
    { value: "OpenDyslexic, monospace", label: "OpenDyslexic (Dyslexia-friendly)", preview: "Aa" },
    { value: "monospace", label: "Monospace", preview: "Aa" },
  ]

  const textAlignmentOptions = [
    { value: "left", label: "Left", icon: "⬅️" },
    { value: "center", label: "Center", icon: "↔️" },
    { value: "right", label: "Right", icon: "➡️" },
    { value: "justify", label: "Justify", icon: "⬌" },
  ]

  const focusRingOptions = [
    { value: "default", label: "Default", preview: "━━━━" },
    { value: "thick", label: "Thick", preview: "████" },
    { value: "dotted", label: "Dotted", preview: "┅┅┅┅" },
    { value: "glow", label: "Glow", preview: "◯◯◯◯" },
  ]

  const colorBlindnessOptions = [
    { value: "none", label: "None" },
    { value: "protanopia", label: "Protanopia (Red-blind)" },
    { value: "deuteranopia", label: "Deuteranopia (Green-blind)" },
    { value: "tritanopia", label: "Tritanopia (Blue-blind)" },
    { value: "monochromacy", label: "Monochromacy (Complete color blindness)" },
  ]

  // Helper function to split text into sentences
  const splitIntoSentences = (text: string): string[] => {
    // Split by sentence endings, but keep the punctuation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []
    return sentences.map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 0)
  }

  // Helper function to read a specific sentence
  const readSentenceAtIndex = (index: number, speed: number = voiceSpeed) => {
    if (index >= 0 && index < sentences.length) {
      const sentence = sentences[index]
      setCurrentSentence(sentence)
      setCurrentSentenceIndex(index)

      const utterance = new SpeechSynthesisUtterance(sentence)
      utterance.rate = speed
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        setIsReading(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        // Automatically move to next sentence
        if (index < sentences.length - 1) {
          setTimeout(() => {
            readSentenceAtIndex(index + 1, speed)
          }, 200) // Small pause between sentences
        } else {
          // Finished reading all sentences
          setIsReading(false)
          setIsPaused(false)
          setCurrentUtterance(null)
          announceToScreenReader("Reading finished")
        }
      }

      utterance.onpause = () => {
        setIsPaused(true)
      }

      utterance.onresume = () => {
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsReading(false)
        setIsPaused(false)
        setCurrentUtterance(null)
        announceToScreenReader("Reading error occurred")
      }

      speechSynthesis.speak(utterance)
      setCurrentUtterance(utterance)
    }
  }

  // Helper function to start reading
  const startReading = () => {
    const selectedText = window.getSelection()?.toString()
    const textToRead = selectedText || document.body.innerText.slice(0, 2000) + "..."

    const sentenceArray = splitIntoSentences(textToRead)
    setSentences(sentenceArray)
    setCurrentSentenceIndex(0)

    if (sentenceArray.length > 0) {
      readSentenceAtIndex(0)
      playSound("success")
      announceToScreenReader("Reading started")
    } else {
      announceToScreenReader("No text found to read")
    }
  }

  if (!isMounted) return null

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="expanded-settings"
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === backdropRef.current) {
              setIsOpen(false)
            }
          }}
        >
          <motion.div
            ref={expandedPanelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200/50 dark:border-purple-800/50 max-h-[90vh] flex flex-col"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white p-5 border-b border-purple-500/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Advanced Settings
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-purple-100 text-sm">Accessibility Compliance</p>
                    <div className="flex items-center gap-2">
                      <Progress value={complianceScore} className="w-20 h-2" />
                      <Badge variant={complianceScore >= 90 ? "default" : "secondary"} className="text-xs">
                        {complianceScore}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-white hover:bg-white/20 rounded-xl"
                  aria-label={previewMode ? "Exit preview mode" : "Enter preview mode"}
                >
                  {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                  aria-label="Close settings panel"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full p-6 flex-1 flex flex-col overflow-hidden"
              style={{
                transitionDuration: `${1 / animationSpeed}s`,
              }}
            >
              <TabsList className="grid w-full grid-cols-4 bg-purple-100 dark:bg-purple-900/70 flex-shrink-0 h-12">
                <TabsTrigger
                  value="accessibility"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  style={{ transitionDuration: `${1 / animationSpeed}s` }}
                >
                  <Accessibility className="h-4 w-4" />
                  <span className="hidden sm:inline">Access</span>
                </TabsTrigger>
                <TabsTrigger
                  value="display"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  style={{ transitionDuration: `${1 / animationSpeed}s` }}
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Display</span>
                </TabsTrigger>
                <TabsTrigger
                  value="interaction"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  style={{ transitionDuration: `${1 / animationSpeed}s` }}
                >
                  <Mouse className="h-4 w-4" />
                  <span className="hidden sm:inline">Input</span>
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                  style={{ transitionDuration: `${1 / animationSpeed}s` }}
                >
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* Accessibility Tab */}
              <TabsContent
                value="accessibility"
                className="mt-6 space-y-6 flex-1 overflow-y-auto pr-2"
                style={{
                  transitionDuration: `${1 / animationSpeed}s`,
                  transitionProperty: "opacity, transform",
                }}
              >
                <div className="grid gap-4">
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Contrast className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="high-contrast" className="text-gray-700 dark:text-gray-300 font-medium">
                          High Contrast Mode
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increases contrast for better visibility
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={preferences.highContrast}
                      onCheckedChange={(checked) => {
                        updatePreference("highContrast", checked)
                        handleSettingChange("High contrast", checked)
                        // Apply high contrast immediately
                        if (checked) {
                          document.documentElement.style.filter = "contrast(1.5)"
                        } else {
                          document.documentElement.style.filter = "none"
                        }
                      }}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Type className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="large-text" className="text-gray-700 dark:text-gray-300 font-medium">
                          Large Text
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increases text size for better readability
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="large-text"
                      checked={preferences.largeText}
                      onCheckedChange={(checked) => {
                        updatePreference("largeText", checked)
                        handleSettingChange("Large text", checked)
                        // Apply large text immediately
                        if (checked) {
                          document.documentElement.style.fontSize = "120%"
                        } else {
                          document.documentElement.style.fontSize = "100%"
                        }
                      }}
                      aria-label="Toggle large text mode"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="reduced-motion" className="text-gray-700 dark:text-gray-300 font-medium">
                          Reduced Motion
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Minimizes animations and transitions</p>
                      </div>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={preferences.reducedMotion}
                      onCheckedChange={(checked) => {
                        updatePreference("reducedMotion", checked)
                        handleSettingChange("Reduced motion", checked)
                        // Apply reduced motion immediately
                        if (checked) {
                          document.documentElement.style.setProperty("--global-animation-duration", "0.01s")
                          document.documentElement.style.setProperty("--global-transition-duration", "0.01s")
                        } else {
                          document.documentElement.style.removeProperty("--global-animation-duration")
                          document.documentElement.style.removeProperty("--global-transition-duration")
                        }
                      }}
                      aria-label="Toggle reduced motion"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Headphones className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="screen-reader-mode" className="text-gray-700 dark:text-gray-300 font-medium">
                          Screen Reader Optimization
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Optimizes interface for screen readers
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="screen-reader-mode"
                      checked={preferences.screenReaderMode}
                      onCheckedChange={(checked) => {
                        updatePreference("screenReaderMode", checked)
                        handleSettingChange("Screen reader mode", checked)
                        // Apply screen reader optimizations
                        if (checked) {
                          document.documentElement.setAttribute("data-screen-reader", "true")
                        } else {
                          document.documentElement.removeAttribute("data-screen-reader")
                        }
                      }}
                      aria-label="Toggle screen reader mode"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Navigation className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="keyboard-navigation" className="text-gray-700 dark:text-gray-300 font-medium">
                          Enhanced Keyboard Navigation
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Improves keyboard-only navigation</p>
                      </div>
                    </div>
                    <Switch
                      id="keyboard-navigation"
                      checked={preferences.keyboardNavigation}
                      onCheckedChange={(checked) => {
                        updatePreference("keyboardNavigation", checked)
                        handleSettingChange("Keyboard navigation", checked)
                        // Apply keyboard navigation styles
                        if (checked) {
                          document.documentElement.setAttribute("data-keyboard-nav", "true")
                        } else {
                          document.documentElement.removeAttribute("data-keyboard-nav")
                        }
                      }}
                      aria-label="Toggle keyboard navigation indicators"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="sound-feedback" className="text-gray-700 dark:text-gray-300 font-medium">
                          Audio Feedback
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Plays sounds for interface interactions
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sound-feedback"
                      checked={soundEnabled}
                      onCheckedChange={(checked) => {
                        setSoundEnabled(checked)
                        handleSettingChange("Audio feedback", checked)
                      }}
                      aria-label="Toggle audio feedback"
                    />
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="announcements" className="text-gray-700 dark:text-gray-300 font-medium">
                          Screen Reader Announcements
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Announces changes to screen readers</p>
                      </div>
                    </div>
                    <Switch
                      id="announcements"
                      checked={announcements}
                      onCheckedChange={(checked) => {
                        setAnnouncements(checked)
                        handleSettingChange("Announcements", checked)
                      }}
                      aria-label="Toggle screen reader announcements"
                    />
                  </div>

                  {/* Voice Reader Controls */}
                  <div
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Headphones className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">Voice Reader</h3>
                    </div>

                    {/* Current Reading Display */}
                    {(isReading || isPaused) && currentSentence && (
                      <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${isReading && !isPaused ? "bg-green-500 animate-pulse" : isPaused ? "bg-yellow-500" : "bg-gray-400"}`}
                          ></div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {isReading && !isPaused ? "Reading" : isPaused ? "Paused" : "Ready"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{currentSentence}</p>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Voice Speed Control */}
                    <div className="mb-4">
                      <Label className="mb-2 block text-gray-700 dark:text-gray-300 font-medium">
                        Reading Speed: {voiceSpeed}x
                      </Label>
                      <Slider
                        value={[voiceSpeed]}
                        onValueChange={(value) => {
                          setVoiceSpeed(value[0])
                          playSound("toggle")

                          // If currently reading, update the speed of the current utterance
                          if (currentUtterance && isReading && !isPaused) {
                            // Cancel current reading and restart with new speed
                            speechSynthesis.cancel()
                            readSentenceAtIndex(currentSentenceIndex, value[0])
                          } else {
                            // Just test the speed with a short phrase
                            const testUtterance = new SpeechSynthesisUtterance("Speed changed")
                            testUtterance.rate = value[0]
                            testUtterance.volume = 0.5
                            speechSynthesis.cancel()
                            speechSynthesis.speak(testUtterance)
                          }
                        }}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Slow</span>
                        <span>Fast</span>
                      </div>
                    </div>

                    {/* Smart Play/Pause/Resume Controls */}
                    <div className="flex items-center gap-3 mb-4">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (isReading && !isPaused) {
                            // Currently reading - pause it
                            speechSynthesis.pause()
                            setIsPaused(true)
                            playSound("toggle")
                            announceToScreenReader("Reading paused")
                          } else if (isPaused) {
                            // Currently paused - resume it
                            speechSynthesis.resume()
                            setIsPaused(false)
                            playSound("toggle")
                            announceToScreenReader("Reading resumed")
                          } else {
                            // Not reading - start new reading
                            startReading()
                          }
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isReading && !isPaused ? (
                          <>
                            <Timer className="h-4 w-4" />
                            Pause
                          </>
                        ) : isPaused ? (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4" />
                            {window.getSelection()?.toString() ? "Read Selection" : "Read Page"}
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          speechSynthesis.cancel()
                          setIsReading(false)
                          setIsPaused(false)
                          setCurrentUtterance(null)
                          setCurrentSentence("")
                          setSentences([])
                          setCurrentSentenceIndex(0)
                          playSound("toggle")
                          announceToScreenReader("Reading stopped")
                        }}
                        disabled={!isReading && !isPaused}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Stop
                      </Button>

                      {/* Navigation Controls */}
                      {sentences.length > 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (currentSentenceIndex > 0) {
                                const newIndex = currentSentenceIndex - 1
                                setCurrentSentenceIndex(newIndex)
                                setCurrentSentence(sentences[newIndex])
                                if (isReading && !isPaused) {
                                  speechSynthesis.cancel()
                                  readSentenceAtIndex(newIndex)
                                }
                                playSound("toggle")
                              }
                            }}
                            disabled={currentSentenceIndex === 0}
                            className="flex items-center gap-1 px-2"
                          >
                            ⏮️
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (currentSentenceIndex < sentences.length - 1) {
                                const newIndex = currentSentenceIndex + 1
                                setCurrentSentenceIndex(newIndex)
                                setCurrentSentence(sentences[newIndex])
                                if (isReading && !isPaused) {
                                  speechSynthesis.cancel()
                                  readSentenceAtIndex(newIndex)
                                }
                                playSound("toggle")
                              }
                            }}
                            disabled={currentSentenceIndex === sentences.length - 1}
                            className="flex items-center gap-1 px-2"
                          >
                            ⏭️
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Reading Options */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Read selected text only
                        </Label>
                        <Switch
                          checked={true}
                          onCheckedChange={(checked) => {
                            handleSettingChange("Read selection mode", checked)
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Audio feedback sounds
                        </Label>
                        <Switch
                          checked={soundEnabled}
                          onCheckedChange={(checked) => {
                            setSoundEnabled(checked)
                            handleSettingChange("Audio feedback", checked)
                          }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-sm text-blue-600 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 rounded p-2">
                      Status: {isReading && !isPaused ? "Reading..." : isPaused ? "Paused" : "Ready"}
                      {isReading && <span className="ml-2">• Speed: {voiceSpeed}x</span>}
                      {sentences.length > 0 && (
                        <span className="ml-2">
                          • Progress: {currentSentenceIndex + 1}/{sentences.length}
                        </span>
                      )}
                    </div>

                    {/* Simple Instructions */}
                    <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                      <strong>Tip:</strong> Select text on the page and click "Read Selection" to read specific content,
                      or click "Read Page" to read from the beginning. Use pause/resume to control playback and
                      navigation arrows to jump between sentences.
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Display Tab */}
              <TabsContent
                value="display"
                className="mt-6 space-y-6 flex-1 overflow-y-auto pr-2"
                style={{
                  transitionDuration: `${1 / animationSpeed}s`,
                  transitionProperty: "opacity, transform",
                }}
              >
                <div className="space-y-6">
                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label
                      htmlFor="text-alignment"
                      className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                    >
                      <Text className="h-5 w-5 text-purple-600" />
                      Text Alignment
                    </Label>
                    <Select
                      value={preferences.textAlignment}
                      onValueChange={(value: "left" | "center" | "right" | "justify") => {
                        updatePreference("textAlignment", value)
                        playSound("toggle")
                        // Apply text alignment immediately
                        document.documentElement.style.textAlign = value
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {textAlignmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                            <span className="mr-2">{option.icon}</span>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label
                      htmlFor="font-family"
                      className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                    >
                      <Type className="h-5 w-5 text-purple-600" />
                      Font Family
                    </Label>
                    <Select
                      value={preferences.fontFamily}
                      onValueChange={(value: string) => {
                        updatePreference("fontFamily", value)
                        playSound("toggle")
                        // Apply font family immediately
                        document.documentElement.style.fontFamily = value
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {fontFamilyOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="flex items-center justify-between"
                          >
                            <span>{option.label}</span>
                            <span className="ml-2 text-lg" style={{ fontFamily: option.value }}>
                              {option.preview}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label
                      htmlFor="language"
                      className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                    >
                      <Languages className="h-5 w-5 text-purple-600" />
                      Language & Region
                    </Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value: string) => {
                        updatePreference("language", value)
                        playSound("toggle")
                        // Apply language immediately
                        document.documentElement.lang = value
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                            <span className="mr-2">{option.flag}</span>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-600" />
                      Color Vision Support
                    </Label>
                    <Select
                      value={colorBlindnessMode}
                      onValueChange={(value: string) => {
                        setColorBlindnessMode(value)
                        playSound("toggle")
                        announceToScreenReader(`Color vision mode changed to ${value}`)
                        // Apply color vision filters immediately
                        const filters = {
                          none: "none",
                          protanopia: "url(#protanopia)",
                          deuteranopia: "url(#deuteranopia)",
                          tritanopia: "url(#tritanopia)",
                          monochromacy: "grayscale(100%)",
                        }
                        document.documentElement.style.filter = filters[value as keyof typeof filters] || "none"
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select color vision mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {colorBlindnessOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Interaction Tab */}
              <TabsContent
                value="interaction"
                className="mt-6 space-y-6 flex-1 overflow-y-auto pr-2"
                style={{
                  transitionDuration: `${1 / animationSpeed}s`,
                  transitionProperty: "opacity, transform",
                }}
              >
                <div className="space-y-6">
                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <Focus className="h-5 w-5 text-purple-600" />
                      Focus Ring Style
                    </Label>
                    <Select
                      value={focusRingStyle}
                      onValueChange={(value: string) => {
                        setFocusRingStyle(value)
                        playSound("toggle")
                        // Apply focus ring styles immediately
                        const focusStyles = {
                          default: "2px solid #8b5cf6",
                          thick: "4px solid #8b5cf6",
                          dotted: "2px dotted #8b5cf6",
                          glow: "0 0 0 3px rgba(139, 92, 246, 0.5)",
                        }
                        document.documentElement.style.setProperty(
                          "--focus-ring",
                          focusStyles[value as keyof typeof focusStyles] || focusStyles.default,
                        )
                      }}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="Select focus style" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {focusRingOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="flex items-center justify-between"
                          >
                            <span>{option.label}</span>
                            <span className="ml-2 font-mono text-sm">{option.preview}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <Timer className="h-5 w-5 text-purple-600" />
                      Animation Speed
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => {
                          setAnimationSpeed(value[0])
                          playSound("toggle")
                          // Apply animation speed globally using CSS custom properties
                          const speedValue = `${1 / value[0]}s`
                          document.documentElement.style.setProperty("--global-animation-duration", speedValue)
                          document.documentElement.style.setProperty("--global-transition-duration", speedValue)
                        }}
                        max={2}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Slow (0.1x)</span>
                        <span className="font-medium">{animationSpeed}x</span>
                        <span>Fast (2x)</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <Label className="mb-3 block text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                      <Mic className="h-5 w-5 text-purple-600" />
                      Voice Speed (Screen Readers)
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[voiceSpeed]}
                        onValueChange={(value) => {
                          setVoiceSpeed(value[0])
                          playSound("toggle")
                          // Test voice speed immediately
                          const testUtterance = new SpeechSynthesisUtterance("Voice speed changed")
                          testUtterance.rate = value[0]
                          testUtterance.volume = 0.5
                          speechSynthesis.cancel()
                          speechSynthesis.speak(testUtterance)
                        }}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Slow (0.5x)</span>
                        <span className="font-medium">{voiceSpeed}x</span>
                        <span>Fast (2x)</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="reading-mode" className="text-gray-700 dark:text-gray-300 font-medium">
                          Reading Mode
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Optimizes layout for reading</p>
                      </div>
                    </div>
                    <Switch
                      id="reading-mode"
                      checked={readingMode}
                      onCheckedChange={(checked) => {
                        setReadingMode(checked)
                        handleSettingChange("Reading mode", checked)
                        // Apply reading mode styles
                        if (checked) {
                          document.documentElement.setAttribute("data-reading-mode", "true")
                          document.documentElement.style.lineHeight = "1.8"
                          document.documentElement.style.letterSpacing = "0.05em"
                        } else {
                          document.documentElement.removeAttribute("data-reading-mode")
                          document.documentElement.style.lineHeight = "1.5"
                          document.documentElement.style.letterSpacing = "normal"
                        }
                      }}
                      aria-label="Toggle reading mode"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent
                value="advanced"
                className="mt-6 space-y-6 flex-1 overflow-y-auto pr-2"
                style={{
                  transitionDuration: `${1 / animationSpeed}s`,
                  transitionProperty: "opacity, transform",
                }}
              >
                <div className="space-y-6">
                  <div
                    className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Compliance Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">WCAG 2.1 AA Compliance</span>
                        <Badge variant={complianceScore >= 90 ? "default" : "secondary"}>
                          {complianceScore >= 90 ? "Excellent" : complianceScore >= 70 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                      <Progress value={complianceScore} className="w-full" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {complianceScore >= 90
                          ? "Your settings exceed accessibility standards!"
                          : "Enable more accessibility features to improve compliance."}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label htmlFor="auto-save" className="text-gray-700 dark:text-gray-300 font-medium">
                          Auto-Save Settings
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save changes</p>
                      </div>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={(checked) => {
                        setAutoSave(checked)
                        handleSettingChange("Auto-save", checked)
                      }}
                      aria-label="Toggle auto-save"
                    />
                  </div>

                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-600" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Enable all accessibility features with immediate effects
                          updatePreference("highContrast", true)
                          updatePreference("largeText", true)
                          updatePreference("reducedMotion", true)
                          updatePreference("screenReaderMode", true)
                          updatePreference("keyboardNavigation", true)
                          setSoundEnabled(true)
                          setAnnouncements(true)
                          setReadingMode(true)

                          // Apply all changes immediately
                          document.documentElement.style.filter = "contrast(1.5)"
                          document.documentElement.style.fontSize = "120%"
                          document.documentElement.style.setProperty("--global-animation-duration", "0.01s")
                          document.documentElement.setAttribute("data-screen-reader", "true")
                          document.documentElement.setAttribute("data-keyboard-nav", "true")
                          document.documentElement.setAttribute("data-reading-mode", "true")
                          document.documentElement.style.lineHeight = "1.8"

                          playSound("success")
                          announceToScreenReader("All accessibility features enabled", "assertive")
                        }}
                        className="flex items-center gap-2"
                        style={{ transitionDuration: `${1 / animationSpeed}s` }}
                      >
                        <Check className="h-4 w-4" />
                        Enable All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2 bg-transparent"
                        style={{ transitionDuration: `${1 / animationSpeed}s` }}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset All
                      </Button>
                    </div>
                  </div>

                  <div
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                    style={{ transitionDuration: `${1 / animationSpeed}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Accessibility Tips</h3>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                          <li>• Use keyboard navigation (Tab, Enter, Space, Arrow keys)</li>
                          <li>• Enable high contrast for better visibility</li>
                          <li>• Turn on screen reader mode if using assistive technology</li>
                          <li>• Adjust animation speed if motion causes discomfort</li>
                          <li>• Use voice reader controls to hear page content</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <style jsx global>{`
              [data-keyboard-nav="true"] *:focus {
                outline: var(--focus-ring, 2px solid #8b5cf6) !important;
                outline-offset: 2px;
              }
              
              [data-reading-mode="true"] {
                line-height: 1.8 !important;
                letter-spacing: 0.05em !important;
              }
              
              [data-screen-reader="true"] * {
                transition-duration: var(--global-transition-duration, 0.3s) !important;
              }
              
              * {
                transition-duration: var(--global-transition-duration, 0.3s) !important;
              }
              
              @media (prefers-reduced-motion: reduce) {
                * {
                  transition-duration: 0.01s !important;
                }
              }
            `}</style>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed-settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
        >
          <Button
            ref={collapsedButtonRef}
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full bg-transparent text-white shadow-lg hover:bg-purple-700/20 hover:text-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-transparent",
              "w-12 h-12 p-0",
            )}
            onClick={() => {
              setIsOpen(!isOpen)
              playSound("toggle")
            }}
            aria-label={isOpen ? "Close settings panel" : "Open advanced settings panel"}
            aria-expanded={isOpen}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
