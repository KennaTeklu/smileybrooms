"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronRight, Sun, Moon, Accessibility, Palette, Volume2, Keyboard } from "lucide-react"
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
  const [contrast, setContrast] = useState(50)
  const [animations, setAnimations] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
    // Initialize settings from localStorage or system preferences
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true")
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    const savedFontSize = localStorage.getItem("fontSize")
    if (savedFontSize) {
      setFontSize(Number.parseInt(savedFontSize))
    }
    const savedContrast = localStorage.getItem("contrast")
    if (savedContrast) {
      setContrast(Number.parseInt(savedContrast))
    }
    const savedAnimations = localStorage.getItem("animations")
    if (savedAnimations) {
      setAnimations(savedAnimations === "true")
    }
  }, [])

  // Apply dark mode class to body
  useEffect(() => {
    if (!isMounted) return
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", String(darkMode))
  }, [darkMode, isMounted])

  // Apply font size
  useEffect(() => {
    if (!isMounted) return
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem("fontSize", String(fontSize))
  }, [fontSize, isMounted])

  // Apply contrast (example, might need more complex CSS)
  useEffect(() => {
    if (!isMounted) return
    document.documentElement.style.filter = `contrast(${contrast / 50})`
    localStorage.setItem("contrast", String(contrast))
  }, [contrast, isMounted])

  // Apply animations preference
  useEffect(() => {
    if (!isMounted) return
    if (!animations) {
      document.documentElement.classList.add("no-animations")
    } else {
      document.documentElement.classList.remove("no-animations")
    }
    localStorage.setItem("animations", String(animations))
  }, [animations, isMounted])

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
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              {/* Theme Settings */}
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme
                </h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Dark Mode
                  </Label>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              {/* Accessibility Settings */}
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  Accessibility
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                    <Slider
                      id="font-size"
                      min={12}
                      max={20}
                      step={1}
                      value={[fontSize]}
                      onValueChange={([val]) => setFontSize(val)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                    <Slider
                      id="contrast"
                      min={0}
                      max={100}
                      step={1}
                      value={[contrast]}
                      onValueChange={([val]) => setContrast(val)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations" className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Animations
                    </Label>
                    <Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
                  </div>
                </div>
              </div>

              {/* Other Settings (Example) */}
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Other
                </h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
                  <Switch id="keyboard-nav" defaultChecked />
                </div>
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
