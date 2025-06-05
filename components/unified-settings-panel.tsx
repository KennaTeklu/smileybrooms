"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Settings, Monitor, Accessibility, Palette, Keyboard, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/lib/accessibility-context"

export function UnifiedSettingsPanel() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("display")
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

  // Local state for additional settings
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [cursorSize, setCursorSize] = useState(100)

  // Apply settings to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--font-scale", (fontSize / 100).toString())
      document.documentElement.style.setProperty("--contrast-scale", (contrast / 100).toString())
      document.documentElement.style.setProperty("--saturation-scale", (saturation / 100).toString())
      document.documentElement.style.setProperty("--cursor-scale", (cursorSize / 100).toString())
    }
  }, [fontSize, contrast, saturation, cursorSize])

  const resetAllSettings = () => {
    setFontSize(100)
    setContrast(100)
    setSaturation(100)
    setCursorSize(100)
    setTheme("light") // Reset to light mode
    resetPreferences()
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              Settings & Accessibility
            </DrawerTitle>
          </DrawerHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="display">
                <Monitor className="h-4 w-4 mr-2" />
                Display
              </TabsTrigger>
              <TabsTrigger value="accessibility">
                <Accessibility className="h-4 w-4 mr-2" />
                Access
              </TabsTrigger>
              <TabsTrigger value="interface">
                <Palette className="h-4 w-4 mr-2" />
                Interface
              </TabsTrigger>
              <TabsTrigger value="controls">
                <Keyboard className="h-4 w-4 mr-2" />
                Controls
              </TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Theme Selection */}
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Text Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}%</span>
                </div>
                <Slider
                  id="font-size"
                  value={[fontSize]}
                  min={75}
                  max={150}
                  step={5}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contrast">Contrast</Label>
                  <span className="text-sm text-muted-foreground">{contrast}%</span>
                </div>
                <Slider
                  id="contrast"
                  value={[contrast]}
                  min={75}
                  max={150}
                  step={5}
                  onValueChange={(value) => setContrast(value[0])}
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="saturation">Color Saturation</Label>
                  <span className="text-sm text-muted-foreground">{saturation}%</span>
                </div>
                <Slider
                  id="saturation"
                  value={[saturation]}
                  min={0}
                  max={200}
                  step={5}
                  onValueChange={(value) => setSaturation(value[0])}
                />
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-4 max-h-[50vh] overflow-y-auto">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">Increase contrast for better readability</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                />
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text">Large Text</Label>
                  <p className="text-xs text-muted-foreground">Increase text size throughout the site</p>
                </div>
                <Switch
                  id="large-text"
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => updatePreference("largeText", checked)}
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                />
              </div>

              {/* Screen Reader */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
                  <p className="text-xs text-muted-foreground">Enhanced compatibility with screen readers</p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={preferences.screenReader}
                  onCheckedChange={(checked) => updatePreference("screenReader", checked)}
                />
              </div>
            </TabsContent>

            <TabsContent value="interface" className="space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Cursor Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cursor-size">Cursor Size</Label>
                  <span className="text-sm text-muted-foreground">{cursorSize}%</span>
                </div>
                <Slider
                  id="cursor-size"
                  value={[cursorSize]}
                  min={100}
                  max={200}
                  step={10}
                  onValueChange={(value) => setCursorSize(value[0])}
                />
              </div>

              {/* Focus Indicators */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
                  <p className="text-xs text-muted-foreground">Highlight focused elements more clearly</p>
                </div>
                <Switch
                  id="focus-indicators"
                  checked={preferences.keyboardOnly}
                  onCheckedChange={(checked) => updatePreference("keyboardOnly", checked)}
                />
              </div>

              {/* Voice Control */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-control">Voice Control</Label>
                  <p className="text-xs text-muted-foreground">Enable voice commands for navigation</p>
                </div>
                <Switch
                  id="voice-control"
                  checked={preferences.voiceControl}
                  onCheckedChange={(checked) => updatePreference("voiceControl", checked)}
                />
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
                  <p className="text-xs text-muted-foreground">Optimized for keyboard-only navigation</p>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={preferences.keyboardOnly}
                  onCheckedChange={(checked) => updatePreference("keyboardOnly", checked)}
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">Enable interface sound feedback</p>
                </div>
                <Switch id="sound-effects" checked={false} onCheckedChange={() => {}} />
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="p-3 border rounded-lg">
                <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Open Settings</span>
                    <kbd className="px-1 py-0.5 bg-muted rounded">Alt + S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Open Cart</span>
                    <kbd className="px-1 py-0.5 bg-muted rounded">Alt + C</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Go Home</span>
                    <kbd className="px-1 py-0.5 bg-muted rounded">Alt + H</kbd>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DrawerFooter>
            <Button variant="outline" onClick={resetAllSettings} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All Settings
            </Button>
            <Button onClick={() => setOpen(false)} className="w-full">
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
