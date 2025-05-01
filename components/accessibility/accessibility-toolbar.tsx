"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAccessibility } from "./accessibility-provider"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Type,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  MousePointer,
  Underline,
  LineChart,
  Palette,
  ZoomIn,
  ZoomOut,
  Keyboard,
  Sparkles,
  Layers,
  Glasses,
  Lightbulb,
  Contrast,
  Braces,
  Moon,
  Sun,
  Save,
  Folder,
  Trash2,
  HelpCircle,
  Code,
  Video,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  Mic,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilityToolbarProps {
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "right" | "left"
  expanded?: boolean
}

export default function AccessibilityToolbar({
  className,
  position = "bottom-right",
  expanded = false,
}: AccessibilityToolbarProps) {
  const {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    isReading,
    startReading,
    stopReading,
    pauseReading,
    resumeReading,
    availableVoices,
    savePreset,
    loadPreset,
    availablePresets,
    deletePreset,
  } = useAccessibility()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [presetName, setPresetName] = useState("")
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false)
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)
  const [isVoiceRecognitionActive, setIsVoiceRecognitionActive] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    right: "top-1/2 -translate-y-1/2 right-4",
    left: "top-1/2 -translate-y-1/2 left-4",
  }

  // Initialize speech recognition if available
  useEffect(() => {
    let SpeechRecognition: any = null
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("")

          // Process voice commands
          processVoiceCommand(transcript.toLowerCase())
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsVoiceRecognitionActive(false)
        }

        recognitionRef.current.onend = () => {
          setIsVoiceRecognitionActive(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Process voice commands
  const processVoiceCommand = useCallback(
    (command: string) => {
      // Simple command processing
      if (command.includes("increase font") || command.includes("bigger text")) {
        updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 2))
      } else if (command.includes("decrease font") || command.includes("smaller text")) {
        updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.5))
      } else if (command.includes("dark mode") || command.includes("night mode")) {
        updateSetting("darkMode", true)
      } else if (command.includes("light mode") || command.includes("day mode")) {
        updateSetting("darkMode", false)
      } else if (command.includes("high contrast")) {
        updateSetting("highContrast", !settings.highContrast)
      } else if (command.includes("read page") || command.includes("start reading")) {
        startReading()
      } else if (command.includes("stop reading")) {
        stopReading()
      } else if (command.includes("open settings")) {
        setIsDrawerOpen(true)
      } else if (command.includes("close settings")) {
        setIsDrawerOpen(false)
      }
    },
    [settings.fontSize, settings.highContrast, startReading, stopReading, updateSetting],
  )

  // Toggle voice recognition
  const toggleVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      if (isVoiceRecognitionActive) {
        recognitionRef.current.stop()
        setIsVoiceRecognitionActive(false)
      } else {
        recognitionRef.current.start()
        setIsVoiceRecognitionActive(true)
      }
    }
  }, [isVoiceRecognitionActive])

  // Toggle screen reader
  const toggleScreenReader = useCallback(() => {
    if (isReading) {
      stopReading()
    } else {
      startReading()
    }
  }, [isReading, startReading, stopReading])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (settings.speechVolume === 0) {
      updateSetting("speechVolume", 1)
      if (isReading) {
        resumeReading()
      }
    } else {
      updateSetting("speechVolume", 0)
      if (isReading) {
        pauseReading()
      }
    }
  }, [isReading, pauseReading, resumeReading, settings.speechVolume, updateSetting])

  // Increase font size
  const increaseFontSize = useCallback(() => {
    if (settings.fontSize < 2) {
      updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 2))
    }
  }, [settings.fontSize, updateSetting])

  // Decrease font size
  const decreaseFontSize = useCallback(() => {
    if (settings.fontSize > 0.5) {
      updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.5))
    }
  }, [settings.fontSize, updateSetting])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    updateSetting("darkMode", !settings.darkMode)
  }, [settings.darkMode, updateSetting])

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    updateSetting("highContrast", !settings.highContrast)
  }, [settings.highContrast, updateSetting])

  // Toggle reading guide
  const toggleReadingGuide = useCallback(() => {
    updateSetting("readingGuide", !settings.readingGuide)
  }, [settings.readingGuide, updateSetting])

  // Save current settings as preset
  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      savePreset(presetName.trim())
      setPresetName("")
      setIsPresetDialogOpen(false)
    }
  }, [presetName, savePreset])

  // Keyboard event handler for accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if Alt key is pressed
      if (e.altKey) {
        switch (e.key) {
          case "r":
            e.preventDefault()
            toggleScreenReader()
            break
          case "+":
            e.preventDefault()
            increaseFontSize()
            break
          case "-":
            e.preventDefault()
            decreaseFontSize()
            break
          case "c":
            e.preventDefault()
            toggleHighContrast()
            break
          case "d":
            e.preventDefault()
            toggleDarkMode()
            break
          case "g":
            e.preventDefault()
            toggleReadingGuide()
            break
          case "s":
            e.preventDefault()
            setIsDrawerOpen(true)
            break
          case "v":
            e.preventDefault()
            toggleVoiceRecognition()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    toggleScreenReader,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleDarkMode,
    toggleReadingGuide,
    toggleVoiceRecognition,
  ])

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <TooltipProvider>
        <div
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2",
            isExpanded ? "flex flex-col gap-2" : "flex flex-row gap-2",
          )}
        >
          {/* Settings button and drawer */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Accessibility Settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Accessibility Settings</span>
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
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
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
                          value={[settings.fontSize * 100]}
                          min={50}
                          max={200}
                          step={5}
                          onValueChange={(value) => updateSetting("fontSize", value[0] / 100)}
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
                      <p className="text-xs text-muted-foreground">Current: {Math.round(settings.fontSize * 100)}%</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <LineChart className="h-4 w-4" /> Line Height
                      </h3>
                      <Slider
                        value={[settings.lineHeight * 100]}
                        min={100}
                        max={300}
                        step={10}
                        onValueChange={(value) => updateSetting("lineHeight", value[0] / 100)}
                        aria-label="Line height"
                      />
                      <p className="text-xs text-muted-foreground">Current: {Math.round(settings.lineHeight * 100)}%</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Braces className="h-4 w-4" /> Letter Spacing
                      </h3>
                      <Slider
                        value={[settings.letterSpacing]}
                        min={-2}
                        max={10}
                        step={0.5}
                        onValueChange={(value) => updateSetting("letterSpacing", value[0])}
                        aria-label="Letter spacing"
                      />
                      <p className="text-xs text-muted-foreground">Current: {settings.letterSpacing}px</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" /> Font Family
                      </h3>
                      <Select value={settings.fontFamily} onValueChange={(value) => updateSetting("fontFamily", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-ui">System Default</SelectItem>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="sans-serif">Sans-serif</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                          <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {settings.fontFamily === "dyslexic"
                          ? "OpenDyslexic font helps with reading difficulties"
                          : `Using ${settings.fontFamily} font`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" /> Font Weight
                      </h3>
                      <RadioGroup
                        value={settings.fontWeight}
                        onValueChange={(value) => updateSetting("fontWeight", value as "normal" | "medium" | "bold")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="font-normal" />
                          <Label htmlFor="font-normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="font-medium" />
                          <Label htmlFor="font-medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bold" id="font-bold" />
                          <Label htmlFor="font-bold">Bold</Label>
                        </div>
                      </RadioGroup>
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
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode" className="flex items-center gap-2">
                          <Moon className="h-4 w-4" /> Dark Mode
                        </Label>
                        <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                      </div>
                      <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Glasses className="h-4 w-4" /> Color Filter
                      </h3>
                      <Select
                        value={settings.colorFilter}
                        onValueChange={(value) => updateSetting("colorFilter", value as any)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a color filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                          <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                          <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                          <SelectItem value="achromatopsia">Achromatopsia (Monochrome)</SelectItem>
                          <SelectItem value="custom">Custom Filter</SelectItem>
                        </SelectContent>
                      </Select>

                      {settings.colorFilter === "custom" && (
                        <div className="mt-2 space-y-2">
                          <Label htmlFor="custom-filter">Custom Filter Matrix</Label>
                          <Textarea
                            id="custom-filter"
                            value={settings.customColorFilter}
                            onChange={(e) => updateSetting("customColorFilter", e.target.value)}
                            placeholder="Enter SVG color matrix values"
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter SVG feColorMatrix values (e.g., "1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 1 0")
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {settings.colorFilter === "none"
                          ? "No color filter applied"
                          : settings.colorFilter === "custom"
                            ? "Using custom color filter"
                            : `Simulating ${settings.colorFilter} color blindness`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-motion" className="flex items-center gap-2">
                          <Layers className="h-4 w-4" /> Reduce Motion
                        </Label>
                        <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        id="reduce-motion"
                        checked={settings.reduceMotion}
                        onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-transparency" className="flex items-center gap-2">
                          <Layers className="h-4 w-4" /> Reduce Transparency
                        </Label>
                        <p className="text-xs text-muted-foreground">Increase opacity of transparent elements</p>
                      </div>
                      <Switch
                        id="reduce-transparency"
                        checked={settings.reduceTransparency}
                        onCheckedChange={(checked) => updateSetting("reduceTransparency", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="simplified-ui" className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" /> Simplified UI
                        </Label>
                        <p className="text-xs text-muted-foreground">Reduce visual complexity</p>
                      </div>
                      <Switch
                        id="simplified-ui"
                        checked={settings.simplifiedUI}
                        onCheckedChange={(checked) => updateSetting("simplifiedUI", checked)}
                      />
                    </div>
                  </TabsContent>

                  {/* Reading Settings */}
                  <TabsContent value="reading" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reading-guide" className="flex items-center gap-2">
                          <Underline className="h-4 w-4" /> Reading Guide
                        </Label>
                        <p className="text-xs text-muted-foreground">Show a horizontal guide to help with reading</p>
                      </div>
                      <Switch
                        id="reading-guide"
                        checked={settings.readingGuide}
                        onCheckedChange={(checked) => updateSetting("readingGuide", checked)}
                      />
                    </div>

                    {settings.readingGuide && (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Guide Position</h3>
                          <RadioGroup
                            value={settings.readingGuidePosition}
                            onValueChange={(value) =>
                              updateSetting("readingGuidePosition", value as "fixed" | "follow")
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixed" id="guide-fixed" />
                              <Label htmlFor="guide-fixed">Fixed in center</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="follow" id="guide-follow" />
                              <Label htmlFor="guide-follow">Follow cursor</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Guide Height</h3>
                          <Slider
                            value={[settings.readingGuideHeight]}
                            min={10}
                            max={60}
                            step={5}
                            onValueChange={(value) => updateSetting("readingGuideHeight", value[0])}
                            aria-label="Reading guide height"
                          />
                          <p className="text-xs text-muted-foreground">Current: {settings.readingGuideHeight}px</p>
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
                                  settings.readingGuideColor === color ? "ring-2 ring-primary" : "",
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => updateSetting("readingGuideColor", color)}
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
                          <ImageIcon className="h-4 w-4" /> Image Descriptions
                        </Label>
                        <p className="text-xs text-muted-foreground">Enhance image alt text for screen readers</p>
                      </div>
                      <Switch
                        id="image-descriptions"
                        checked={settings.imageDescriptions}
                        onCheckedChange={(checked) => updateSetting("imageDescriptions", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoplay-videos" className="flex items-center gap-2">
                          <Video className="h-4 w-4" /> Autoplay Videos
                        </Label>
                        <p className="text-xs text-muted-foreground">Allow videos to play automatically</p>
                      </div>
                      <Switch
                        id="autoplay-videos"
                        checked={settings.autoplayVideos}
                        onCheckedChange={(checked) => updateSetting("autoplayVideos", checked)}
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
                          aria-label={settings.speechVolume === 0 ? "Unmute" : "Mute"}
                        >
                          {settings.speechVolume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Slider
                          value={[settings.speechVolume * 100]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => updateSetting("speechVolume", value[0] / 100)}
                          className="flex-1"
                          aria-label="Volume"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Volume: {Math.round(settings.speechVolume * 100)}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <ZoomIn className="h-4 w-4" /> Reading Speed
                      </h3>
                      <Slider
                        value={[settings.speechRate * 100]}
                        min={50}
                        max={200}
                        step={10}
                        onValueChange={(value) => updateSetting("speechRate", value[0] / 100)}
                        aria-label="Reading speed"
                      />
                      <p className="text-xs text-muted-foreground">
                        {settings.speechRate < 1 ? "Slower" : settings.speechRate > 1 ? "Faster" : "Normal"} (
                        {settings.speechRate.toFixed(1)}x)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <ZoomOut className="h-4 w-4" /> Voice Pitch
                      </h3>
                      <Slider
                        value={[settings.speechPitch * 100]}
                        min={50}
                        max={200}
                        step={10}
                        onValueChange={(value) => updateSetting("speechPitch", value[0] / 100)}
                        aria-label="Voice pitch"
                      />
                      <p className="text-xs text-muted-foreground">
                        {settings.speechPitch < 1 ? "Lower" : settings.speechPitch > 1 ? "Higher" : "Normal"} (
                        {settings.speechPitch.toFixed(1)})
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Headphones className="h-4 w-4" /> Voice Selection
                      </h3>
                      <Select
                        value={settings.speechVoice}
                        onValueChange={(value) => updateSetting("speechVoice", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Voice</SelectItem>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {settings.speechVoice === "default"
                          ? "Using system default voice"
                          : `Using ${settings.speechVoice}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-captions" className="flex items-center gap-2">
                          <Type className="h-4 w-4" /> Show Captions
                        </Label>
                        <p className="text-xs text-muted-foreground">Display text being read aloud</p>
                      </div>
                      <Switch
                        id="show-captions"
                        checked={settings.showCaptions}
                        onCheckedChange={(checked) => updateSetting("showCaptions", checked)}
                      />
                    </div>

                    {settings.showCaptions && (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Caption Size</h3>
                          <Slider
                            value={[settings.captionSize * 100]}
                            min={50}
                            max={200}
                            step={10}
                            onValueChange={(value) => updateSetting("captionSize", value[0] / 100)}
                            aria-label="Caption size"
                          />
                          <p className="text-xs text-muted-foreground">
                            Size: {Math.round(settings.captionSize * 100)}%
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Caption Background</h3>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              "rgba(0, 0, 0, 0.8)",
                              "rgba(0, 0, 0, 0.5)",
                              "rgba(0, 0, 255, 0.5)",
                              "rgba(255, 255, 255, 0.8)",
                              "rgba(255, 0, 0, 0.5)",
                            ].map((color) => (
                              <button
                                key={color}
                                className={cn(
                                  "w-full h-8 rounded-md border",
                                  settings.captionBackground === color ? "ring-2 ring-primary" : "",
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => updateSetting("captionBackground", color)}
                                aria-label={`Set caption background to ${color}`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="voice-recognition" className="flex items-center gap-2">
                          <Mic className="h-4 w-4" /> Voice Recognition
                        </Label>
                        <p className="text-xs text-muted-foreground">Control settings with voice commands</p>
                      </div>
                      <Switch
                        id="voice-recognition"
                        checked={isVoiceRecognitionActive}
                        onCheckedChange={toggleVoiceRecognition}
                        disabled={!recognitionRef.current}
                      />
                    </div>

                    {isVoiceRecognitionActive && (
                      <div className="p-4 border rounded-md bg-muted/50">
                        <h3 className="text-sm font-medium mb-2">Voice Commands</h3>
                        <p className="text-xs text-muted-foreground mb-2">Try saying these commands:</p>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          <li>"Increase font" or "Bigger text"</li>
                          <li>"Decrease font" or "Smaller text"</li>
                          <li>"Dark mode" or "Light mode"</li>
                          <li>"High contrast"</li>
                          <li>"Read page" or "Start reading"</li>
                          <li>"Stop reading"</li>
                          <li>"Open settings" or "Close settings"</li>
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  {/* Input Settings */}
                  <TabsContent value="input" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <MousePointer className="h-4 w-4" /> Cursor Size
                      </h3>
                      <Select
                        value={settings.cursorSize}
                        onValueChange={(value) => updateSetting("cursorSize", value as any)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select cursor size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xlarge">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Adjust the size of your cursor</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Cursor Color
                      </h3>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          "#0000ff", // Blue
                          "#ff0000", // Red
                          "#00ff00", // Green
                          "#ffff00", // Yellow
                          "#ff00ff", // Magenta
                        ].map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "w-full h-8 rounded-md border",
                              settings.cursorColor === color ? "ring-2 ring-primary" : "",
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => updateSetting("cursorColor", color)}
                            aria-label={`Set cursor color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="focus-indicator" className="flex items-center gap-2">
                          <Underline className="h-4 w-4" /> Focus Indicator
                        </Label>
                        <p className="text-xs text-muted-foreground">Highlight focused elements more prominently</p>
                      </div>
                      <Switch
                        id="focus-indicator"
                        checked={settings.focusIndicator}
                        onCheckedChange={(checked) => updateSetting("focusIndicator", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="keyboard-mode" className="flex items-center gap-2">
                          <Keyboard className="h-4 w-4" /> Keyboard Navigation
                        </Label>
                        <p className="text-xs text-muted-foreground">Optimize for keyboard-only navigation</p>
                      </div>
                      <Switch
                        id="keyboard-mode"
                        checked={settings.keyboardMode}
                        onCheckedChange={(checked) => updateSetting("keyboardMode", checked)}
                      />
                    </div>
                  </TabsContent>

                  {/* Advanced Settings */}
                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Save className="h-4 w-4" /> Save Settings Preset
                      </h3>
                      <Button variant="outline" onClick={() => setIsPresetDialogOpen(true)} className="w-full">
                        Save Current Settings as Preset
                      </Button>
                    </div>

                    {availablePresets.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Folder className="h-4 w-4" /> Load Settings Preset
                        </h3>
                        <ScrollArea className="h-32 rounded-md border">
                          <div className="p-4 space-y-2">
                            {availablePresets.map((preset) => (
                              <div key={preset} className="flex items-center justify-between">
                                <span className="text-sm">{preset}</span>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => loadPreset(preset)}>
                                    Load
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deletePreset(preset)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" /> Custom CSS
                      </h3>
                      <Textarea
                        value={settings.customCSS}
                        onChange={(e) => updateSetting("customCSS", e.target.value)}
                        placeholder="Enter custom CSS rules"
                        className="font-mono text-xs h-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Add custom CSS rules to further customize the appearance
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="force-colors" className="flex items-center gap-2">
                          <Palette className="h-4 w-4" /> Force Colors
                        </Label>
                        <p className="text-xs text-muted-foreground">Override website colors with system colors</p>
                      </div>
                      <Switch
                        id="force-colors"
                        checked={settings.forceColors}
                        onCheckedChange={(checked) => updateSetting("forceColors", checked)}
                      />
                    </div>

                    <div className="p-4 border rounded-md bg-muted/50">
                      <h3 className="text-sm font-medium mb-2">Reset All Settings</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        This will reset all accessibility settings to their default values.
                      </p>
                      <Button variant="destructive" onClick={resetSettings} className="w-full">
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
                        <div className="flex justify-between">
                          <span>Toggle Dark Mode:</span>
                          <kbd className="px-2 py-1 bg-muted rounded">Alt + D</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Toggle Reading Guide:</span>
                          <kbd className="px-2 py-1 bg-muted rounded">Alt + G</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Open Settings:</span>
                          <kbd className="px-2 py-1 bg-muted rounded">Alt + S</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Toggle Voice Recognition:</span>
                          <kbd className="px-2 py-1 bg-muted rounded">Alt + V</kbd>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" /> Help & Documentation
                      </h3>
                      <Button variant="outline" onClick={() => setIsHelpDialogOpen(true)} className="w-full">
                        View Accessibility Help
                      </Button>
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

          {/* Quick access toolbar buttons */}
          {isExpanded ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleScreenReader}
                    className={isReading ? "bg-primary text-primary-foreground" : ""}
                    aria-label={isReading ? "Stop Reading" : "Read Page Aloud"}
                  >
                    {isReading ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                    aria-label={settings.speechVolume === 0 ? "Unmute" : "Mute"}
                  >
                    {settings.speechVolume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{settings.speechVolume === 0 ? "Unmute" : "Mute"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateSetting("showCaptions", !settings.showCaptions)}
                    className={settings.showCaptions ? "bg-primary text-primary-foreground" : ""}
                    aria-label={settings.showCaptions ? "Hide Captions" : "Show Captions"}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{settings.showCaptions ? "Hide Captions" : "Show Captions"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={increaseFontSize} aria-label="Increase Font Size">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Increase Font Size</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={decreaseFontSize} aria-label="Decrease Font Size">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Decrease Font Size</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDarkMode}
                    className={settings.darkMode ? "bg-primary text-primary-foreground" : ""}
                    aria-label={settings.darkMode ? "Light Mode" : "Dark Mode"}
                  >
                    {settings.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{settings.darkMode ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleHighContrast}
                    className={settings.highContrast ? "bg-primary text-primary-foreground" : ""}
                    aria-label={settings.highContrast ? "Normal Contrast" : "High Contrast"}
                  >
                    <Contrast className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{settings.highContrast ? "Normal Contrast" : "High Contrast"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleReadingGuide}
                    className={settings.readingGuide ? "bg-primary text-primary-foreground" : ""}
                    aria-label={settings.readingGuide ? "Hide Reading Guide" : "Show Reading Guide"}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{settings.readingGuide ? "Hide Reading Guide" : "Show Reading Guide"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVoiceRecognition}
                    className={isVoiceRecognitionActive ? "bg-primary text-primary-foreground" : ""}
                    aria-label={isVoiceRecognitionActive ? "Disable Voice Commands" : "Enable Voice Commands"}
                    disabled={!recognitionRef.current}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isVoiceRecognitionActive ? "Disable Voice Commands" : "Enable Voice Commands"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Collapse Toolbar"
                  >
                    {position.includes("right") ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Collapse Toolbar</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsExpanded(true)} aria-label="Expand Toolbar">
                  {position.includes("right") ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Expand Toolbar</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {/* Save Preset Dialog */}
      <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Settings Preset</DialogTitle>
            <DialogDescription>Enter a name for your accessibility settings preset.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="My Accessibility Settings"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsPresetDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSavePreset} disabled={!presetName.trim()}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Accessibility Features Help</DialogTitle>
            <DialogDescription>
              Learn how to use the accessibility features to customize your experience.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Text Settings</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Customize text appearance for better readability.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Text Size:</strong> Adjust the size of all text on the page.
                  </li>
                  <li>
                    <strong>Line Height:</strong> Change the spacing between lines of text.
                  </li>
                  <li>
                    <strong>Letter Spacing:</strong> Adjust the space between letters.
                  </li>
                  <li>
                    <strong>Font Family:</strong> Choose a font that's easier for you to read.
                  </li>
                  <li>
                    <strong>Font Weight:</strong> Make text appear lighter or bolder.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Visual Settings</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Adjust visual elements for better visibility and reduced eye strain.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>High Contrast:</strong> Increase contrast between text and background.
                  </li>
                  <li>
                    <strong>Dark Mode:</strong> Switch between light and dark themes.
                  </li>
                  <li>
                    <strong>Color Filter:</strong> Apply filters to help with color blindness.
                  </li>
                  <li>
                    <strong>Reduce Motion:</strong> Minimize animations and transitions.
                  </li>
                  <li>
                    <strong>Reduce Transparency:</strong> Make transparent elements more opaque.
                  </li>
                  <li>
                    <strong>Simplified UI:</strong> Remove visual complexity for easier focus.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Reading Aids</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Tools to help with reading and content consumption.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Reading Guide:</strong> Display a horizontal guide to help track text.
                  </li>
                  <li>
                    <strong>Guide Position:</strong> Choose between fixed or cursor-following guide.
                  </li>
                  <li>
                    <strong>Image Descriptions:</strong> Enhance image alt text for screen readers.
                  </li>
                  <li>
                    <strong>Autoplay Videos:</strong> Control whether videos play automatically.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Audio Features</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Audio and speech tools for alternative content consumption.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Screen Reader:</strong> Read page content aloud.
                  </li>
                  <li>
                    <strong>Reading Speed:</strong> Adjust how fast text is read.
                  </li>
                  <li>
                    <strong>Voice Pitch:</strong> Change the pitch of the reading voice.
                  </li>
                  <li>
                    <strong>Voice Selection:</strong> Choose from available system voices.
                  </li>
                  <li>
                    <strong>Show Captions:</strong> Display text being read aloud.
                  </li>
                  <li>
                    <strong>Voice Recognition:</strong> Control settings with voice commands.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Input Assistance</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Make interaction with the site easier.</p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Cursor Size:</strong> Make the cursor larger for better visibility.
                  </li>
                  <li>
                    <strong>Cursor Color:</strong> Change cursor color for better contrast.
                  </li>
                  <li>
                    <strong>Focus Indicator:</strong> Highlight focused elements more prominently.
                  </li>
                  <li>
                    <strong>Keyboard Navigation:</strong> Optimize for keyboard-only navigation.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Advanced Features</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Additional customization options and tools.</p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Settings Presets:</strong> Save and load your preferred settings.
                  </li>
                  <li>
                    <strong>Custom CSS:</strong> Add your own CSS rules for further customization.
                  </li>
                  <li>
                    <strong>Force Colors:</strong> Override website colors with system colors.
                  </li>
                  <li>
                    <strong>Keyboard Shortcuts:</strong> Quick access to accessibility features.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Quick access to common accessibility features.
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Alt + R:</span>
                    <span>Toggle Screen Reader</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + +:</span>
                    <span>Increase Font Size</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + -:</span>
                    <span>Decrease Font Size</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + C:</span>
                    <span>Toggle High Contrast</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + D:</span>
                    <span>Toggle Dark Mode</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + G:</span>
                    <span>Toggle Reading Guide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + S:</span>
                    <span>Open Settings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt + V:</span>
                    <span>Toggle Voice Recognition</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Voice Commands</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Control accessibility features with your voice.
                </p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>"Increase font" or "Bigger text": Increase text size</li>
                  <li>"Decrease font" or "Smaller text": Decrease text size</li>
                  <li>"Dark mode" or "Night mode": Enable dark mode</li>
                  <li>"Light mode" or "Day mode": Enable light mode</li>
                  <li>"High contrast": Toggle high contrast mode</li>
                  <li>"Read page" or "Start reading": Start screen reader</li>
                  <li>"Stop reading": Stop screen reader</li>
                  <li>"Open settings": Open accessibility settings</li>
                  <li>"Close settings": Close accessibility settings</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" onClick={() => setIsHelpDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
