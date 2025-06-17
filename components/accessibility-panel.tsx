"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import { Settings, ChevronLeft, ZoomIn, ZoomOut, RefreshCw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useAccessibility } from "@/lib/accessibility-context"

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close accessibility settings"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <Tabs defaultValue="vision" className="w-full">
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
                          onClick={() => updatePreference("largeText", false)}
                          aria-label="Decrease text size"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updatePreference("largeText", true)}
                          aria-label="Increase text size"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      id="font-size"
                      value={[preferences.largeText ? 120 : 100]}
                      min={80}
                      max={150}
                      step={5}
                      onValueChange={(value) => updatePreference("largeText", value[0] > 100)}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {Math.round(preferences.largeText ? 120 : 100)}%
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-xs text-muted-foreground">Increase text/background contrast</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={preferences.highContrast}
                      onCheckedChange={(checked) => updatePreference("highContrast", checked)}
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
                      checked={preferences.dyslexicFont}
                      onCheckedChange={(checked) => updatePreference("dyslexicFont", checked)}
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
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light")
                        updatePreference("prefersDarkTheme", checked)
                        updatePreference("prefersLightTheme", !checked)
                      }}
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
                      checked={preferences.reducedMotion}
                      onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
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
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) => updatePreference("soundEffects", checked)}
                      aria-label="Toggle sound effects"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="input" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="keyboard-mode">Keyboard Navigation</Label>
                      <p className="text-xs text-muted-foreground">Optimize for keyboard use</p>
                    </div>
                    <Switch
                      id="keyboard-mode"
                      checked={preferences.keyboardOnly}
                      onCheckedChange={(checked) => updatePreference("keyboardOnly", checked)}
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
                      checked={preferences.focusIndicators}
                      onCheckedChange={(checked) => updatePreference("focusIndicators", checked)}
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
                  className="w-full"
                  onClick={resetPreferences}
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
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
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
