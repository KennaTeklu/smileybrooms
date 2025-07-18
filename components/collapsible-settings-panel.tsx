"use client"

import { useState, useRef } from "react"
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
import { cn } from "@/lib/utils"

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

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

  return (
    <div className="relative" ref={panelRef}>
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        className={cn(
          `rounded-full bg-purple-600/90 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-2 border-purple-500`,
          isOpen ? "px-4 py-3 min-w-[100px] gap-2" : "w-10 h-10 p-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close settings panel" : "Open settings panel"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <>
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium whitespace-nowrap">Settings</span>
          </>
        ) : (
          <Settings className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[300px] max-w-[400px] p-4 z-20"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Settings
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
        )}
      </AnimatePresence>
    </div>
  )
}
