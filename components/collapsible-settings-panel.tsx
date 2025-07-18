"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Palette, Accessibility, Text, Languages, X } from "lucide-react"
import { useAccessibility } from "@/lib/accessibility-context"
import { motion, AnimatePresence } from "framer-motion"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

// Define fixed offsets
const SETTINGS_COLLAPSED_BOTTOM_OFFSET = 20 // Distance from bottom when collapsed
const SETTINGS_EXPANDED_TOP_OFFSET = 0 // Distance from top when expanded
const SETTINGS_EXPANDED_HEIGHT = 500 // Approximate height of the expanded panel
const SETTINGS_COLLAPSED_WIDTH = 50 // Approximate width of the collapsed button

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Don't close if the click was on the button itself
    }
    setIsOpen(false)
  })

  useKeyboardShortcuts({
    "alt+s": () => setIsOpen((prev) => !prev),
    Escape: () => setIsOpen(false),
  })

  const handleReset = () => {
    resetPreferences()
  }

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ]

  const fontFamilyOptions = [
    { value: "Inter, sans-serif", label: "Default (Inter)" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "monospace", label: "Monospace" },
  ]

  const textAlignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ]

  const panelStyle: React.CSSProperties = useMemo(() => {
    if (isOpen) {
      return {
        top: `${SETTINGS_EXPANDED_TOP_OFFSET}px`,
        bottom: "auto",
        left: "0",
        width: "auto", // Let motion.div control width
        height: `${SETTINGS_EXPANDED_HEIGHT}px`,
      }
    } else {
      return {
        top: "auto",
        bottom: `${SETTINGS_COLLAPSED_BOTTOM_OFFSET}px`,
        left: "0",
        width: `${SETTINGS_COLLAPSED_WIDTH}px`, // Let motion.button control width
        height: "auto",
      }
    }
  }, [isOpen])

  if (!isMounted) return null

  return (
    <div ref={panelRef} className="fixed flex" style={panelStyle}>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-r-2xl shadow-2xl overflow-hidden border-r-2 border-t-2 border-b-2 border-purple-200/50 dark:border-purple-800/50"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
            }}
          >
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-5 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Settings</h3>
                  <p className="text-purple-100 text-sm">Customize your experience</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                aria-label="Close settings panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="accessibility" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900/70">
                <TabsTrigger
                  value="accessibility"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  <Accessibility className="h-4 w-4" /> Accessibility
                </TabsTrigger>
                <TabsTrigger
                  value="display"
                  className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
                >
                  <Palette className="h-4 w-4" /> Display
                </TabsTrigger>
              </TabsList>

              <TabsContent value="accessibility" className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="text-gray-700 dark:text-gray-300">
                    High Contrast
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                    aria-label="Toggle high contrast mode"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text" className="text-gray-700 dark:text-gray-300">
                    Large Text
                  </Label>
                  <Switch
                    id="large-text"
                    checked={preferences.largeText}
                    onCheckedChange={(checked) => updatePreference("largeText", checked)}
                    aria-label="Toggle large text mode"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion" className="text-gray-700 dark:text-gray-300">
                    Reduced Motion
                  </Label>
                  <Switch
                    id="reduced-motion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                    aria-label="Toggle reduced motion"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader-mode" className="text-gray-700 dark:text-gray-300">
                    Screen Reader Mode
                  </Label>
                  <Switch
                    id="screen-reader-mode"
                    checked={preferences.screenReaderMode}
                    onCheckedChange={(checked) => updatePreference("screenReaderMode", checked)}
                    aria-label="Toggle screen reader mode"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-navigation" className="text-gray-700 dark:text-gray-300">
                    Keyboard Navigation
                  </Label>
                  <Switch
                    id="keyboard-navigation"
                    checked={preferences.keyboardNavigation}
                    onCheckedChange={(checked) => updatePreference("keyboardNavigation", checked)}
                    aria-label="Toggle keyboard navigation indicators"
                  />
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <Button
                  onClick={handleReset}
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  aria-label="Reset all accessibility settings"
                >
                  Reset All Settings
                </Button>
              </TabsContent>

              <TabsContent value="display" className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                <div>
                  <Label htmlFor="text-alignment" className="mb-2 block text-gray-700 dark:text-gray-300">
                    <Text className="mr-2 inline-block h-4 w-4" /> Text Alignment
                  </Label>
                  <Select
                    value={preferences.textAlignment}
                    onValueChange={(value: "left" | "center" | "right" | "justify") =>
                      updatePreference("textAlignment", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {textAlignmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="font-family" className="mb-2 block text-gray-700 dark:text-gray-300">
                    <Text className="mr-2 inline-block h-4 w-4" /> Font Family
                  </Label>
                  <Select
                    value={preferences.fontFamily}
                    onValueChange={(value: string) => updatePreference("fontFamily", value)}
                  >
                    <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {fontFamilyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className="mb-2 block text-gray-700 dark:text-gray-300">
                    <Languages className="mr-2 inline-block h-4 w-4" /> Language
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value: string) => updatePreference("language", value)}
                  >
                    <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            ref={buttonRef}
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 py-3 px-3 sm:py-4 sm:px-5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-r-2xl shadow-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 border-r-2 border-t-2 border-b-2 border-purple-200/50 dark:border-purple-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)",
            }}
            aria-label="Open settings panel"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="[writing-mode:vertical-rl] self-end rotate-180">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Settings</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Customize</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
