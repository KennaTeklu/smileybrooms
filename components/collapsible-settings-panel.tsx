"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronLeft, ZoomIn, ZoomOut, RefreshCw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"

export default function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [saturation, setSaturation] = useState(1)
  const [motionReduced, setMotionReduced] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)
  const [cursorSize, setCursorSize] = useState(1)
  const [soundEffects, setSoundEffects] = useState(false)
  const [keyboardMode, setKeyboardMode] = useState(false)
  const [focusIndicators, setFocusIndicators] = useState(false)
  const [activeTab, setActiveTab] = useState("vision")
  const { theme, setTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)

  useClickOutside(panelRef, () => {
    if (isOpen) setIsOpen(false)
  })

  // Apply font size to body
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-font-scale", fontSize.toString())
    }
  }, [fontSize])

  // Apply contrast and saturation
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-contrast", contrast.toString())
      document.documentElement.style.setProperty("--accessibility-saturation", saturation.toString())
    }
  }, [contrast, saturation])

  // Apply high contrast mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }
    }
  }, [highContrast])

  // Apply dyslexic font
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (dyslexicFont) {
        document.body.classList.add("dyslexic-font")
      } else {
        document.body.classList.remove("dyslexic-font")
      }
    }
  }, [dyslexicFont])

  // Apply motion reduction
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (motionReduced) {
        document.body.classList.add("motion-reduced")
      } else {
        document.body.classList.remove("motion-reduced")
      }
    }
  }, [motionReduced])

  // Apply keyboard mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (keyboardMode) {
        document.body.classList.add("keyboard-mode")
      } else {
        document.body.classList.remove("keyboard-mode")
      }
    }
  }, [keyboardMode])

  // Apply focus indicators
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (focusIndicators) {
        document.body.classList.add("focus-indicators")
      } else {
        document.body.classList.remove("focus-indicators")
      }
    }
  }, [focusIndicators])

  // Apply cursor size
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accessibility-cursor-scale", cursorSize.toString())
    }
  }, [cursorSize])

  return (
    <motion.div
      className={cn("fixed z-50", isOpen ? "top-0 left-0 h-full w-full sm:w-auto sm:h-auto" : "bottom-4 left-4")}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={panelRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg rounded-r-2xl overflow-hidden flex h-full sm:h-[80vh] w-full sm:w-72 md:w-80 lg:w-96 border-r-2 border-t-2 border-b-2 border-blue-200/50 dark:border-blue-800/50"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)",
            }}
          >
            <div className="w-full max-h-full overflow-y-auto p-4">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-5 border-b border-blue-500/20 flex items-center justify-between -mx-4 -mt-4 mb-4 rounded-tr-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Accessibility</h2>
                    <p className="text-blue-100 text-sm">Customize your experience</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-xl h-9 w-9"
                  aria-label="Close accessibility settings"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="vision" aria-label="Vision settings">
                    Vision
                  </TabsTrigger>
                  <TabsTrigger value="motion" aria-label="Motion settings">
                    Motion
                  </TabsTrigger>
                  <TabsTrigger value="input" aria-label="Input settings">
                    Input
                  </TabsTrigger>
                  <TabsTrigger value="share" aria-label="Share settings">
                    Share
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="vision" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="font-size">Text Size</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFontSize(Math.max(0.8, fontSize - 0.1))}
                          aria-label="Decrease text size"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
                          aria-label="Increase text size"
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
                    />
                    <p className="text-xs text-muted-foreground text-right">{Math.round(fontSize * 100)}%</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrast">Contrast</Label>
                    <Slider
                      id="contrast"
                      value={[contrast * 100]}
                      min={75}
                      max={150}
                      step={5}
                      onValueChange={(value) => setContrast(value[0] / 100)}
                    />
                    <p className="text-xs text-muted-foreground text-right">{Math.round(contrast * 100)}%</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saturation">Saturation</Label>
                    <Slider
                      id="saturation"
                      value={[saturation * 100]}
                      min={0}
                      max={200}
                      step={5}
                      onValueChange={(value) => setSaturation(value[0] / 100)}
                    />
                    <p className="text-xs text-muted-foreground text-right">{Math.round(saturation * 100)}%</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-xs text-muted-foreground">Increase text/background contrast</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={highContrast}
                      onCheckedChange={setHighContrast}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dyslexic-font">Dyslexia Friendly</Label>
                      <p className="text-xs text-muted-foreground">Use dyslexia-friendly font</p>
                    </div>
                    <Switch
                      id="dyslexic-font"
                      checked={dyslexicFont}
                      onCheckedChange={setDyslexicFont}
                      aria-label="Toggle dyslexia friendly font"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Switch between light and dark</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="motion" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reduce-motion">Reduce Motion</Label>
                      <p className="text-xs text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch
                      id="reduce-motion"
                      checked={motionReduced}
                      onCheckedChange={setMotionReduced}
                      aria-label="Toggle reduce motion"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-effects">Sound Effects</Label>
                      <p className="text-xs text-muted-foreground">Enable interface sounds</p>
                    </div>
                    <Switch
                      id="sound-effects"
                      checked={soundEffects}
                      onCheckedChange={setSoundEffects}
                      aria-label="Toggle sound effects"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="input" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cursor-size">Cursor Size</Label>
                    <Slider
                      id="cursor-size"
                      value={[cursorSize * 100]}
                      min={100}
                      max={200}
                      step={10}
                      onValueChange={(value) => setCursorSize(value[0] / 100)}
                    />
                    <p className="text-xs text-muted-foreground text-right">{Math.round(cursorSize * 100)}%</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="keyboard-mode">Keyboard Navigation</Label>
                      <p className="text-xs text-muted-foreground">Optimize for keyboard use</p>
                    </div>
                    <Switch
                      id="keyboard-mode"
                      checked={keyboardMode}
                      onCheckedChange={setKeyboardMode}
                      aria-label="Toggle keyboard navigation"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="focus-indicators">Focus Indicators</Label>
                      <p className="text-xs text-muted-foreground">Highlight focused elements</p>
                    </div>
                    <Switch
                      id="focus-indicators"
                      checked={focusIndicators}
                      onCheckedChange={setFocusIndicators}
                      aria-label="Toggle focus indicators"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="share" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="quick-share">Quick Share</Label>
                        <p className="text-xs text-muted-foreground">Share this page with others</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: document.title,
                              url: window.location.href,
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.href)
                          }
                        }}
                        aria-label="Share page"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="copy-link">Copy Link</Label>
                        <p className="text-xs text-muted-foreground">Copy page URL to clipboard</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href)
                        }}
                        aria-label="Copy link"
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setFontSize(1)
                    setContrast(1)
                    setSaturation(1)
                    setMotionReduced(false)
                    setHighContrast(false)
                    setDyslexicFont(false)
                    setCursorSize(1)
                    setSoundEffects(false)
                    setKeyboardMode(false)
                    setFocusIndicators(false)
                  }}
                  aria-label="Reset all accessibility settings"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset All Settings
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex items-center justify-center p-3 bg-white dark:bg-gray-900",
              "rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open accessibility settings"
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
