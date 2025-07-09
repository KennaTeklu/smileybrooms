"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronRight, Palette, Moon, Contrast, Text, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function CollapsibleSettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [volume, setVolume] = useState(50)
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    // Load settings from localStorage
    setDarkMode(localStorage.getItem("darkMode") === "true")
    setHighContrast(localStorage.getItem("highContrast") === "true")
    setFontSize(Number.parseInt(localStorage.getItem("fontSize") || "16"))
    setVolume(Number.parseInt(localStorage.getItem("volume") || "50"))
  }, [])

  // Apply settings and save to localStorage
  useEffect(() => {
    if (!isMounted) return
    document.documentElement.classList.toggle("dark", darkMode)
    document.documentElement.classList.toggle("high-contrast", highContrast)
    document.documentElement.style.fontSize = `${fontSize}px`
    // For volume, you'd typically integrate with an audio player or global audio settings
    // For now, it's just a state variable.
    localStorage.setItem("darkMode", String(darkMode))
    localStorage.setItem("highContrast", String(highContrast))
    localStorage.setItem("fontSize", String(fontSize))
    localStorage.setItem("volume", String(volume))
  }, [darkMode, highContrast, fontSize, volume, isMounted])

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

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  return (
    <div ref={panelRef} className="flex">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded-settings"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-r-lg shadow-lg overflow-hidden border-r border-t border-b border-gray-200 dark:border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse settings panel"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              {/* Theme Settings */}
              <div>
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Theme
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" /> Dark Mode
                    </Label>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="flex items-center gap-2">
                      <Contrast className="h-4 w-4" /> High Contrast
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={highContrast}
                      onCheckedChange={setHighContrast}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Text className="h-4 w-4" /> Font Size
                </h3>
                <div className="flex items-center gap-4">
                  <Slider
                    min={12}
                    max={20}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(val) => setFontSize(val[0])}
                    className="w-full"
                    aria-label="Font size slider"
                  />
                  <span className="text-sm font-medium w-8 text-right">{fontSize}px</span>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" /> Volume
                </h3>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[volume]}
                    onValueChange={(val) => setVolume(val[0])}
                    className="w-full"
                    aria-label="Volume slider"
                  />
                  <span className="text-sm font-medium w-8 text-right">{volume}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed-settings"
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
            aria-label="Open settings panel"
          >
            <Settings className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
