"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  VolumeIcon as VolumeUp,
  Volume2,
  VolumeX,
  Type,
  Maximize2,
  Minimize2,
  Settings,
  Eye,
  MousePointer,
  Underline,
  LineChart,
  Palette,
  ZoomIn,
  ZoomOut,
  Keyboard,
  PanelLeft,
  Sparkles,
  Wand2,
  Layers,
  Glasses,
  Lightbulb,
  Contrast,
  Braces,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon } from "lucide-react"

interface AccessibilityToolbarProps {
  className?: string
}

// Define color filter options for color blindness
const colorFilters = [
  { id: "none", name: "None", filter: "none" },
  { id: "protanopia", name: "Protanopia", filter: "url(#protanopia)" },
  { id: "deuteranopia", name: "Deuteranopia", filter: "url(#deuteranopia)" },
  { id: "tritanopia", name: "Tritanopia", filter: "url(#tritanopia)" },
  { id: "achromatopsia", name: "Achromatopsia", filter: "url(#achromatopsia)" },
]

// Define cursor size options
const cursorSizes = [
  { id: "normal", name: "Normal", size: "1" },
  { id: "large", name: "Large", size: "1.5" },
  { id: "xlarge", name: "Extra Large", size: "2" },
]

export default function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  // Speech synthesis states
  const [isReading, setIsReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [subtitle, setSubtitle] = useState("")
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [readingSpeed, setReadingSpeed] = useState(0.9)
  const [readingPitch, setReadingPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(false)

  // UI states
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  // Visual settings
  const [fontSize, setFontSize] = useState(1)
  const [lineHeight, setLineHeight] = useState(1)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [wordSpacing, setWordSpacing] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [colorFilter, setColorFilter] = useState("none")
  const [cursorSize, setCursorSize] = useState("normal")
  const [focusIndicator, setFocusIndicator] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [readingGuide, setReadingGuide] = useState(false)
  const [readingGuidePosition, setReadingGuidePosition] = useState({ x: 0, y: 0 })
  const [readingGuideHeight, setReadingGuideHeight] = useState(30)
  const [readingGuideColor, setReadingGuideColor] = useState("rgba(255, 255, 0, 0.2)")
  const [keyboardMode, setKeyboardMode] = useState(false)
  const [imageDescriptions, setImageDescriptions] = useState(false)
  const [simplifiedUI, setSimplifiedUI] = useState(false)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const readingGuideRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance()
      u.rate = readingSpeed
      u.pitch = readingPitch
      u.volume = volume
      setUtterance(u)

      // Handle speech events
      u.onstart = () => setIsReading(true)
      u.onend = () => {
        setIsReading(false)
        setSubtitle("")
      }
      u.onpause = () => setIsReading(false)
      u.onresume = () => setIsReading(true)
      u.onboundary = (event) => {
        if (event.name === "word" && showSubtitles) {
          const text = u.text.substring(event.charIndex, event.charIndex + event.charLength)
          setSubtitle(text)
        }
      }

      return () => {
        window.speechSynthesis.cancel()
      }
    }
  }, [showSubtitles, readingSpeed, readingPitch, volume])

  // Load saved accessibility settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("accessibilitySettings")
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)

          // Apply saved settings
          setFontSize(settings.fontSize || 1)
          setLineHeight(settings.lineHeight || 1)
          setLetterSpacing(settings.letterSpacing || 0)
          setWordSpacing(settings.wordSpacing || 0)
          setHighContrast(settings.highContrast || false)
          setColorFilter(settings.colorFilter || "none")
          setCursorSize(settings.cursorSize || "normal")
          setFocusIndicator(settings.focusIndicator || false)
          setDyslexiaFont(settings.dyslexiaFont || false)
          setReduceMotion(settings.reduceMotion || false)
          setReadingGuide(settings.readingGuide || false)
          setReadingGuideHeight(settings.readingGuideHeight || 30)
          setReadingGuideColor(settings.readingGuideColor || "rgba(255, 255, 0, 0.2)")
          setKeyboardMode(settings.keyboardMode || false)
          setImageDescriptions(settings.imageDescriptions || false)
          setSimplifiedUI(settings.simplifiedUI || false)
          setShowSubtitles(settings.showSubtitles || false)
          setReadingSpeed(settings.readingSpeed || 0.9)
          setReadingPitch(settings.readingPitch || 1)
          setVolume(settings.volume || 1)
        }
      } catch (error) {
        console.error("Error loading accessibility settings:", error)
      }
    }
  }, [])

  // Save accessibility settings
  const saveSettings = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const settings = {
          fontSize,
          lineHeight,
          letterSpacing,
          wordSpacing,
          highContrast,
          colorFilter,
          cursorSize,
          focusIndicator,
          dyslexiaFont,
          reduceMotion,
          readingGuide,
          readingGuideHeight,
          readingGuideColor,
          keyboardMode,
          imageDescriptions,
          simplifiedUI,
          showSubtitles,
          readingSpeed,
          readingPitch,
          volume,
        }
        localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
      } catch (error) {
        console.error("Error saving accessibility settings:", error)
      }
    }
  }, [
    fontSize,
    lineHeight,
    letterSpacing,
    wordSpacing,
    highContrast,
    colorFilter,
    cursorSize,
    focusIndicator,
    dyslexiaFont,
    reduceMotion,
    readingGuide,
    readingGuideHeight,
    readingGuideColor,
    keyboardMode,
    imageDescriptions,
    simplifiedUI,
    showSubtitles,
    readingSpeed,
    readingPitch,
    volume,
  ])

  // Apply font size to body
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-font-scale", fontSize.toString())
    }
  }, [fontSize])

  // Apply line height
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-line-height", lineHeight.toString())
    }
  }, [lineHeight])

  // Apply letter spacing
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-letter-spacing", `${letterSpacing}px`)
    }
  }, [letterSpacing])

  // Apply word spacing
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-word-spacing", `${wordSpacing}px`)
    }
  }, [wordSpacing])

  // Apply high contrast mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }
    }
  }, [highContrast])

  // Apply dyslexia-friendly font
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (dyslexiaFont) {
        document.documentElement.style.setProperty("--accessibility-font-family", "'OpenDyslexic', sans-serif")
        // Dynamically load the OpenDyslexic font if not already loaded
        if (!document.getElementById("dyslexic-font")) {
          const link = document.createElement("link")
          link.id = "dyslexic-font"
          link.rel = "stylesheet"
          link.href = "https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css"
          document.head.appendChild(link)
        }
      } else {
        document.documentElement.style.setProperty("--accessibility-font-family", "inherit")
      }
    }
  }, [dyslexiaFont])

  // Apply reduced motion
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (reduceMotion) {
        document.body.classList.add("reduce-motion")
      } else {
        document.body.classList.remove("reduce-motion")
      }
    }
  }, [reduceMotion])

  // Apply focus indicator
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (focusIndicator) {
        document.body.classList.add("focus-visible")
      } else {
        document.body.classList.remove("focus-visible")
      }
    }
  }, [focusIndicator])

  // Apply cursor size
  useEffect(() => {
    if (typeof document !== "undefined") {
      const size = cursorSizes.find((c) => c.id === cursorSize)?.size || "1"
      document.documentElement.style.setProperty("--accessibility-cursor-size", size)
    }
  }, [cursorSize])

  // Apply color filter
  useEffect(() => {
    if (typeof document !== "undefined") {
      const filter = colorFilters.find((f) => f.id === colorFilter)?.filter || "none"
      document.documentElement.style.setProperty("--accessibility-color-filter", filter)
    }
  }, [colorFilter])

  // Apply keyboard navigation mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (keyboardMode) {
        document.body.classList.add("keyboard-mode")
      } else {
        document.body.classList.remove("keyboard-mode")
      }
    }
  }, [keyboardMode])

  // Apply simplified UI
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (simplifiedUI) {
        document.body.classList.add("simplified-ui")
      } else {
        document.body.classList.remove("simplified-ui")
      }
    }
  }, [simplifiedUI])

  // Apply image descriptions
  useEffect(() => {
    if (typeof document !== "undefined" && imageDescriptions) {
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
  }, [imageDescriptions])

  // Reading guide mouse tracking
  useEffect(() => {
    if (typeof document !== "undefined" && readingGuide) {
      const handleMouseMove = (e: MouseEvent) => {
        setReadingGuidePosition({ x: e.clientX, y: e.clientY })
      }

      document.addEventListener("mousemove", handleMouseMove)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [readingGuide])

  // Update volume whenever it changes
  useEffect(() => {
    if (utterance) {
      utterance.volume = volume

      // If volume is set to 0, pause the speech
      if (volume === 0 && isReading) {
        window.speechSynthesis.pause()
        setIsMuted(true)
      } else if (volume > 0 && isMuted && isReading) {
        // If coming back from volume 0, resume the speech
        window.speechSynthesis.resume()
        setIsMuted(false)
      }
    }
  }, [volume, utterance, isReading, isMuted])

  // Save settings when they change
  useEffect(() => {
    saveSettings()
  }, [
    fontSize,
    lineHeight,
    letterSpacing,
    wordSpacing,
    highContrast,
    colorFilter,
    cursorSize,
    focusIndicator,
    dyslexiaFont,
    reduceMotion,
    readingGuide,
    readingGuideHeight,
    readingGuideColor,
    keyboardMode,
    imageDescriptions,
    simplifiedUI,
    showSubtitles,
    readingSpeed,
    readingPitch,
    volume,
    saveSettings,
  ])

  const readPage = () => {
    if (!utterance || !window.speechSynthesis) return

    // If already reading, stop
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setSubtitle("")
      return
    }

    // Get all visible text from the page
    const textContent = document.body.innerText
    utterance.text = textContent
    utterance.rate = readingSpeed
    utterance.pitch = readingPitch
    utterance.volume = volume

    // Start reading
    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    if (!utterance) return

    if (isMuted) {
      // Restore previous volume
      setVolume(prevVolume)
      utterance.volume = prevVolume
      if (isReading) {
        window.speechSynthesis.resume()
      }
    } else {
      // Store current volume and mute
      setPrevVolume(volume)
      setVolume(0)
      utterance.volume = 0
      if (isReading) {
        window.speechSynthesis.pause()
      }
    }

    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]

    // If new volume is 0, set to muted
    if (newVolume === 0) {
      if (!isMuted) {
        setPrevVolume(volume) // Remember previous volume
        setIsMuted(true)
        if (isReading) {
          window.speechSynthesis.pause()
        }
      }
    } else {
      // If coming from 0, unmute
      if (isMuted) {
        setIsMuted(false)
        if (isReading) {
          window.speechSynthesis.resume()
        }
      }
    }

    setVolume(newVolume)
    if (utterance) {
      utterance.volume = newVolume
    }
  }

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize((prev) => Math.min(prev + 0.1, 1.5))
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize((prev) => Math.max(prev - 0.1, 0.8))
    }
  }

  const handleReadingSpeedChange = (value: number[]) => {
    const newSpeed = value[0]
    setReadingSpeed(newSpeed)
    if (utterance) {
      utterance.rate = newSpeed
    }
  }

  const handlePitchChange = (value: number[]) => {
    const newPitch = value[0]
    setReadingPitch(newPitch)
    if (utterance) {
      utterance.pitch = newPitch
    }
  }

  const resetAllSettings = () => {
    setFontSize(1)
    setLineHeight(1)
    setLetterSpacing(0)
    setWordSpacing(0)
    setHighContrast(false)
    setColorFilter("none")
    setCursorSize("normal")
    setFocusIndicator(false)
    setDyslexiaFont(false)
    setReduceMotion(false)
    setReadingGuide(false)
    setKeyboardMode(false)
    setImageDescriptions(false)
    setSimplifiedUI(false)
    setShowSubtitles(false)
    setReadingSpeed(0.9)
    setReadingPitch(1)
    setVolume(1)
    setIsMuted(false)
  }

  return (
    <>
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

      {/* Reading Guide */}
      {readingGuide && (
        <div
          ref={readingGuideRef}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: 0,
            top: readingGuidePosition.y - readingGuideHeight / 2,
            width: "100%",
            height: `${readingGuideHeight}px`,
            backgroundColor: readingGuideColor,
          }}
          aria-hidden="true"
        />
      )}

      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <TooltipProvider>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Accessibility Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh] overflow-y-auto">
                <div className="mx-auto w-full max-w-4xl">
                  <DrawerHeader>
                    <DrawerTitle>Accessibility Settings</DrawerTitle>
                    <DrawerDescription>
                      Customize your experience to make this site more accessible for your needs.
                    </DrawerDescription>
                  </DrawerHeader>

                  <Tabs defaultValue="text" className="w-full px-4" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-4">
                      <TabsTrigger value="text" className="flex items-center gap-1">
                        <Type className="h-4 w-4" />
                        <span className="hidden md:inline">Text</span>
                      </TabsTrigger>
                      <TabsTrigger value="visual" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="hidden md:inline">Visual</span>
                      </TabsTrigger>
                      <TabsTrigger value="reading" className="flex items-center gap-1">
                        <LineChart className="h-4 w-4" />
                        <span className="hidden md:inline">Reading</span>
                      </TabsTrigger>
                      <TabsTrigger value="audio" className="flex items-center gap-1">
                        <Volume2 className="h-4 w-4" />
                        <span className="hidden md:inline">Audio</span>
                      </TabsTrigger>
                      <TabsTrigger value="input" className="flex items-center gap-1">
                        <MousePointer className="h-4 w-4" />
                        <span className="hidden md:inline">Input</span>
                      </TabsTrigger>
                      <TabsTrigger value="advanced" className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden md:inline">Advanced</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Text Settings */}
                    <TabsContent value="text" className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Type className="h-4 w-4" /> Text Size
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={decreaseFontSize}
                            aria-label="Decrease font size"
                          >
                            <Minimize2 className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[fontSize * 100]}
                            min={80}
                            max={150}
                            step={5}
                            onValueChange={(value) => setFontSize(value[0] / 100)}
                            className="flex-1"
                            aria-label="Font size"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseFontSize}
                            aria-label="Increase font size"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Current: {Math.round(fontSize * 100)}%</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <LineChart className="h-4 w-4" /> Line Height
                        </h3>
                        <Slider
                          value={[lineHeight * 100]}
                          min={100}
                          max={200}
                          step={10}
                          onValueChange={(value) => setLineHeight(value[0] / 100)}
                          aria-label="Line height"
                        />
                        <p className="text-xs text-muted-foreground">Current: {Math.round(lineHeight * 100)}%</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Braces className="h-4 w-4" /> Letter Spacing
                        </h3>
                        <Slider
                          value={[letterSpacing]}
                          min={0}
                          max={5}
                          step={0.5}
                          onValueChange={(value) => setLetterSpacing(value[0])}
                          aria-label="Letter spacing"
                        />
                        <p className="text-xs text-muted-foreground">Current: {letterSpacing}px</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <PanelLeft className="h-4 w-4" /> Word Spacing
                        </h3>
                        <Slider
                          value={[wordSpacing]}
                          min={0}
                          max={10}
                          step={1}
                          onValueChange={(value) => setWordSpacing(value[0])}
                          aria-label="Word spacing"
                        />
                        <p className="text-xs text-muted-foreground">Current: {wordSpacing}px</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dyslexia-font" className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4" /> Dyslexia-Friendly Font
                          </Label>
                          <p className="text-xs text-muted-foreground">Use OpenDyslexic font to improve readability</p>
                        </div>
                        <Switch id="dyslexia-font" checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
                      </div>
                    </TabsContent>

                    {/* Visual Settings */}
                    <TabsContent value="visual" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="high-contrast" className="flex items-center gap-2">
                            <Contrast className="h-4 w-4" /> High Contrast
                          </Label>
                          <p className="text-xs text-muted-foreground">Increase text and background contrast</p>
                        </div>
                        <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dark-mode" className="flex items-center gap-2">
                            <Moon className="h-4 w-4" /> Dark Mode
                          </Label>
                          <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                        </div>
                        <Switch
                          id="dark-mode"
                          checked={theme === "dark"}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Glasses className="h-4 w-4" /> Color Filter
                        </h3>
                        <Select value={colorFilter} onValueChange={setColorFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a color filter" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorFilters.map((filter) => (
                              <SelectItem key={filter.id} value={filter.id}>
                                {filter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Simulates different types of color blindness</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reduce-motion" className="flex items-center gap-2">
                            <Layers className="h-4 w-4" /> Reduce Motion
                          </Label>
                          <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                        <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="simplified-ui" className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" /> Simplified UI
                          </Label>
                          <p className="text-xs text-muted-foreground">Reduce visual complexity</p>
                        </div>
                        <Switch id="simplified-ui" checked={simplifiedUI} onCheckedChange={setSimplifiedUI} />
                      </div>
                    </TabsContent>

                    {/* Reading Settings */}
                    <TabsContent value="reading" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reading-guide" className="flex items-center gap-2">
                            <Underline className="h-4 w-4" /> Reading Guide
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Show a horizontal guide that follows your cursor
                          </p>
                        </div>
                        <Switch id="reading-guide" checked={readingGuide} onCheckedChange={setReadingGuide} />
                      </div>

                      {readingGuide && (
                        <>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Guide Height</h3>
                            <Slider
                              value={[readingGuideHeight]}
                              min={10}
                              max={60}
                              step={5}
                              onValueChange={(value) => setReadingGuideHeight(value[0])}
                              aria-label="Reading guide height"
                            />
                            <p className="text-xs text-muted-foreground">Current: {readingGuideHeight}px</p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Guide Color</h3>
                            <div className="grid grid-cols-5 gap-2">
                              {[
                                "rgba(255, 255, 0, 0.2)",
                                "rgba(0, 255, 255, 0.2)",
                                "rgba(255, 0, 255, 0.2)",
                                "rgba(0, 255, 0, 0.2)",
                                "rgba(255, 0, 0, 0.2)",
                              ].map((color) => (
                                <button
                                  key={color}
                                  className={cn(
                                    "w-full h-8 rounded-md border",
                                    readingGuideColor === color ? "ring-2 ring-primary" : "",
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setReadingGuideColor(color)}
                                  aria-label={`Set guide color to ${color}`}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="image-descriptions" className="flex items-center gap-2">
                            <Palette className="h-4 w-4" /> Image Descriptions
                          </Label>
                          <p className="text-xs text-muted-foreground">Enhance image alt text for screen readers</p>
                        </div>
                        <Switch
                          id="image-descriptions"
                          checked={imageDescriptions}
                          onCheckedChange={setImageDescriptions}
                        />
                      </div>
                    </TabsContent>

                    {/* Audio Settings */}
                    <TabsContent value="audio" className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Volume2 className="h-4 w-4" /> Volume
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleMute}
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Slider
                            value={[volume]}
                            min={0}
                            max={1}
                            step={0.05}
                            onValueChange={handleVolumeChange}
                            className="flex-1"
                            aria-label="Volume"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Volume: {Math.round(volume * 100)}%</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <ZoomIn className="h-4 w-4" /> Reading Speed
                        </h3>
                        <Slider
                          value={[readingSpeed]}
                          min={0.5}
                          max={2}
                          step={0.1}
                          onValueChange={handleReadingSpeedChange}
                          aria-label="Reading speed"
                        />
                        <p className="text-xs text-muted-foreground">
                          {readingSpeed < 1 ? "Slower" : readingSpeed > 1 ? "Faster" : "Normal"} (
                          {readingSpeed.toFixed(1)}x)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <ZoomOut className="h-4 w-4" /> Voice Pitch
                        </h3>
                        <Slider
                          value={[readingPitch]}
                          min={0.5}
                          max={2}
                          step={0.1}
                          onValueChange={handlePitchChange}
                          aria-label="Voice pitch"
                        />
                        <p className="text-xs text-muted-foreground">
                          {readingPitch < 1 ? "Lower" : readingPitch > 1 ? "Higher" : "Normal"} (
                          {readingPitch.toFixed(1)})
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-subtitles" className="flex items-center gap-2">
                            <Type className="h-4 w-4" /> Show Subtitles
                          </Label>
                          <p className="text-xs text-muted-foreground">Display text being read aloud</p>
                        </div>
                        <Switch id="show-subtitles" checked={showSubtitles} onCheckedChange={setShowSubtitles} />
                      </div>
                    </TabsContent>

                    {/* Input Settings */}
                    <TabsContent value="input" className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <MousePointer className="h-4 w-4" /> Cursor Size
                        </h3>
                        <Select value={cursorSize} onValueChange={setCursorSize}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select cursor size" />
                          </SelectTrigger>
                          <SelectContent>
                            {cursorSizes.map((size) => (
                              <SelectItem key={size.id} value={size.id}>
                                {size.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Adjust the size of your cursor</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="focus-indicator" className="flex items-center gap-2">
                            <Underline className="h-4 w-4" /> Focus Indicator
                          </Label>
                          <p className="text-xs text-muted-foreground">Highlight focused elements more prominently</p>
                        </div>
                        <Switch id="focus-indicator" checked={focusIndicator} onCheckedChange={setFocusIndicator} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="keyboard-mode" className="flex items-center gap-2">
                            <Keyboard className="h-4 w-4" /> Keyboard Navigation
                          </Label>
                          <p className="text-xs text-muted-foreground">Optimize for keyboard-only navigation</p>
                        </div>
                        <Switch id="keyboard-mode" checked={keyboardMode} onCheckedChange={setKeyboardMode} />
                      </div>
                    </TabsContent>

                    {/* Advanced Settings */}
                    <TabsContent value="advanced" className="space-y-6">
                      <div className="p-4 border rounded-md bg-muted/50">
                        <h3 className="text-sm font-medium mb-2">Reset All Settings</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          This will reset all accessibility settings to their default values.
                        </p>
                        <Button variant="destructive" onClick={resetAllSettings} className="w-full">
                          Reset All Settings
                        </Button>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Toggle Screen Reader:</span>
                            <kbd className="px-2 py-1 bg-muted rounded">Alt + R</kbd>
                          </div>
                          <div className="flex justify-between">
                            <span>Increase Font Size:</span>
                            <kbd className="px-2 py-1 bg-muted rounded">Alt + +</kbd>
                          </div>
                          <div className="flex justify-between">
                            <span>Decrease Font Size:</span>
                            <kbd className="px-2 py-1 bg-muted rounded">Alt + -</kbd>
                          </div>
                          <div className="flex justify-between">
                            <span>Toggle High Contrast:</span>
                            <kbd className="px-2 py-1 bg-muted rounded">Alt + C</kbd>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DrawerFooter>
                    <Button onClick={() => setIsDrawerOpen(false)}>Save Changes</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={readPage}
                  className={isReading ? "bg-primary text-primary-foreground" : ""}
                  aria-label={isReading ? "Stop Reading" : "Read Page Aloud"}
                >
                  {isReading ? <Volume2 className="h-4 w-4" /> : <VolumeUp className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isReading ? "Stop Reading" : "Read Page Aloud"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  disabled={!isReading}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={showSubtitles ? "bg-primary text-primary-foreground" : ""}
                  aria-label={showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{showSubtitles ? "Hide Subtitles" : "Show Subtitles"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={increaseFontSize} aria-label="Increase Font Size">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Increase Font Size</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={decreaseFontSize} aria-label="Decrease Font Size">
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Decrease Font Size</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Subtitle display */}
      {showSubtitles && isReading && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg text-lg max-w-2xl text-center z-[100]">
          {subtitle || "..."}
        </div>
      )}

      {/* Add global styles for accessibility features */}
      <style jsx global>{`
        :root {
          --accessibility-font-family: inherit;
          --accessibility-cursor-size: 1;
          --accessibility-color-filter: none;
          --accessibility-line-height: 1;
          --accessibility-letter-spacing: 0px;
          --accessibility-word-spacing: 0px;
        }
        
        body {
          font-family: var(--accessibility-font-family);
          line-height: var(--accessibility-line-height);
          letter-spacing: var(--accessibility-letter-spacing);
          word-spacing: var(--accessibility-word-spacing);
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
        
        html, body {
          filter: var(--accessibility-color-filter);
        }
        
        * {
          cursor: default;
        }
        
        a, button, [role="button"], input, select, textarea {
          cursor: pointer;
        }
        
        a, button, [role="button"] {
          transform: scale(var(--accessibility-cursor-size));
        }
      `}</style>
    </>
  )
}
