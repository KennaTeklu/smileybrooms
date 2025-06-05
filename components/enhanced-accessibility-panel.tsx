"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large"
  contrast: "normal" | "high"
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  colorBlindness: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  textSpacing: "normal" | "increased"
  cursorSize: "small" | "normal" | "large" | "extra-large"
  autoScroll: boolean
  readingGuide: boolean
  dyslexiaFont: boolean
}

const EnhancedAccessibilityPanel = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: "medium",
    contrast: "normal",
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindness: "none",
    textSpacing: "normal",
    cursorSize: "normal",
    autoScroll: false,
    readingGuide: false,
    dyslexiaFont: false,
  })

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">General</h4>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select value={settings.fontSize} onValueChange={(value) => updateSetting("fontSize", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Contrast</Label>
          <Select value={settings.contrast} onValueChange={(value) => updateSetting("contrast", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-motion">Reduced Motion</Label>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="screen-reader">Screen Reader Mode</Label>
          <Switch
            id="screen-reader"
            checked={settings.screenReader}
            onCheckedChange={(checked) => updateSetting("screenReader", checked)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Navigation</h4>

        <div className="flex items-center justify-between">
          <Label htmlFor="keyboard-navigation">Keyboard Navigation</Label>
          <Switch
            id="keyboard-navigation"
            checked={settings.keyboardNavigation}
            onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="focus-indicators">Focus Indicators</Label>
          <Switch
            id="focus-indicators"
            checked={settings.focusIndicators}
            onCheckedChange={(checked) => updateSetting("focusIndicators", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-scroll">Auto Scroll</Label>
          <Switch
            id="auto-scroll"
            checked={settings.autoScroll}
            onCheckedChange={(checked) => updateSetting("autoScroll", checked)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Visual Assistance</h4>

        <div className="space-y-2">
          <Label>Color Blindness Support</Label>
          <Select value={settings.colorBlindness} onValueChange={(value) => updateSetting("colorBlindness", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="protanopia">Protanopia</SelectItem>
              <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
              <SelectItem value="tritanopia">Tritanopia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cursor Size</Label>
          <Select value={settings.cursorSize} onValueChange={(value) => updateSetting("cursorSize", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="extra-large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reading-guide">Reading Guide</Label>
          <Switch
            id="reading-guide"
            checked={settings.readingGuide}
            onCheckedChange={(checked) => updateSetting("readingGuide", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
          <Switch
            id="dyslexia-font"
            checked={settings.dyslexiaFont}
            onCheckedChange={(checked) => updateSetting("dyslexiaFont", checked)}
          />
        </div>
      </div>
    </div>
  )
}

export default EnhancedAccessibilityPanel
