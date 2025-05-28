"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ZoomIn, ZoomOut, Volume2, VolumeX, Sun, Moon, Keyboard, ArrowUp, Settings, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccessibilityPreferences {
  fontSize: number
  contrast: number
  reducedMotion: boolean
  highContrast: boolean
  keyboardMode: boolean
  screenReader: boolean
  focusIndicators: boolean
  textSpacing: number
  soundEffects: boolean
  animations: boolean
}

export default function EnhancedAccessibilityToolbar() {
  // State for toolbar visibility and position
  const [isExpanded, setIsExpanded] = useState(false)
  const [position, setPosition] = useState<"left" | "right" | "bottom">("right")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("display")

  // Accessibility preferences
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    fontSize: 1,
    contrast: 1,
    reducedMotion: false,
    highContrast: false,
    keyboardMode: false,
    screenReader: false,
    focusIndicators: true,
    textSpacing: 1,
    soundEffects: false,
    animations: true,
  })

  // Theme management
  const { theme, setTheme } = useTheme()
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+A to toggle toolbar
      if (e.altKey && e.key === "a") {
        e.preventDefault()
        setIsExpanded((prev) => !prev)
      }

      // Escape to close expanded toolbar
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded])

  // Apply accessibility preferences
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Font size
      document.documentElement.style.setProperty("--accessibility-font-scale", preferences.fontSize.toString())

      // Contrast
      document.documentElement.style.setProperty("--accessibility-contrast", preferences.contrast.toString())

      // Text spacing
      document.documentElement.style.setProperty("--accessibility-text-spacing", preferences.textSpacing.toString())

      // High contrast mode
      if (preferences.highContrast) {
        document.body.classList.add("high-contrast-mode")
      } else {
        document.body.classList.remove("high-contrast-mode")
      }

      // Reduced motion
      if (preferences.reducedMotion) {
        document.body.classList.add("reduced-motion")
      } else {
        document.body.classList.remove("reduced-motion")
      }

      // Keyboard mode
      if (preferences.keyboardMode) {
        document.body.classList.add("keyboard-navigation-mode")
      } else {
        document.body.classList.remove("keyboard-navigation-mode")
      }

      // Focus indicators
      if (preferences.focusIndicators) {
        document.body.classList.add("focus-indicators")
      } else {
        document.body.classList.remove("focus-indicators")
      }
    }
  }, [preferences])

  // Update a single preference
  const updatePreference = <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences({
      fontSize: 1,
      contrast: 1,
      reducedMotion: false,
      highContrast: false,
      keyboardMode: false,
      screenReader: false,
      focusIndicators: true,
      textSpacing: 1,
      soundEffects: false,
      animations: true,
    })
  }

  // Toggle screen reader mode
  const toggleScreenReader = () => {
    updatePreference("screenReader", !preferences.screenReader)
    // Announce screen reader toggle
    const announcement = !preferences.screenReader ? "Screen reader mode activated" : "Screen reader mode deactivated"

    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", "assertive")
    announcer.setAttribute("role", "status")
    announcer.className = "sr-only"
    announcer.textContent = announcement
    document.body.appendChild(announcer)

    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  // Change toolbar position
  const changePosition = (newPosition: "left" | "right" | "bottom") => {
    setPosition(newPosition)
  }

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "left-4 top-1/2 -translate-y-1/2 flex-col"
      case "right":
        return "right-4 top-1/2 -translate-y-1/2 flex-col"
      case "bottom":
        return "bottom-4 left-1/2 -translate-x-1/2 flex-row"
      default:
        return "right-4 top-1/2 -translate-y-1/2 flex-col"
    }
  }

  return (
    <>
      {/* Skip to content link - important accessibility feature */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Accessibility toolbar */}
      <div
        ref={toolbarRef}
        className={cn(
          "fixed z-50 transition-all duration-300",
          getPositionClasses(),
          isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-90 hover:opacity-100",
        )}
      >
        <TooltipProvider delayDuration={300}>
          <div
            className={cn(
              "flex gap-2 p-2 rounded-lg shadow-lg bg-background border",
              position === "bottom" ? "flex-row" : "flex-col",
              isExpanded ? "border-primary" : "border-border",
            )}
          >
            {/* Toggle button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? "Collapse accessibility toolbar" : "Expand accessibility toolbar"}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={position === "right" ? "left" : "right"}>
                <p>{isExpanded ? "Collapse toolbar" : "Accessibility options"}</p>
                <p className="text-xs text-muted-foreground">Keyboard: Alt+A</p>
              </TooltipContent>
            </Tooltip>

            {/* Expanded toolbar buttons */}
            {isExpanded && (
              <>
                {/* Font size controls */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePreference("fontSize", Math.min(preferences.fontSize + 0.1, 1.5))}
                      aria-label="Increase font size"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>Increase font size</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePreference("fontSize", Math.max(preferences.fontSize - 0.1, 0.8))}
                      aria-label="Decrease font size"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>Decrease font size</p>
                  </TooltipContent>
                </Tooltip>

                {/* Contrast toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={preferences.highContrast ? "default" : "outline"}
                      size="icon"
                      onClick={() => updatePreference("highContrast", !preferences.highContrast)}
                      aria-label={preferences.highContrast ? "Disable high contrast" : "Enable high contrast"}
                      aria-pressed={preferences.highContrast}
                    >
                      {preferences.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>{preferences.highContrast ? "Disable" : "Enable"} high contrast</p>
                  </TooltipContent>
                </Tooltip>

                {/* Theme toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>Switch to {theme === "dark" ? "light" : "dark"} theme</p>
                  </TooltipContent>
                </Tooltip>

                {/* Motion toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={preferences.reducedMotion ? "default" : "outline"}
                      size="icon"
                      onClick={() => updatePreference("reducedMotion", !preferences.reducedMotion)}
                      aria-label={preferences.reducedMotion ? "Enable animations" : "Reduce animations"}
                      aria-pressed={preferences.reducedMotion}
                    >
                      <ArrowUp className={cn("h-4 w-4", preferences.reducedMotion ? "" : "animate-bounce")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>{preferences.reducedMotion ? "Enable" : "Reduce"} animations</p>
                  </TooltipContent>
                </Tooltip>

                {/* Screen reader toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={preferences.screenReader ? "default" : "outline"}
                      size="icon"
                      onClick={toggleScreenReader}
                      aria-label={preferences.screenReader ? "Disable screen reader mode" : "Enable screen reader mode"}
                      aria-pressed={preferences.screenReader}
                    >
                      {preferences.screenReader ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>{preferences.screenReader ? "Disable" : "Enable"} screen reader mode</p>
                  </TooltipContent>
                </Tooltip>

                {/* Keyboard navigation toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={preferences.keyboardMode ? "default" : "outline"}
                      size="icon"
                      onClick={() => updatePreference("keyboardMode", !preferences.keyboardMode)}
                      aria-label={
                        preferences.keyboardMode
                          ? "Disable keyboard navigation mode"
                          : "Enable keyboard navigation mode"
                      }
                      aria-pressed={preferences.keyboardMode}
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side={position === "right" ? "left" : "right"}>
                    <p>{preferences.keyboardMode ? "Disable" : "Enable"} keyboard navigation</p>
                  </TooltipContent>
                </Tooltip>

                {/* Advanced settings button */}
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Advanced accessibility settings">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Accessibility Settings</DialogTitle>
                      <DialogDescription>
                        Customize your experience to make this site more accessible for your needs.
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="display">Display</TabsTrigger>
                        <TabsTrigger value="controls">Controls</TabsTrigger>
                        <TabsTrigger value="audio">Audio</TabsTrigger>
                      </TabsList>

                      <TabsContent value="display" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="font-size">Text Size</Label>
                            <Badge variant="outline">{Math.round(preferences.fontSize * 100)}%</Badge>
                          </div>
                          <Slider
                            id="font-size"
                            min={80}
                            max={150}
                            step={5}
                            value={[preferences.fontSize * 100]}
                            onValueChange={(value) => updatePreference("fontSize", value[0] / 100)}
                            aria-label="Adjust font size"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="text-spacing">Text Spacing</Label>
                            <Badge variant="outline">{Math.round(preferences.textSpacing * 100)}%</Badge>
                          </div>
                          <Slider
                            id="text-spacing"
                            min={100}
                            max={200}
                            step={10}
                            value={[preferences.textSpacing * 100]}
                            onValueChange={(value) => updatePreference("textSpacing", value[0] / 100)}
                            aria-label="Adjust text spacing"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="contrast">Contrast</Label>
                            <Badge variant="outline">{Math.round(preferences.contrast * 100)}%</Badge>
                          </div>
                          <Slider
                            id="contrast"
                            min={80}
                            max={150}
                            step={5}
                            value={[preferences.contrast * 100]}
                            onValueChange={(value) => updatePreference("contrast", value[0] / 100)}
                            aria-label="Adjust contrast"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="high-contrast">High Contrast Mode</Label>
                            <p className="text-xs text-muted-foreground">
                              Increases contrast between text and background
                            </p>
                          </div>
                          <Switch
                            id="high-contrast"
                            checked={preferences.highContrast}
                            onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="reduced-motion">Reduced Motion</Label>
                            <p className="text-xs text-muted-foreground">Minimizes animations and transitions</p>
                          </div>
                          <Switch
                            id="reduced-motion"
                            checked={preferences.reducedMotion}
                            onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="controls" className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="keyboard-mode">Keyboard Navigation</Label>
                            <p className="text-xs text-muted-foreground">
                              Optimizes the site for keyboard-only navigation
                            </p>
                          </div>
                          <Switch
                            id="keyboard-mode"
                            checked={preferences.keyboardMode}
                            onCheckedChange={(checked) => updatePreference("keyboardMode", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="focus-indicators">Focus Indicators</Label>
                            <p className="text-xs text-muted-foreground">
                              Shows clear visual indicators for keyboard focus
                            </p>
                          </div>
                          <Switch
                            id="focus-indicators"
                            checked={preferences.focusIndicators}
                            onCheckedChange={(checked) => updatePreference("focusIndicators", checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Toolbar Position</Label>
                          <div className="flex gap-2">
                            <Button
                              variant={position === "left" ? "default" : "outline"}
                              size="sm"
                              onClick={() => changePosition("left")}
                              aria-pressed={position === "left"}
                            >
                              Left
                            </Button>
                            <Button
                              variant={position === "right" ? "default" : "outline"}
                              size="sm"
                              onClick={() => changePosition("right")}
                              aria-pressed={position === "right"}
                            >
                              Right
                            </Button>
                            <Button
                              variant={position === "bottom" ? "default" : "outline"}
                              size="sm"
                              onClick={() => changePosition("bottom")}
                              aria-pressed={position === "bottom"}
                            >
                              Bottom
                            </Button>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Toggle accessibility toolbar</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + A</kbd>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Skip to main content</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Close dialogs</span>
                              <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="audio" className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="screen-reader">Screen Reader Mode</Label>
                            <p className="text-xs text-muted-foreground">Optimizes content for screen readers</p>
                          </div>
                          <Switch
                            id="screen-reader"
                            checked={preferences.screenReader}
                            onCheckedChange={(checked) => updatePreference("screenReader", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sound-effects">Sound Effects</Label>
                            <p className="text-xs text-muted-foreground">Plays audio feedback for interactions</p>
                          </div>
                          <Switch
                            id="sound-effects"
                            checked={preferences.soundEffects}
                            onCheckedChange={(checked) => updatePreference("soundEffects", checked)}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                      <Button variant="outline" onClick={resetPreferences}>
                        Reset All
                      </Button>
                      <Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Accessibility status announcer for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {preferences.screenReader && "Screen reader mode is active"}
      </div>
    </>
  )
}
