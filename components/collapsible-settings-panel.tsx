"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  X,
  Sun,
  Moon,
  Contrast,
  Text,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Keyboard,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAccessibility } from "@/lib/accessibility-context"
import { cn } from "@/lib/utils"

export default function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { preferences, setPreferences, resetPreferences } = useAccessibility()

  const togglePanel = () => setIsOpen(!isOpen)

  // Close panel if ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    if (theme === "light") {
      setPreferences((prev) => ({ ...prev, prefersLightTheme: true, prefersDarkTheme: false }))
    } else if (theme === "dark") {
      setPreferences((prev) => ({ ...prev, prefersDarkTheme: true, prefersLightTheme: false }))
    } else {
      setPreferences((prev) => ({ ...prev, prefersDarkTheme: false, prefersLightTheme: false }))
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
        onClick={togglePanel}
        aria-label={isOpen ? "Close settings" : "Open settings"}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-4 right-4 z-50 flex h-[85vh] w-full max-w-[90vw] flex-col rounded-xl border bg-background shadow-lg sm:max-w-md",
              "border-purple-200 bg-purple-50/50 backdrop-blur-md dark:border-purple-800 dark:bg-purple-950/50",
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="settings-panel-title" className="text-xl font-bold text-purple-800 dark:text-purple-200">
                Accessibility Settings
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close settings panel">
                <X className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </Button>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Theme Preference */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Sparkles className="h-4 w-4" /> Theme
                  </Label>
                  <RadioGroup
                    value={preferences.prefersDarkTheme ? "dark" : preferences.prefersLightTheme ? "light" : "system"}
                    onValueChange={handleThemeChange}
                    className="grid grid-cols-3 gap-2"
                  >
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="theme-light" value="light" className="sr-only" />
                      <Sun className="mb-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <span>Light</span>
                    </Label>
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="theme-dark" value="dark" className="sr-only" />
                      <Moon className="mb-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <span>Dark</span>
                    </Label>
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="theme-system" value="system" className="sr-only" />
                      <Sparkles className="mb-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
                      <span>System</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="high-contrast"
                    className="flex items-center gap-2 text-purple-800 dark:text-purple-200"
                  >
                    <Contrast className="h-4 w-4" /> High Contrast
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => handlePreferenceChange("highContrast", checked)}
                  />
                </div>

                {/* Large Text */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text" className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Text className="h-4 w-4" /> Large Text
                  </Label>
                  <Switch
                    id="large-text"
                    checked={preferences.largeText}
                    onCheckedChange={(checked) => handlePreferenceChange("largeText", checked)}
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="reduced-motion"
                    className="flex items-center gap-2 text-purple-800 dark:text-purple-200"
                  >
                    <Sparkles className="h-4 w-4" /> Reduced Motion
                  </Label>
                  <Switch
                    id="reduced-motion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => handlePreferenceChange("reducedMotion", checked)}
                  />
                </div>

                {/* Keyboard Navigation */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="keyboard-navigation"
                    className="flex items-center gap-2 text-purple-800 dark:text-purple-200"
                  >
                    <Keyboard className="h-4 w-4" /> Keyboard Navigation
                  </Label>
                  <Switch
                    id="keyboard-navigation"
                    checked={preferences.keyboardNavigation}
                    onCheckedChange={(checked) => handlePreferenceChange("keyboardNavigation", checked)}
                  />
                </div>

                {/* Text Alignment */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <AlignLeft className="h-4 w-4" /> Text Alignment
                  </Label>
                  <RadioGroup
                    value={preferences.textAlignment}
                    onValueChange={(value: "left" | "center" | "right" | "justify") =>
                      handlePreferenceChange("textAlignment", value)
                    }
                    className="grid grid-cols-4 gap-2"
                  >
                    <Label
                      htmlFor="align-left"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-2 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="align-left" value="left" className="sr-only" />
                      <AlignLeft className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs">Left</span>
                    </Label>
                    <Label
                      htmlFor="align-center"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-2 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="align-center" value="center" className="sr-only" />
                      <AlignCenter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs">Center</span>
                    </Label>
                    <Label
                      htmlFor="align-right"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-2 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="align-right" value="right" className="sr-only" />
                      <AlignRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs">Right</span>
                    </Label>
                    <Label
                      htmlFor="align-justify"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-2 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="align-justify" value="justify" className="sr-only" />
                      <AlignJustify className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs">Justify</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Type className="h-4 w-4" /> Font Family
                  </Label>
                  <RadioGroup
                    value={preferences.fontFamily}
                    onValueChange={(value: "sans" | "serif" | "mono") => handlePreferenceChange("fontFamily", value)}
                    className="grid grid-cols-3 gap-2"
                  >
                    <Label
                      htmlFor="font-sans"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="font-sans" value="sans" className="sr-only" />
                      <span className="font-sans text-lg font-bold text-purple-600 dark:text-purple-400">Aa</span>
                      <span>Sans-serif</span>
                    </Label>
                    <Label
                      htmlFor="font-serif"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="font-serif" value="serif" className="sr-only" />
                      <span className="font-serif text-lg font-bold text-purple-600 dark:text-purple-400">Aa</span>
                      <span>Serif</span>
                    </Label>
                    <Label
                      htmlFor="font-mono"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-purple-200 bg-purple-100/50 p-4 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <RadioGroupItem id="font-mono" value="mono" className="sr-only" />
                      <span className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400">Aa</span>
                      <span>Monospace</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-200 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-800 bg-transparent"
                  onClick={resetPreferences}
                >
                  Reset All Settings
                </Button>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
