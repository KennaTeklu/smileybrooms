"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronRight, Palette, Text, ZoomIn, ZoomOut, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function CollapsibleSettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [volume, setVolume] = useState(50)
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    // Initialize dark mode based on system preference or local storage
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    // Initialize font size and volume from local storage or defaults
    setFontSize(Number.parseInt(localStorage.getItem("fontSize") || "16"))
    setVolume(Number.parseInt(localStorage.getItem("volume") || "50"))
  }, [])

  // Apply dark mode class to body
  useEffect(() => {
    if (!isMounted) return
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode, isMounted])

  // Apply font size to body
  useEffect(() => {
    if (!isMounted) return
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem("fontSize", fontSize.toString())
  }, [fontSize, isMounted])

  // Apply volume (example, typically controls audio elements)
  useEffect(() => {
    if (!isMounted) return
    // This is a placeholder for actual volume control
    console.log("Volume set to:", volume)
    localStorage.setItem("volume", volume.toString())
  }, [volume, isMounted])

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

  if (!isMounted) {
    return null
  }

  return (
    <div ref={panelRef} className="relative z-50 flex">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-r-lg shadow-lg overflow-hidden border-r border-t border-b border-gray-200 dark:border-gray-800 flex flex-col"
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
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {/* Theme Toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Dark Mode
                  </Label>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Toggle between light and dark themes.</p>
              </div>

              {/* Font Size */}
              <div>
                <Label htmlFor="font-size" className="flex items-center gap-2 mb-2">
                  <Text className="h-4 w-4" />
                  Font Size
                </Label>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Slider
                    id="font-size"
                    min={12}
                    max={20}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(val) => setFontSize(val[0])}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Adjust the base font size of the text.</p>
              </div>

              {/* Volume Control */}
              <div>
                <Label htmlFor="volume" className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4" />
                  Volume
                </Label>
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[volume]}
                    onValueChange={(val) => setVolume(val[0])}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Control the application's sound volume.</p>
              </div>
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
            aria-label="Open settings panel"
          >
            <ChevronRight className="h-4 w-4" />
            <Settings className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
