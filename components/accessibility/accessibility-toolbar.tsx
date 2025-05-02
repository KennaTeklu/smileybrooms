"use client"

import { useState } from "react"
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
  VolumeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilityToolbarProps {
  className?: string
}

export default function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const { settings, updateSetting, resetSettings, isReading, startReading, stopReading, pauseReading, resumeReading } =
    useAccessibility()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  // Toggle screen reader
  const toggleScreenReader = () => {
    if (isReading) {
      stopReading()
    } else {
      startReading()
    }
  }

  // Toggle mute
  const toggleMute = () => {
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
  }

  // Increase font size
  const increaseFontSize = () => {
    if (settings.fontSize < 1.5) {
      updateSetting("fontSize", Math.min(settings.fontSize + 0.1, 1.5))
    }
  }

  // Decrease font size
  const decreaseFontSize = () => {
    if (settings.fontSize > 0.8) {
      updateSetting("fontSize", Math.max(settings.fontSize - 0.1, 0.8))
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    updateSetting("darkMode", !settings.darkMode)
    // Apply dark mode
    if (typeof document !== "undefined") {
      if (!settings.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <TooltipProvider>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2">
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
                          value={[settings.fontSize * 100]}
                          min={80}
                          max={150}
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
                        max={200}
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
                        min={0}
                        max={5}
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
                      <p className="text-xs text-muted-foreground">Simulates different types of color blindness</p>
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
                        <p className="text-xs text-muted-foreground">
                          Show a horizontal guide that follows your cursor
                        </p>
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
                          <Palette className="h-4 w-4" /> Image Descriptions
                        </Label>
                        <p className="text-xs text-muted-foreground">Enhance image alt text for screen readers</p>
                      </div>
                      <Switch
                        id="image-descriptions"
                        checked={settings.imageDescriptions}
                        onCheckedChange={(checked) => updateSetting("imageDescriptions", checked)}
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
                          value={[settings.speechVolume]}
                          min={0}
                          max={1}
                          step={0.05}
                          onValueChange={(value) => updateSetting("speechVolume", value[0])}
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
                        value={[settings.speechRate]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => updateSetting("speechRate", value[0])}
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
                        value={[settings.speechPitch]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => updateSetting("speechPitch", value[0])}
                        aria-label="Voice pitch"
                      />
                      <p className="text-xs text-muted-foreground">
                        {settings.speechPitch < 1 ? "Lower" : settings.speechPitch > 1 ? "Higher" : "Normal"} (
                        {settings.speechPitch.toFixed(1)})
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

                  {/* Advanced Settings */}
                  <TabsContent value="advanced" className="space-y-6">
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
                onClick={toggleScreenReader}
                className={isReading ? "bg-primary text-primary-foreground" : ""}
                aria-label={isReading ? "Stop Reading" : "Read Page Aloud"}
              >
                {isReading ? <Volume2 className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}
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
        </div>
      </TooltipProvider>
    </div>
  )
}
