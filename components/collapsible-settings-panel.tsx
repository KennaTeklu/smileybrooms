"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  X,
  Sun,
  Moon,
  Text,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronRight,
  Sparkles,
  Zap,
  ClipboardCheck,
  FileTypeIcon as Font,
  Languages,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useTranslation } from "@/contexts/translation-context" // Import useTranslation

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { preferences, updatePreference, resetPreferences, announceToScreenReader } = useAccessibility()
  const { t } = useTranslation() // Use the translation hook

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsOpen(false)
  })

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      "alt+a": () => setIsOpen((prev) => !prev), // Alt + A for Accessibility/Settings
      Escape: () => setIsOpen(false),
    },
    preferences.keyboardNavigation,
  ) // Conditionally enable/disable shortcuts

  const handleReset = () => {
    resetPreferences()
    announceToScreenReader(t("settings.reset_success_message"), true)
    setIsOpen(false) // Close panel after reset
  }

  // Define animation variants for the panel
  const panelVariants = {
    hidden: { opacity: 0, x: "-100%", scale: 0.8, originX: 0, originY: 1 },
    visible: { opacity: 1, x: "0%", scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, x: "-100%", scale: 0.8, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  // Define animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.8, transition: { type: "spring", damping: 25, stiffness: 300 } },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
  }

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <motion.div
        ref={panelRef}
        // Fixed positioning at bottom-left, responsive margin
        className="fixed z-[997] bottom-4 left-4 sm:left-4 md:left-4 lg:left-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={buttonVariants} // Apply button variants to the container for initial button animation
      >
        {/* Trigger Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
                "border-2 border-green-200/50 dark:border-green-800/50",
                "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                "transition-all duration-300 hover:scale-105 relative",
              )}
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(34, 197, 94, 0.05)",
              }}
              aria-label={isOpen ? t("settings.close_button_label") : t("settings.open_button_label")}
            >
              {isOpen ? (
                <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isOpen ? t("settings.close_tooltip") : t("settings.open_tooltip")}
          </TooltipContent>
        </Tooltip>

        {/* Expandable Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants} // Apply panel variants here
              className={cn(
                "absolute bottom-full left-0 mb-3 w-full max-w-[90vw] sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border-2 border-green-200/50 dark:border-green-800/50",
                "relative flex flex-col",
              )}
              style={{
                maxHeight: "80vh", // Adjusted max height for better mobile fit
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)",
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{t("settings.title")}</h3>
                      <p className="text-green-100 text-sm">{t("settings.subtitle")}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                    aria-label={t("settings.close_panel_button_label")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Settings Content */}
              <div className="p-5 flex-1 overflow-auto space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <Moon className="h-5 w-5 text-blue-500" />
                    <span>{t("settings.dark_mode")}</span>
                  </Label>
                  <Switch
                    id="theme-toggle"
                    checked={preferences.prefersDarkTheme} // Use prefersDarkTheme
                    onCheckedChange={(checked) => {
                      updatePreference("prefersDarkTheme", checked)
                      updatePreference("prefersLightTheme", !checked) // Ensure light theme is opposite
                      announceToScreenReader(t(`settings.dark_mode_status_${checked ? "enabled" : "disabled"}`), true)
                    }}
                    aria-label={t("settings.toggle_dark_mode")}
                  />
                </div>

                {/* High Contrast Mode */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="high-contrast-toggle"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.high_contrast_mode")}</span>
                  </Label>
                  <Switch
                    id="high-contrast-toggle"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => {
                      updatePreference("highContrast", checked)
                      announceToScreenReader(
                        t(`settings.high_contrast_status_${checked ? "enabled" : "disabled"}`),
                        true,
                      )
                    }}
                    aria-label={t("settings.toggle_high_contrast_mode")}
                  />
                </div>

                {/* Large Text Mode */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="large-text-toggle"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Text className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.large_text_mode")}</span>
                  </Label>
                  <Switch
                    id="large-text-toggle"
                    checked={preferences.largeText}
                    onCheckedChange={(checked) => {
                      updatePreference("largeText", checked)
                      announceToScreenReader(t(`settings.large_text_status_${checked ? "enabled" : "disabled"}`), true)
                    }}
                    aria-label={t("settings.toggle_large_text_mode")}
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="reduced-motion-toggle"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.reduced_motion")}</span>
                  </Label>
                  <Switch
                    id="reduced-motion-toggle"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => {
                      updatePreference("reducedMotion", checked)
                      announceToScreenReader(
                        t(`settings.reduced_motion_status_${checked ? "enabled" : "disabled"}`),
                        true,
                      )
                    }}
                    aria-label={t("settings.toggle_reduced_motion")}
                  />
                </div>

                {/* Keyboard Navigation */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="keyboard-nav-toggle"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <ClipboardCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.keyboard_navigation")}</span>
                  </Label>
                  <Switch
                    id="keyboard-nav-toggle"
                    checked={preferences.keyboardNavigation}
                    onCheckedChange={(checked) => {
                      updatePreference("keyboardNavigation", checked)
                      announceToScreenReader(
                        t(`settings.keyboard_navigation_status_${checked ? "enabled" : "disabled"}`),
                        true,
                      )
                    }}
                    aria-label={t("settings.toggle_keyboard_navigation")}
                  />
                </div>

                {/* Font Family Selection */}
                <div className="space-y-2">
                  <Label
                    htmlFor="font-family-select"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Font className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.font_family")}</span>
                  </Label>
                  <Select
                    value={preferences.fontFamily}
                    onValueChange={(value) => {
                      updatePreference("fontFamily", value)
                      announceToScreenReader(t("settings.font_family_changed", { font: value }), true)
                    }}
                  >
                    <SelectTrigger
                      id="font-family-select"
                      className="w-full"
                      aria-label={t("settings.select_font_family")}
                    >
                      <SelectValue placeholder={t("settings.select_a_font")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">{t("settings.font_inter")}</SelectItem>
                      <SelectItem value="Arial, sans-serif">{t("settings.font_arial")}</SelectItem>
                      <SelectItem value="Verdana, sans-serif">{t("settings.font_verdana")}</SelectItem>
                      <SelectItem value="Georgia, serif">{t("settings.font_georgia")}</SelectItem>
                      <SelectItem value="monospace">{t("settings.font_monospace")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Selection */}
                <div className="space-y-2">
                  <Label htmlFor="language-select" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.language")}</span>
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => {
                      updatePreference("language", value)
                      announceToScreenReader(t("settings.language_changed", { lang: value }), true)
                    }}
                  >
                    <SelectTrigger id="language-select" className="w-full" aria-label={t("settings.select_language")}>
                      <SelectValue placeholder={t("settings.select_a_language")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t("settings.lang_en")}</SelectItem>
                      <SelectItem value="es">{t("settings.lang_es")}</SelectItem>
                      <SelectItem value="fr">{t("settings.lang_fr")}</SelectItem>
                      <SelectItem value="de">{t("settings.lang_de")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Scheme Selection */}
                <div className="space-y-2">
                  <Label
                    htmlFor="color-scheme-select"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.color_scheme")}</span>
                  </Label>
                  <Select
                    value={preferences.colorScheme}
                    onValueChange={(value) => {
                      updatePreference("colorScheme", value as "default" | "green" | "blue")
                      announceToScreenReader(t("settings.color_scheme_changed", { scheme: value }), true)
                    }}
                  >
                    <SelectTrigger
                      id="color-scheme-select"
                      className="w-full"
                      aria-label={t("settings.select_color_scheme")}
                    >
                      <SelectValue placeholder={t("settings.select_a_color_scheme")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">{t("settings.scheme_default")}</SelectItem>
                      <SelectItem value="green">{t("settings.scheme_green")}</SelectItem>
                      <SelectItem value="blue">{t("settings.scheme_blue")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Line Height Slider */}
                <div className="space-y-2">
                  <Label
                    htmlFor="line-height-slider"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Text className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>
                      {t("settings.line_height")}: {preferences.lineHeight?.toFixed(2)}
                    </span>
                  </Label>
                  <Slider
                    id="line-height-slider"
                    min={1.0}
                    max={2.0}
                    step={0.05}
                    value={[preferences.lineHeight || 1.5]} // Default to 1.5 if undefined
                    onValueChange={(value) => {
                      updatePreference("lineHeight", value[0])
                      announceToScreenReader(t("settings.line_height_set", { height: value[0].toFixed(2) }), true)
                    }}
                    className="w-full"
                    aria-label={t("settings.adjust_line_height")}
                  />
                </div>

                {/* Letter Spacing Slider */}
                <div className="space-y-2">
                  <Label
                    htmlFor="letter-spacing-slider"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Text className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>
                      {t("settings.letter_spacing")}: {preferences.letterSpacing?.toFixed(2)}em
                    </span>
                  </Label>
                  <Slider
                    id="letter-spacing-slider"
                    min={0.0}
                    max={0.1}
                    step={0.005}
                    value={[preferences.letterSpacing || 0]} // Default to 0 if undefined
                    onValueChange={(value) => {
                      updatePreference("letterSpacing", value[0])
                      announceToScreenReader(t("settings.letter_spacing_set", { spacing: value[0].toFixed(2) }), true)
                    }}
                    className="w-full"
                    aria-label={t("settings.adjust_letter_spacing")}
                  />
                </div>

                {/* Text Alignment Radio Group */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <AlignLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span>{t("settings.text_alignment")}</span>
                  </Label>
                  <RadioGroup
                    value={preferences.textAlignment || "left"} // Default to "left" if undefined
                    onValueChange={(value) => {
                      updatePreference("textAlignment", value)
                      announceToScreenReader(t("settings.text_alignment_set", { alignment: value }), true)
                    }}
                    className="flex gap-4"
                    aria-label={t("settings.select_text_alignment")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="align-left" aria-label={t("settings.align_left")} />
                      <Label htmlFor="align-left">
                        <AlignLeft className="h-5 w-5" />
                        <span className="sr-only">{t("settings.align_left")}</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="center" id="align-center" aria-label={t("settings.align_center")} />
                      <Label htmlFor="align-center">
                        <AlignCenter className="h-5 w-5" />
                        <span className="sr-only">{t("settings.align_center")}</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="align-right" aria-label={t("settings.align_right")} />
                      <Label htmlFor="align-right">
                        <AlignRight className="h-5 w-5" />
                        <span className="sr-only">{t("settings.align_right")}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  <Button
                    variant="outline"
                    className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 border-red-200/50 dark:border-red-800/50"
                    onClick={handleReset}
                    aria-label={t("settings.reset_all_settings")}
                  >
                    {t("settings.reset_all_settings")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
