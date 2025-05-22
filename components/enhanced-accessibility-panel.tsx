"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ZoomIn, ZoomOut, Type, Contrast, MousePointer, Mic, Volume2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedAccessibilityPanelProps {
  className?: string
}

export function EnhancedAccessibilityPanel({ className }: EnhancedAccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [cursorSize, setCursorSize] = useState(16)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const applyFontSize = (size: number) => {
    document.documentElement.style.setProperty("--font-size-multiplier", `${size / 100}`)
    setFontSize(size)
  }

  const applyContrast = (value: number) => {
    document.documentElement.style.setProperty("--contrast-multiplier", `${value / 100}`)
    setContrast(value)
  }

  const toggleReducedMotion = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }
    setReducedMotion(checked)
  }

  const toggleHighContrast = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    setHighContrast(checked)
  }

  const toggleScreenReader = (checked: boolean) => {
    // This would integrate with actual screen reader APIs in a real implementation
    setScreenReader(checked)
  }

  const applyCursorSize = (size: number) => {
    document.documentElement.style.setProperty("--cursor-size", `${size}px`)
    setCursorSize(size)
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {isOpen ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Accessibility Options</h2>
            <Button variant="ghost" size="icon" onClick={togglePanel}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Font Size
                </Label>
                <span className="text-sm">{fontSize}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[fontSize]}
                  min={75}
                  max={200}
                  step={5}
                  onValueChange={(value) => applyFontSize(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast
                </Label>
                <span className="text-sm">{contrast}%</span>
              </div>
              <Slider
                value={[contrast]}
                min={75}
                max={125}
                step={5}
                onValueChange={(value) => applyContrast(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Cursor Size
                </Label>
                <span className="text-sm">{cursorSize}px</span>
              </div>
              <Slider
                value={[cursorSize]}
                min={16}
                max={64}
                step={4}
                onValueChange={(value) => applyCursorSize(value[0])}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  Reduced Motion
                </Label>
                <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                  <EyeOff className="h-4 w-4" />
                  High Contrast
                </Label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="flex items-center gap-2 cursor-pointer">
                  <Volume2 className="h-4 w-4" />
                  Screen Reader
                </Label>
                <Switch id="screen-reader" checked={screenReader} onCheckedChange={toggleScreenReader} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={togglePanel}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          aria-label="Accessibility Options"
        >
          <Mic className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

export default EnhancedAccessibilityPanel
