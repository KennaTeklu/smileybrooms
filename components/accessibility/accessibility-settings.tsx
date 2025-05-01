"use client"

import { useState } from "react"
import { useAccessibility } from "./accessibility-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Keyboard,
  Layers,
  Glasses,
  Lightbulb,
  Contrast,
  Braces,
  Moon,
  Video,
  ImageIcon,
  Play,
  Square,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilitySettingsProps {
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "right" | "left"
}

export default function AccessibilitySettings({ className, position = "bottom-right" }: AccessibilitySettingsProps) {
  const {
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
  } = useAccessibility()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [presetName, setPresetName] = useState("")
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false)
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    right: "top-1/2 -translate-y-1/2 right-4",
    left: "top-1/2 -translate-y-1/2 left-4",
  }

  // Increase font size
  const increaseFontSize = () => {
    if (settings.fontSize < 2) {
      updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 2))
    }
  }

  // Decrease font size
  const decreaseFontSize = () => {
    if (settings.fontSize > 0.5) {
      updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.5))
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    updateSetting("darkMode", !settings.darkMode)
  }

  // Toggle high contrast
  const toggleHighContrast = () => {
    updateSetting("highContrast", !settings.highContrast)
  }

  // Toggle reading guide
  const toggleReadingGuide = () => {
    updateSetting("readingGuide", !settings.readingGuide)
  }

  // Save current settings as preset
  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim())
      setPresetName("")
      setIsPresetDialogOpen(false)
    }
  }

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-800 shadow-lg"
            aria-label="Accessibility Settings"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Accessibility Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
            <DialogDescription>
              Customize your experience to make this site more accessible for your needs.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="text" className="flex items-center gap-1">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="visual" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Visual</span>
              </TabsTrigger>
              <TabsTrigger value="reading" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Reading</span>
              </TabsTrigger>
              <TabsTrigger value="input" className="flex items-center gap-1">
                <MousePointer className="h-4 w-4" />
                <span className="hidden sm:inline">Input</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-1">
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] pr-4">
              {/* Text Settings */}
              <TabsContent value="text" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Type className="h-4 w-4" /> Text Size
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={decreaseFontSize} aria-label="Decrease font size">
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
                    <Button variant="outline" size="icon" onClick={increaseFontSize} aria-label="Increase font size">
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
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {settings.colorFilter === "none"
                      ? "No color filter applied"
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
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="guide-fixed"
                            value="fixed"
                            checked={settings.readingGuidePosition === "fixed"}
                            onChange={() => updateSetting("readingGuidePosition", "fixed")}
                          />
                          <Label htmlFor="guide-fixed">Fixed in center</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="guide-follow"
                            value="follow"
                            checked={settings.readingGuidePosition === "follow"}
                            onChange={() => updateSetting("readingGuidePosition", "follow")}
                          />
                          <Label htmlFor="guide-follow">Follow cursor</Label>
                        </div>
                      </div>
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

              {/* Audio Settings */}
              <TabsContent value="audio" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="h-4 w-4" /> Volume Control
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setVolume(settings.volume === 0 ? 0.5 : 0)}
                      aria-label={settings.volume === 0 ? "Unmute" : "Mute"}
                    >
                      {settings.volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[settings.volume * 100]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      className="flex-1"
                      aria-label="Volume"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Volume: {Math.round(settings.volume * 100)}%{settings.volume === 0 ? " (Muted)" : ""}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="play-audio" className="flex items-center gap-2">
                      {settings.isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {settings.isPlaying ? "Pause Audio" : "Play Audio"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {settings.isPlaying ? "Pause all audio on the page" : "Play all audio on the page"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlay}
                    disabled={settings.volume === 0 && !settings.isPlaying}
                  >
                    {settings.isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            <Button variant="destructive" onClick={resetSettings} size="sm">
              Reset All Settings
            </Button>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
