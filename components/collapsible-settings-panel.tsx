"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronLeft, Palette, Accessibility, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

interface CollapsibleSettingsPanelProps {
  onClose?: () => void
}

export function CollapsibleSettingsPanel({ onClose }: CollapsibleSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded when rendered by parent
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicks outside the panel to collapse it
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
    <div ref={panelRef} className="fixed top-[50px] left-[50px] z-[998] flex">
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
              {/* Theme Selection */}
              <div className="space-y-2">
                <Label htmlFor="theme-select" className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4" />
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme-select" className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accessibility Options */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Accessibility className="h-4 w-4" />
                  Accessibility
                </Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <Switch id="high-contrast" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text">Larger Text</Label>
                  <Switch id="large-text" />
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4" />
                  Notifications
                </Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch id="push-notifications" />
                </div>
              </div>

              {/* Volume Slider (Example) */}
              <div className="space-y-2">
                <Label htmlFor="volume-slider" className="flex items-center gap-2 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  Volume
                </Label>
                <Slider id="volume-slider" defaultValue={[50]} max={100} step={1} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSettingsPanel
