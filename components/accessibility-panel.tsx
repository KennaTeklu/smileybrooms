"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import { Settings, ChevronLeft, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"

export default function AccessibilityPanel() {
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
  const [scrollY, setScrollY] = useState(0)
  const { theme, setTheme } = useTheme()

  const panelRef = useRef<HTMLDivElement>(null)

  // Smooth scroll position with spring physics
  const smoothScrollY = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  // Track scroll position with smooth animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      smoothScrollY.set(window.scrollY)
    }

    // Use passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial position setting
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [smoothScrollY])

  // Close panel when clicking outside
  useClickOutside(panelRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
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
      className="fixed left-0 z-50"
      style={{
        top: scrollY > 100 ? "auto" : "50%",
        bottom: scrollY > 100 ? "20px" : "auto",
        y: scrollY > 100 ? 0 : "-50%",
        transition: "top 0.3s ease, bottom 0.3s ease, transform 0.3s ease",
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={panelRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-r-lg overflow-hidden flex"
          >
            <div className="w-72 sm:w-80 max-h-[80vh] overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Accessibility
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <Tabs defaultValue="vision" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="vision">Vision</TabsTrigger>
                  <TabsTrigger value="motion">Motion</TabsTrigger>
                  <TabsTrigger value="input">Input</TabsTrigger>
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
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
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
                    <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dyslexic-font">Dyslexia Friendly</Label>
                      <p className="text-xs text-muted-foreground">Use dyslexia-friendly font</p>
                    </div>
                    <Switch id="dyslexic-font" checked={dyslexicFont} onCheckedChange={setDyslexicFont} />
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
                    />
                  </div>
                </TabsContent>

                <TabsContent value="motion" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reduce-motion">Reduce Motion</Label>
                      <p className="text-xs text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch id="reduce-motion" checked={motionReduced} onCheckedChange={setMotionReduced} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-effects">Sound Effects</Label>
                      <p className="text-xs text-muted-foreground">Enable interface sounds</p>
                    </div>
                    <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
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
                    <Switch id="keyboard-mode" checked={keyboardMode} onCheckedChange={setKeyboardMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="focus-indicators">Focus Indicators</Label>
                      <p className="text-xs text-muted-foreground">Highlight focused elements</p>
                    </div>
                    <Switch id="focus-indicators" checked={focusIndicators} onCheckedChange={setFocusIndicators} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
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
