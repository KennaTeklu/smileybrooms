"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronLeft, Sun, Moon, Globe, Palette, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

interface CollapsibleSettingsPanelProps {
  onClose?: () => void
}

export function CollapsibleSettingsPanel({ onClose }: CollapsibleSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Start expanded when rendered by parent
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicks outside the panel to collapse it
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
        onClose?.() // Call onClose when panel closes due to outside click
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
                <div className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="theme-toggle" className="text-base">
                    Dark Mode
                  </Label>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Toggle dark mode"
                />
              </div>

              <Separator />

              {/* Language Selection (Placeholder) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <Label htmlFor="language-select" className="text-base">
                    Language
                  </Label>
                </div>
                <Button variant="outline" size="sm" className="px-3 py-1 bg-transparent">
                  English
                </Button>
              </div>

              <Separator />

              {/* Accessibility Options (Placeholder) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <Label htmlFor="accessibility-options" className="text-base">
                    Accessibility
                  </Label>
                </div>
                <Button variant="outline" size="sm" className="px-3 py-1 bg-transparent">
                  Customize
                </Button>
              </div>

              <Separator />

              {/* About/Version Info (Placeholder) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <Label htmlFor="version-info" className="text-base">
                    Version
                  </Label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">1.0.0</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSettingsPanel
