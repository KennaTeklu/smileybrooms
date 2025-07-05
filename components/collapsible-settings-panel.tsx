"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronLeft, Sun, Moon, Accessibility, Languages, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"

interface CollapsibleSettingsPanelProps {
  onClose?: () => void
}

export function CollapsibleSettingsPanel({ onClose }: CollapsibleSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isMounted, onClose])

  if (!isMounted) return null

  return (
    <div ref={panelRef} className="fixed top-[50px] left-[50px] z-[999] flex">
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
                onClick={() => {
                  setIsExpanded(false)
                  onClose?.()
                }}
                aria-label="Collapse settings panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Theme
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between">
                <Label htmlFor="language-select" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Language
                </Label>
                <Select defaultValue="en" onValueChange={(value) => console.log("Language changed to:", value)}>
                  <SelectTrigger id="language-select" className="w-[120px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-2">
                <Label htmlFor="font-size-slider" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Font Size
                </Label>
                <Slider
                  id="font-size-slider"
                  defaultValue={[100]}
                  max={200}
                  step={10}
                  onValueChange={(value) => {
                    document.documentElement.style.fontSize = `${value[0]}%`
                  }}
                  className="w-full"
                />
              </div>

              {/* Accessibility Options (Example) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast-mode" className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  High Contrast Mode
                </Label>
                <Switch
                  id="high-contrast-mode"
                  onCheckedChange={(checked) => {
                    document.documentElement.classList.toggle("high-contrast", checked)
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSettingsPanel
