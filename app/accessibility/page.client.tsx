"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useTheme } from "next-themes"

export default function AccessibilityClientPage() {
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    toggleReducedMotion,
    screenReaderMode,
    toggleScreenReaderMode,
  } = useAccessibility()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Render nothing on the server
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Accessibility Settings</h1>

      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Adjust Your Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="text-lg">
              High Contrast Mode
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-lg">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="text-lg">
              Reduce Animations
            </Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
              aria-label="Toggle reduced motion"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader-mode" className="text-lg">
              Screen Reader Mode
            </Label>
            <Switch
              id="screen-reader-mode"
              checked={screenReaderMode}
              onCheckedChange={toggleScreenReaderMode}
              aria-label="Toggle screen reader mode"
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="font-size" className="text-lg block mb-2">
              Font Size: {fontSize}px
            </Label>
            <div className="flex items-center gap-4">
              <Button onClick={() => setFontSize(Math.max(12, fontSize - 2))} aria-label="Decrease font size">
                A-
              </Button>
              <input
                id="font-size"
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary"
                aria-valuemin={12}
                aria-valuemax={24}
                aria-valuenow={fontSize}
                aria-label="Font size slider"
              />
              <Button onClick={() => setFontSize(Math.min(24, fontSize + 2))} aria-label="Increase font size">
                A+
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
        <p>These settings are saved locally in your browser.</p>
      </div>
    </div>
  )
}
