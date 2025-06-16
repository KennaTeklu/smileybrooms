"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  ChevronRight,
  Sun,
  Moon,
  Eye,
  ZoomIn,
  ZoomOut,
  Volume2,
  Keyboard,
  RefreshCw,
  Monitor,
  Mic,
  HelpCircle,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/lib/accessibility-context"

export function CollapsibleSettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("display")
  const [fontSize, setFontSize] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0) // New state for panel height
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreference } = useAccessibility()
  const panelRef = useRef<HTMLDivElement>(null)

  // Define configurable scroll range values
  const minTopOffset = 20 // Minimum distance from the top of the viewport
  const initialScrollOffset = 50 // How far down the panel starts relative to scroll
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Track scroll position and panel height after mounting
  useEffect(() => {
    if (!isMounted) return

    const updatePositionAndHeight = () => {
      setScrollPosition(window.scrollY)
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight)
      }
    }

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true }) // Update on resize too
    updatePositionAndHeight() // Initial call

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isExpanded]) // Recalculate height if expanded state changes

  // Handle click outside to collapse panel
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted])

  // Apply font size changes
  useEffect(() => {
    if (!isMounted) return

    document.documentElement.style.setProperty("--accessibility-font-scale", fontSize.toString())
  }, [fontSize, isMounted])

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  // Calculate panel position based on scroll and document height
  const documentHeight = document.documentElement.scrollHeight // Total scrollable height of the page
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin

  const panelTopPosition = Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))

  return (
    <div ref={panelRef} className="fixed left-0 z-50 flex" style={{ top: `${panelTopPosition}px` }}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-r-lg shadow-lg overflow-hidden border-r border-t border-b border-gray-200 dark:border-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse settings panel"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 p-2">
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>

              <div className="p-4 overflow-auto max-h-[60vh]">
                <TabsContent value="display" className="space-y-4 mt-0">
                  {/* Theme Toggle */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="flex items-center justify-center"
                      >
                        <Sun className="h-4 w-4 mr-1" /> Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="flex items-center justify-center"
                      >
                        <Moon className="h-4 w-4 mr-1" /> Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="flex items-center justify-center"
                      >
                        <Monitor className="h-4 w-4 mr-1" /> Auto
                      </Button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Font Size</label>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setFontSize(Math.max(0.8, fontSize - 0.1))}
                        >
                          <ZoomOut className="h-3 w-3" />
                        </Button>
                        <span className="text-xs w-10 text-center">{Math.round(fontSize * 100)}%</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setFontSize(Math.min(1.5, fontSize + 0.1))}
                        >
                          <ZoomIn className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Slider
                      value={[fontSize * 100]}
                      min={80}
                      max={150}
                      step={5}
                      onValueChange={(value) => setFontSize(value[0] / 100)}
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Contrast</label>
                      <span className="text-xs">{Math.round(contrast * 100)}%</span>
                    </div>
                    <Slider
                      value={[contrast * 100]}
                      min={75}
                      max={150}
                      step={5}
                      onValueChange={(value) => setContrast(value[0] / 100)}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">High Contrast</span>
                      </div>
                      <Switch
                        checked={preferences.highContrast}
                        onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-4 w-4" />
                        <span className="text-sm">Large Text</span>
                      </div>
                      <Switch
                        checked={preferences.largeText}
                        onCheckedChange={(checked) => updatePreference("largeText", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span className="text-sm">Reduced Motion</span>
                      </div>
                      <Switch
                        checked={preferences.reducedMotion}
                        onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="controls" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <span className="text-sm">Screen Reader</span>
                      </div>
                      <Switch
                        checked={preferences.screenReader}
                        onCheckedChange={(checked) => updatePreference("screenReader", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        <span className="text-sm">Keyboard Navigation</span>
                      </div>
                      <Switch
                        checked={preferences.keyboardOnly}
                        onCheckedChange={(checked) => updatePreference("keyboardOnly", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span className="text-sm">Voice Control</span>
                      </div>
                      <Switch
                        checked={preferences.voiceControl}
                        onCheckedChange={(checked) => updatePreference("voiceControl", checked)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Toggle dark mode</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded">Alt + D</kbd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Open settings</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded">Alt + S</kbd>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Toggle cart</span>
                        <kbd className="px-2 py-0.5 bg-muted rounded">Alt + C</kbd>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="space-y-4 mt-0">
                  <div className="rounded-lg border p-3">
                    <h3 className="text-sm font-medium mb-1">Accessibility Statement</h3>
                    <p className="text-xs text-muted-foreground">
                      We are committed to making our website accessible to everyone. If you experience any barriers,
                      please contact us.
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h3 className="text-sm font-medium mb-1">Need Help?</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Our support team is available to assist you with any accessibility needs.
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <HelpCircle className="h-3 w-3 mr-1" /> Contact Support
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setFontSize(1)
                  setContrast(1)
                  updatePreference("highContrast", false)
                  updatePreference("largeText", false)
                  updatePreference("reducedMotion", false)
                  updatePreference("screenReader", false)
                  updatePreference("keyboardOnly", false)
                  updatePreference("voiceControl", false)
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reset All Settings
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-r border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
