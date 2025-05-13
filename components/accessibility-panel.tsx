"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility, ChevronLeft, ChevronRight, Type, Contrast, MousePointer, ZoomIn, ZoomOut } from "lucide-react"

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontScale, setFontScale] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [saturation, setSaturation] = useState(1)
  const [cursorScale, setCursorScale] = useState(1)
  const [isDyslexicFont, setIsDyslexicFont] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isMotionReduced, setIsMotionReduced] = useState(false)
  const [isFocusIndicators, setIsFocusIndicators] = useState(false)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const increaseFontSize = () => {
    const newScale = Math.min(fontScale + 0.1, 1.5)
    setFontScale(newScale)
    document.documentElement.style.setProperty("--accessibility-font-scale", newScale.toString())
  }

  const decreaseFontSize = () => {
    const newScale = Math.max(fontScale - 0.1, 0.8)
    setFontScale(newScale)
    document.documentElement.style.setProperty("--accessibility-font-scale", newScale.toString())
  }

  const increaseContrast = () => {
    const newContrast = Math.min(contrast + 0.1, 1.5)
    setContrast(newContrast)
    document.documentElement.style.setProperty("--accessibility-contrast", newContrast.toString())
  }

  const decreaseContrast = () => {
    const newContrast = Math.max(contrast - 0.1, 0.8)
    setContrast(newContrast)
    document.documentElement.style.setProperty("--accessibility-contrast", newContrast.toString())
  }

  const increaseSaturation = () => {
    const newSaturation = Math.min(saturation + 0.1, 1.5)
    setSaturation(newSaturation)
    document.documentElement.style.setProperty("--accessibility-saturation", newSaturation.toString())
  }

  const decreaseSaturation = () => {
    const newSaturation = Math.max(saturation - 0.1, 0)
    setSaturation(newSaturation)
    document.documentElement.style.setProperty("--accessibility-saturation", newSaturation.toString())
  }

  const increaseCursorSize = () => {
    const newCursorScale = Math.min(cursorScale + 0.2, 2)
    setCursorScale(newCursorScale)
    document.documentElement.style.setProperty("--accessibility-cursor-scale", newCursorScale.toString())
    document.body.classList.toggle("accessibility-cursor", newCursorScale > 1)
  }

  const decreaseCursorSize = () => {
    const newCursorScale = Math.max(cursorScale - 0.2, 1)
    setCursorScale(newCursorScale)
    document.documentElement.style.setProperty("--accessibility-cursor-scale", newCursorScale.toString())
    document.body.classList.toggle("accessibility-cursor", newCursorScale > 1)
  }

  const toggleDyslexicFont = () => {
    setIsDyslexicFont(!isDyslexicFont)
    document.body.classList.toggle("dyslexic-font", !isDyslexicFont)
  }

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast)
    document.body.classList.toggle("high-contrast", !isHighContrast)
  }

  const toggleMotionReduced = () => {
    setIsMotionReduced(!isMotionReduced)
    document.body.classList.toggle("motion-reduced", !isMotionReduced)
  }

  const toggleFocusIndicators = () => {
    setIsFocusIndicators(!isFocusIndicators)
    document.body.classList.toggle("focus-indicators", !isFocusIndicators)
  }

  const resetAll = () => {
    setFontScale(1)
    setContrast(1)
    setSaturation(1)
    setCursorScale(1)
    setIsDyslexicFont(false)
    setIsHighContrast(false)
    setIsMotionReduced(false)
    setIsFocusIndicators(false)

    document.documentElement.style.setProperty("--accessibility-font-scale", "1")
    document.documentElement.style.setProperty("--accessibility-contrast", "1")
    document.documentElement.style.setProperty("--accessibility-saturation", "1")
    document.documentElement.style.setProperty("--accessibility-cursor-scale", "1")

    document.body.classList.remove("dyslexic-font")
    document.body.classList.remove("high-contrast")
    document.body.classList.remove("motion-reduced")
    document.body.classList.remove("focus-indicators")
    document.body.classList.remove("accessibility-cursor")
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-4 z-50 rounded-full shadow-md"
        onClick={togglePanel}
        aria-label="Accessibility options"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-16 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-72 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Accessibility</h3>
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Reset All
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  Text Size
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={decreaseFontSize} aria-label="Decrease text size">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseFontSize} aria-label="Increase text size">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <Contrast className="h-4 w-4 mr-2" />
                  Contrast
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={decreaseContrast} aria-label="Decrease contrast">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseContrast} aria-label="Increase contrast">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <MousePointer className="h-4 w-4 mr-2" />
                  Cursor Size
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={decreaseCursorSize} aria-label="Decrease cursor size">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseCursorSize} aria-label="Increase cursor size">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant={isDyslexicFont ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={toggleDyslexicFont}
              >
                Dyslexia Friendly Font
              </Button>

              <Button
                variant={isHighContrast ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={toggleHighContrast}
              >
                High Contrast Mode
              </Button>

              <Button
                variant={isMotionReduced ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={toggleMotionReduced}
              >
                Reduce Motion
              </Button>

              <Button
                variant={isFocusIndicators ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={toggleFocusIndicators}
              >
                Focus Indicators
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
