"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Accessibility,
  Palette,
  Text,
  MousePointer2,
  Keyboard,
  Volume2,
  Lightbulb,
  Eye,
  RefreshCcw,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function AccessibilityPage() {
  const { toast } = useToast()
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [highlightLinks, setHighlightLinks] = useState(false)
  const [disableAnimations, setDisableAnimations] = useState(false)
  const [readingMask, setReadingMask] = useState(false)
  const [readingGuide, setReadingGuide] = useState(false)
  const [cursorSize, setCursorSize] = useState(1)
  const [textSpacing, setTextSpacing] = useState(1)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [voiceCommands, setVoiceCommands] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  const applySettings = () => {
    // Apply settings to the document or context
    document.documentElement.style.setProperty("--font-size-base", `${fontSize}px`)
    document.documentElement.style.setProperty("--text-spacing", `${textSpacing}em`)
    document.documentElement.style.setProperty("--line-height", `${lineHeight}`)

    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (largeText) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }

    if (highlightLinks) {
      document.documentElement.classList.add("highlight-links")
    } else {
      document.documentElement.classList.remove("highlight-links")
    }

    if (disableAnimations) {
      document.documentElement.classList.add("disable-animations")
    } else {
      document.documentElement.classList.remove("disable-animations")
    }

    if (readingMask) {
      document.documentElement.classList.add("reading-mask")
    } else {
      document.documentElement.classList.remove("reading-mask")
    }

    if (readingGuide) {
      document.documentElement.classList.add("reading-guide")
    } else {
      document.documentElement.classList.remove("reading-guide")
    }

    // Cursor size, keyboard navigation, voice commands, screen reader would require more complex implementations
    // For demonstration, we'll just show a toast.

    toast({
      title: "Accessibility Settings Applied",
      description: "Your preferences have been updated.",
    })
  }

  const resetSettings = () => {
    setFontSize(16)
    setTextSpacing(1)
    setLineHeight(1.5)
    setHighContrast(false)
    setLargeText(false)
    setHighlightLinks(false)
    setDisableAnimations(false)
    setReadingMask(false)
    setReadingGuide(false)
    setCursorSize(1)
    setKeyboardNavigation(false)
    setVoiceCommands(false)
    setScreenReader(false)

    // Reset styles
    document.documentElement.style.removeProperty("--font-size-base")
    document.documentElement.style.removeProperty("--text-spacing")
    document.documentElement.style.removeProperty("--line-height")
    document.documentElement.classList.remove(
      "high-contrast",
      "large-text",
      "highlight-links",
      "disable-animations",
      "reading-mask",
      "reading-guide",
    )

    toast({
      title: "Accessibility Settings Reset",
      description: "All preferences have been reverted to default.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Accessibility className="h-6 w-6" />
            Accessibility Settings
          </CardTitle>
          <CardDescription>Customize your browsing experience for better accessibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Visual Adjustments */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visual Adjustments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  High Contrast
                </Label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="flex items-center gap-2">
                  <Text className="h-5 w-5" />
                  Large Text
                </Label>
                <Switch id="large-text" checked={largeText} onCheckedChange={setLargeText} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-links" className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Highlight Links
                </Label>
                <Switch id="highlight-links" checked={highlightLinks} onCheckedChange={setHighlightLinks} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="disable-animations" className="flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5" />
                  Disable Animations
                </Label>
                <Switch id="disable-animations" checked={disableAnimations} onCheckedChange={setDisableAnimations} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reading-mask" className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Reading Mask
                </Label>
                <Switch id="reading-mask" checked={readingMask} onCheckedChange={setReadingMask} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reading-guide" className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Reading Guide
                </Label>
                <Switch id="reading-guide" checked={readingGuide} onCheckedChange={setReadingGuide} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-size" className="flex items-center gap-2">
                <Text className="h-5 w-5" />
                Font Size: {fontSize}px
              </Label>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={(val) => setFontSize(val[0])}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-spacing" className="flex items-center gap-2">
                <Text className="h-5 w-5" />
                Text Spacing: {textSpacing.toFixed(1)}em
              </Label>
              <Slider
                id="text-spacing"
                min={0.5}
                max={2}
                step={0.1}
                value={[textSpacing]}
                onValueChange={(val) => setTextSpacing(val[0])}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line-height" className="flex items-center gap-2">
                <Text className="h-5 w-5" />
                Line Height: {lineHeight.toFixed(1)}
              </Label>
              <Slider
                id="line-height"
                min={1}
                max={2.5}
                step={0.1}
                value={[lineHeight]}
                onValueChange={(val) => setLineHeight(val[0])}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cursor-size" className="flex items-center gap-2">
                <MousePointer2 className="h-5 w-5" />
                Cursor Size: {cursorSize.toFixed(1)}x
              </Label>
              <Slider
                id="cursor-size"
                min={0.5}
                max={2}
                step={0.1}
                value={[cursorSize]}
                onValueChange={(val) => setCursorSize(val[0])}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Interaction Adjustments */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Interaction Adjustments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-navigation" className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Navigation
                </Label>
                <Switch id="keyboard-navigation" checked={keyboardNavigation} onCheckedChange={setKeyboardNavigation} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-commands" className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Voice Commands
                </Label>
                <Switch id="voice-commands" checked={voiceCommands} onCheckedChange={setVoiceCommands} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Screen Reader
                </Label>
                <Switch id="screen-reader" checked={screenReader} onCheckedChange={setScreenReader} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={resetSettings}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={applySettings}>Apply Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
