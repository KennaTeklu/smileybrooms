"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  X,
  Sun,
  Moon,
  Contrast,
  Text,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Keyboard,
  Volume2,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility } from "@/hooks/use-accessibility"
import { cn } from "@/lib/utils"

export function CollapsibleSettingsPanel() {
  const { preferences, updatePreference, resetPreferences, announceToScreenReader } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => setIsOpen(!isOpen)

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50, x: -50, transition: { duration: 0.2 } },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  const handleReset = () => {
    resetPreferences()
    announceToScreenReader("All accessibility settings have been reset to default.", true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={togglePanel}
        aria-label={isOpen ? "Close settings" : "Open settings"}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 left-4 z-40 flex h-[85vh] w-full max-w-[90vw] flex-col rounded-xl border border-purple-200 bg-background shadow-lg sm:max-w-md"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-panel-title"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="settings-panel-title" className="text-xl font-semibold">
                Accessibility Settings
              </h2>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close settings panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Theme Preference */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Theme</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={preferences.prefersLightTheme ? "default" : "outline"}
                      onClick={() => {
                        updatePreference("prefersLightTheme", true)
                        updatePreference("prefersDarkTheme", false)
                        announceToScreenReader("Theme set to light.", true)
                      }}
                      className="flex-1"
                    >
                      <Sun className="mr-2 h-4 w-4" /> Light
                    </Button>
                    <Button
                      variant={preferences.prefersDarkTheme ? "default" : "outline"}
                      onClick={() => {
                        updatePreference("prefersDarkTheme", true)
                        updatePreference("prefersLightTheme", false)
                        announceToScreenReader("Theme set to dark.", true)
                      }}
                      className="flex-1"
                    >
                      <Moon className="mr-2 h-4 w-4" /> Dark
                    </Button>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="flex items-center gap-2 text-base">
                    <Contrast className="h-5 w-5" /> High Contrast Mode
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => {
                      updatePreference("highContrast", checked)
                      announceToScreenReader(`High contrast mode ${checked ? "enabled" : "disabled"}.`, true)
                    }}
                  />
                </div>

                {/* Large Text */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text" className="flex items-center gap-2 text-base">
                    <Text className="h-5 w-5" /> Large Text
                  </Label>
                  <Switch
                    id="large-text"
                    checked={preferences.largeText}
                    onCheckedChange={(checked) => {
                      updatePreference("largeText", checked)
                      announceToScreenReader(`Large text mode ${checked ? "enabled" : "disabled"}.`, true)
                    }}
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion" className="flex items-center gap-2 text-base">
                    <RotateCcw className="h-5 w-5" /> Reduced Motion
                  </Label>
                  <Switch
                    id="reduced-motion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => {
                      updatePreference("reducedMotion", checked)
                      announceToScreenReader(`Reduced motion ${checked ? "enabled" : "disabled"}.`, true)
                    }}
                  />
                </div>

                {/* Screen Reader Mode */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader" className="flex items-center gap-2 text-base">
                    <Volume2 className="h-5 w-5" /> Screen Reader Mode
                  </Label>
                  <Switch
                    id="screen-reader"
                    checked={preferences.screenReaderMode}
                    onCheckedChange={(checked) => {
                      updatePreference("screenReaderMode", checked)
                      announceToScreenReader(`Screen reader mode ${checked ? "enabled" : "disabled"}.`, true)
                    }}
                  />
                </div>

                {/* Keyboard Navigation */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav" className="flex items-center gap-2 text-base">
                    <Keyboard className="h-5 w-5" /> Keyboard Navigation
                  </Label>
                  <Switch
                    id="keyboard-nav"
                    checked={preferences.keyboardNavigation}
                    onCheckedChange={(checked) => {
                      updatePreference("keyboardNavigation", checked)
                      announceToScreenReader(`Keyboard navigation ${checked ? "enabled" : "disabled"}.`, true)
                    }}
                  />
                </div>

                {/* Text Alignment */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Text Alignment</h3>
                  <RadioGroup
                    value={preferences.textAlignment}
                    onValueChange={(value: "left" | "center" | "right" | "justify") => {
                      updatePreference("textAlignment", value)
                      announceToScreenReader(`Text alignment set to ${value}.`, true)
                    }}
                    className="grid grid-cols-4 gap-2"
                  >
                    <Label
                      htmlFor="align-left"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        preferences.textAlignment === "left" && "border-primary",
                      )}
                    >
                      <RadioGroupItem value="left" id="align-left" className="sr-only" />
                      <AlignLeft className="mb-2 h-6 w-6" />
                      <span>Left</span>
                    </Label>
                    <Label
                      htmlFor="align-center"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        preferences.textAlignment === "center" && "border-primary",
                      )}
                    >
                      <RadioGroupItem value="center" id="align-center" className="sr-only" />
                      <AlignCenter className="mb-2 h-6 w-6" />
                      <span>Center</span>
                    </Label>
                    <Label
                      htmlFor="align-right"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        preferences.textAlignment === "right" && "border-primary",
                      )}
                    >
                      <RadioGroupItem value="right" id="align-right" className="sr-only" />
                      <AlignRight className="mb-2 h-6 w-6" />
                      <span>Right</span>
                    </Label>
                    <Label
                      htmlFor="align-justify"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        preferences.textAlignment === "justify" && "border-primary",
                      )}
                    >
                      <RadioGroupItem value="justify" id="align-justify" className="sr-only" />
                      <AlignJustify className="mb-2 h-6 w-6" />
                      <span>Justify</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Font Family */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Font Family</h3>
                  <Select
                    value={preferences.fontFamily}
                    onValueChange={(value) => {
                      updatePreference("fontFamily", value)
                      announceToScreenReader(`Font family set to ${value}.`, true)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter (Default)</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div>
                  <h3 className="mb-2 text-lg font-medium">Language</h3>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => {
                      updatePreference("language", value)
                      announceToScreenReader(`Language set to ${value}.`, true)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-4">
              <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset All Settings
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
