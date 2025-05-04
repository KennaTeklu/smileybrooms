"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility, Type, Contrast, Keyboard, X, ZoomIn, ZoomOut, RotateCcw, Sun, Moon, Globe } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LANGUAGES, type LanguageCode, useTranslation } from "@/lib/i18n/client"

// Update the component props to include onClose
interface EnhancedAccessibilityPanelProps {
  className?: string
  onClose?: () => void
}

export default function EnhancedAccessibilityPanel({ className, onClose }: EnhancedAccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(!!onClose)

  // When onClose is provided, we're being opened externally
  // so we should hide the trigger button
  const showTriggerButton = !onClose

  const [fontSize, setFontSize] = useState(1)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [focusIndicators, setFocusIndicators] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Load saved preferences
  useEffect(() => {
    setMounted(true)
    const savedPreferences = localStorage.getItem("accessibility-preferences")

    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences)
        setFontSize(preferences.fontSize || 1)
        setLineHeight(preferences.lineHeight || 1.5)
        setLetterSpacing(preferences.letterSpacing || 0)
        setHighContrast(preferences.highContrast || false)
        setReducedMotion(preferences.reducedMotion || false)
        setFocusIndicators(preferences.focusIndicators || false)
        setDyslexicFont(preferences.dyslexicFont || false)
      } catch (e) {
        console.error("Error loading accessibility preferences:", e)
      }
    }
  }, [])

  // Apply preferences when they change
  useEffect(() => {
    if (!mounted) return

    // Apply font size
    document.documentElement.style.setProperty("--accessibility-font-scale", fontSize.toString())

    // Apply line height
    document.documentElement.style.setProperty("--accessibility-line-height", lineHeight.toString())

    // Apply letter spacing
    document.documentElement.style.setProperty("--accessibility-letter-spacing", `${letterSpacing}px`)

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }

    // Apply focus indicators
    if (focusIndicators) {
      document.documentElement.classList.add("enhanced-focus")
    } else {
      document.documentElement.classList.remove("enhanced-focus")
    }

    // Apply dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Save preferences
    const preferences = {
      fontSize,
      lineHeight,
      letterSpacing,
      highContrast,
      reducedMotion,
      focusIndicators,
      dyslexicFont,
    }

    localStorage.setItem("accessibility-preferences", JSON.stringify(preferences))
  }, [fontSize, lineHeight, letterSpacing, highContrast, reducedMotion, focusIndicators, dyslexicFont, mounted])

  const resetSettings = () => {
    setFontSize(1)
    setLineHeight(1.5)
    setLetterSpacing(0)
    setHighContrast(false)
    setReducedMotion(false)
    setFocusIndicators(false)
    setDyslexicFont(false)
  }

  // Handle close from external control
  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  if (!mounted) return null

  return (
    <>
      {showTriggerButton && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg bg-white dark:bg-gray-800"
                onClick={() => setIsOpen(true)}
                aria-label="Accessibility options"
              >
                <Accessibility className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{t("settings.accessibility")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            role="document"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="accessibility-title" className="text-lg font-semibold flex items-center">
                <Accessibility className="h-5 w-5 mr-2" />
                {t("settings.accessibility")}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label={t("common.close")}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="text" className="p-4">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="text" className="flex items-center justify-center">
                  <Type className="h-4 w-4 mr-2" />
                  <span>{t("settings.text")}</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center justify-center">
                  <Contrast className="h-4 w-4 mr-2" />
                  <span>{t("settings.visual")}</span>
                </TabsTrigger>
                <TabsTrigger value="navigation" className="flex items-center justify-center">
                  <Keyboard className="h-4 w-4 mr-2" />
                  <span>{t("settings.navigation")}</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="flex items-center justify-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{t("common.language")}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size">{t("settings.fontSize")}</Label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize(Math.max(0.8, fontSize - 0.1))}
                        aria-label={t("settings.decreaseFontSize")}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{Math.round(fontSize * 100)}%</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
                        aria-label={t("settings.increaseFontSize")}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    id="font-size"
                    value={[fontSize * 100]}
                    min={80}
                    max={150}
                    step={5}
                    onValueChange={(value) => setFontSize(value[0] / 100)}
                    aria-label={t("settings.adjustFontSize")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line-height">{t("settings.lineHeight")}</Label>
                  <Slider
                    id="line-height"
                    value={[lineHeight * 10]}
                    min={10}
                    max={25}
                    step={1}
                    onValueChange={(value) => setLineHeight(value[0] / 10)}
                    aria-label={t("settings.adjustLineHeight")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("settings.current")}: {lineHeight.toFixed(1)}x
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="letter-spacing">{t("settings.letterSpacing")}</Label>
                  <Slider
                    id="letter-spacing"
                    value={[letterSpacing + 10]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => setLetterSpacing(value[0] - 10)}
                    aria-label={t("settings.adjustLetterSpacing")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("settings.current")}: {letterSpacing > 0 ? `+${letterSpacing}` : letterSpacing}px
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dyslexic-font">{t("settings.dyslexicFont")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.dyslexicFontDescription")}</p>
                  </div>
                  <Switch
                    id="dyslexic-font"
                    checked={dyslexicFont}
                    onCheckedChange={setDyslexicFont}
                    aria-label={t("settings.toggleDyslexicFont")}
                  />
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-toggle">{t("settings.theme")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.themeDescription")}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      aria-label={t("settings.lightMode")}
                      className="flex items-center"
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      {t("settings.light")}
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      aria-label={t("settings.darkMode")}
                      className="flex items-center"
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      {t("settings.dark")}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast">{t("settings.highContrast")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.highContrastDescription")}</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                    aria-label={t("settings.toggleHighContrast")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reduced-motion">{t("settings.reducedMotion")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.reducedMotionDescription")}</p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                    aria-label={t("settings.toggleReducedMotion")}
                  />
                </div>
              </TabsContent>

              <TabsContent value="navigation" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="focus-indicators">{t("settings.enhancedFocus")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.enhancedFocusDescription")}</p>
                  </div>
                  <Switch
                    id="focus-indicators"
                    checked={focusIndicators}
                    onCheckedChange={setFocusIndicators}
                    aria-label={t("settings.toggleEnhancedFocus")}
                  />
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h3 className="text-sm font-medium mb-2">{t("settings.keyboardShortcuts")}</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>{t("settings.skipToContent")}</span>
                      <kbd className="px-2 py-1 bg-background rounded text-xs">Tab</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("settings.navigateMenu")}</span>
                      <kbd className="px-2 py-1 bg-background rounded text-xs">Tab / Shift+Tab</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("settings.activateElements")}</span>
                      <kbd className="px-2 py-1 bg-background rounded text-xs">Enter / Space</kbd>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="language" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language-select">{t("settings.selectLanguage")}</Label>
                  <Select value={locale} onValueChange={(value) => setLocale(value as LanguageCode)}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder={t("settings.selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGES).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">{t("settings.languageDescription")}</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" onClick={resetSettings} className="flex items-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("settings.resetAll")}
              </Button>
              <Button onClick={handleClose}>{t("settings.saveAndClose")}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
