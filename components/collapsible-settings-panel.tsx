"use client"

import { useState } from "react"
import { Settings, X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useAccessibility } from "@/hooks/use-accessibility"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CollapsibleSettingsPanel() {
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  const panelVariants = {
    hidden: { opacity: 0, x: "-100%", scale: 0.8, originX: 0, originY: 1 },
    visible: { opacity: 1, x: "0%", scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: "-100%", scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close settings panel" : "Open settings panel"}
            >
              {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{isOpen ? "Close Settings" : "Open Settings"}</TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mt-4 w-full max-w-[90vw] sm:max-w-md h-[80vh] flex flex-col rounded-xl border bg-background shadow-lg overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
            >
              <Card className="flex flex-col flex-1 rounded-xl border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-purple-500" /> Accessibility Settings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close settings panel"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto space-y-6">
                  {/* Theme Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="theme-preference" className="text-base font-semibold">
                      Theme Preference
                    </Label>
                    <RadioGroup
                      id="theme-preference"
                      value={preferences.prefersDarkTheme ? "dark" : preferences.prefersLightTheme ? "light" : "system"}
                      onValueChange={(value) => {
                        updatePreference("prefersDarkTheme", value === "dark")
                        updatePreference("prefersLightTheme", value === "light")
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="text-base font-semibold">
                      High Contrast Mode
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={preferences.highContrast}
                      onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                    />
                  </div>

                  {/* Large Text */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="large-text" className="text-base font-semibold">
                      Large Text
                    </Label>
                    <Switch
                      id="large-text"
                      checked={preferences.largeText}
                      onCheckedChange={(checked) => updatePreference("largeText", checked)}
                    />
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduced-motion" className="text-base font-semibold">
                      Reduced Motion
                    </Label>
                    <Switch
                      id="reduced-motion"
                      checked={preferences.reducedMotion}
                      onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                    />
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keyboard-navigation" className="text-base font-semibold">
                      Keyboard Navigation
                    </Label>
                    <Switch
                      id="keyboard-navigation"
                      checked={preferences.keyboardNavigation}
                      onCheckedChange={(checked) => updatePreference("keyboardNavigation", checked)}
                    />
                  </div>

                  <Separator />

                  {/* Text Alignment */}
                  <div className="space-y-2">
                    <Label htmlFor="text-alignment" className="text-base font-semibold">
                      Text Alignment
                    </Label>
                    <RadioGroup
                      id="text-alignment"
                      value={preferences.textAlign}
                      onValueChange={(value) => updatePreference("textAlign", value as "left" | "center" | "right")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="align-left" />
                        <Label htmlFor="align-left">Left</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="center" id="align-center" />
                        <Label htmlFor="align-center">Center</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="align-right" />
                        <Label htmlFor="align-right">Right</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label htmlFor="font-family" className="text-base font-semibold">
                      Font Family
                    </Label>
                    <RadioGroup
                      id="font-family"
                      value={preferences.fontFamily}
                      onValueChange={(value) => updatePreference("fontFamily", value as "sans" | "serif" | "mono")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sans" id="font-sans" />
                        <Label htmlFor="font-sans">Sans-serif</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="serif" id="font-serif" />
                        <Label htmlFor="font-serif">Serif</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mono" id="font-mono" />
                        <Label htmlFor="font-mono">Monospace</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Line Height */}
                  <div className="space-y-2">
                    <Label htmlFor="line-height" className="text-base font-semibold">
                      Line Height
                    </Label>
                    <Slider
                      id="line-height"
                      min={1}
                      max={2}
                      step={0.1}
                      value={[preferences.lineHeight]}
                      onValueChange={(value) => updatePreference("lineHeight", value[0])}
                      className="w-full"
                    />
                    <div className="text-right text-sm text-muted-foreground">{preferences.lineHeight.toFixed(1)}x</div>
                  </div>

                  {/* Letter Spacing */}
                  <div className="space-y-2">
                    <Label htmlFor="letter-spacing" className="text-base font-semibold">
                      Letter Spacing
                    </Label>
                    <Slider
                      id="letter-spacing"
                      min={0}
                      max={0.1}
                      step={0.01}
                      value={[preferences.letterSpacing]}
                      onValueChange={(value) => updatePreference("letterSpacing", value[0])}
                      className="w-full"
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {preferences.letterSpacing.toFixed(2)}em
                    </div>
                  </div>

                  <Separator />

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                    onClick={resetPreferences}
                  >
                    Reset All Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
