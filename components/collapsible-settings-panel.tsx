"use client"

import { Separator } from "@/components/ui/separator"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  ChevronRight,
  Sun,
  Moon,
  Palette,
  TextIcon as TextSize,
  Contrast,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  RotateCcw,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Keyboard,
  Languages,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/hooks/use-accessibility" // Corrected import path

export function CollapsibleSettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("display")
  const [previewMode, setPreviewMode] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const {
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
  } = useAccessibility()

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle click outside to collapse panel
  useEffect(() => {
    if (!isMounted) return
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  if (!isMounted) {
    return null
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  const devicePresets = [
    { name: "Desktop", icon: Monitor, fontSize: 100, lineHeight: 1.5 },
    { name: "Tablet", icon: Tablet, fontSize: 110, lineHeight: 1.6 },
    { name: "Mobile", icon: Smartphone, fontSize: 120, lineHeight: 1.7 },
  ]

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ]

  return (
    <TooltipProvider>
      <div ref={panelRef} className="flex">
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-settings"
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ width: "380px", opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-r-2xl shadow-2xl overflow-hidden border-r-2 border-t-2 border-b-2 border-purple-200/50 dark:border-purple-800/50 flex flex-col"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(147, 51, 234, 0.1)",
              }}
            >
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-5 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Settings</h2>
                      <p className="text-purple-100 text-sm">Customize your experience</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPreviewMode(!previewMode)}
                          className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Preview Mode</TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsExpanded(false)}
                      className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                      aria-label="Collapse settings panel"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                <TabsList className="grid grid-cols-2 p-3 m-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
                  <TabsTrigger value="display" className="rounded-lg font-medium">
                    Display
                  </TabsTrigger>
                  <TabsTrigger value="accessibility" className="rounded-lg font-medium">
                    Accessibility
                  </TabsTrigger>
                </TabsList>

                <div className="p-5 flex-1 overflow-auto">
                  <TabsContent value="display" className="mt-0 space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <Button
                              key={option.value}
                              variant={theme === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setTheme(option.value)}
                              className={cn(
                                "flex flex-col gap-1 h-auto py-3",
                                theme === option.value && "bg-purple-600 hover:bg-purple-700",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="text-xs">{option.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Device Presets */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Device Presets
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {devicePresets.map((preset) => {
                          const Icon = preset.icon
                          return (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFontSize(preset.fontSize)
                                setLineHeight(preset.lineHeight)
                              }}
                              className="flex flex-col gap-1 h-auto py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                              <Icon className="h-4 w-4" />
                              <span className="text-xs">{preset.name}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Font Size with Visual Indicator */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size" className="text-base font-semibold flex items-center gap-2">
                          <TextSize className="h-4 w-4" />
                          Font Size
                        </Label>
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        >
                          {fontSize}%
                        </Badge>
                      </div>
                      <Slider
                        id="font-size"
                        min={80}
                        max={150}
                        step={5}
                        value={[fontSize]}
                        onValueChange={([value]) => setFontSize(value)}
                        className="w-full"
                      />
                      {previewMode && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <p style={{ fontSize: `${fontSize}%` }} className="text-sm">
                            Sample text at {fontSize}% size
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Line Height */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="line-height" className="text-base font-semibold flex items-center gap-2">
                          <AlignLeft className="h-4 w-4" />
                          Line Height
                        </Label>
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        >
                          {lineHeight.toFixed(1)}
                        </Badge>
                      </div>
                      <Slider
                        id="line-height"
                        min={1.0}
                        max={2.0}
                        step={0.1}
                        value={[lineHeight]}
                        onValueChange={([value]) => setLineHeight(value)}
                        className="w-full"
                      />
                    </div>

                    {/* Letter Spacing */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="letter-spacing" className="text-base font-semibold flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Letter Spacing
                        </Label>
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        >
                          {letterSpacing.toFixed(2)}em
                        </Badge>
                      </div>
                      <Slider
                        id="letter-spacing"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={[letterSpacing]}
                        onValueChange={([value]) => setLetterSpacing(value)}
                        className="w-full"
                      />
                    </div>

                    {/* Font Family */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Font Family
                      </Label>
                      <RadioGroup
                        value={fontFamily}
                        onValueChange={(value: "sans" | "serif" | "mono") => setFontFamily(value)}
                        className="grid grid-cols-3 gap-2"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value="sans" id="font-sans" />
                          <Label htmlFor="font-sans" className="font-sans">
                            Sans-serif
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value="serif" id="font-serif" />
                          <Label htmlFor="font-serif" className="font-serif">
                            Serif
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <RadioGroupItem value="mono" id="font-mono" />
                          <Label htmlFor="font-mono" className="font-mono">
                            Mono
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <AlignLeft className="h-4 w-4" />
                        Text Alignment
                      </Label>
                      <RadioGroup
                        value={textAlignment}
                        onValueChange={(value: "left" | "center" | "right" | "justify") => setTextAlignment(value)}
                        className="grid grid-cols-4 gap-2"
                      >
                        {[
                          { value: "left", icon: AlignLeft, label: "Left" },
                          { value: "center", icon: AlignCenter, label: "Center" },
                          { value: "right", icon: AlignRight, label: "Right" },
                          { value: "justify", icon: AlignJustify, label: "Justify" },
                        ].map(({ value, icon: Icon, label }) => (
                          <div
                            key={value}
                            className="flex flex-col items-center space-y-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <RadioGroupItem value={value} id={`align-${value}`} />
                            <Label htmlFor={`align-${value}`} className="flex flex-col items-center gap-1">
                              <Icon className="h-4 w-4" />
                              <span className="text-xs">{label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="language-select" className="text-base font-semibold flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Language
                      </Label>
                      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                        <SelectTrigger id="language-select" className="w-full">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="accessibility" className="mt-0 space-y-6">
                    {/* Enhanced Toggle Switches */}
                    {[
                      {
                        id: "high-contrast",
                        label: "High Contrast",
                        icon: Contrast,
                        checked: highContrast,
                        onChange: toggleHighContrast,
                        description: "Increase contrast between text and background colors.",
                      },
                      {
                        id: "grayscale",
                        label: "Grayscale",
                        icon: Palette,
                        checked: grayscale,
                        onChange: toggleGrayscale,
                        description: "Display all colors in shades of gray.",
                      },
                      {
                        id: "invert-colors",
                        label: "Invert Colors",
                        icon: Eye,
                        checked: invertColors,
                        onChange: toggleInvertColors,
                        description: "Reverse the colors on the screen.",
                      },
                      {
                        id: "animations",
                        label: "Animations",
                        icon: Sparkles,
                        checked: animations,
                        onChange: toggleAnimations,
                        description: "Enable or disable UI animations and transitions.",
                      },
                      {
                        id: "screen-reader-mode",
                        label: "Screen Reader Mode",
                        icon: Eye,
                        checked: screenReaderMode,
                        onChange: toggleScreenReaderMode,
                        description: "Optimize content for screen readers.",
                      },
                      {
                        id: "link-highlight",
                        label: "Link Highlight",
                        icon: Eye,
                        checked: linkHighlight,
                        onChange: toggleLinkHighlight,
                        description: "Highlight all clickable links on the page.",
                      },
                      {
                        id: "keyboard-navigation",
                        label: "Keyboard Navigation",
                        icon: Keyboard,
                        checked: keyboardNavigation,
                        onChange: toggleKeyboardNavigation,
                        description: "Show clear visual indicators for keyboard focus.",
                      },
                    ].map(({ id, label, icon: Icon, checked, onChange, description }) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                      >
                        <Label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                            <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
                          </div>
                        </Label>
                        <Switch
                          id={id}
                          checked={checked}
                          onCheckedChange={onChange}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    ))}

                    <Separator className="my-6" />

                    <Button
                      onClick={resetAccessibilitySettings}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                      size="lg"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset All Settings
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  key="collapsed-settings"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsExpanded(true)}
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
                    "border-2 border-purple-200/50 dark:border-purple-800/50",
                    "hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                    "transition-all duration-300 hover:scale-105",
                  )}
                  style={{
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(147, 51, 234, 0.05)",
                  }}
                  aria-label="Open settings panel"
                >
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
