"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Settings, Sun, Moon, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

interface CollapsibleSettingsPanelProps {
  onClose: () => void
}

const SETTINGS_PANEL_WIDTH = 350

export function CollapsibleSettingsPanel({ onClose }: CollapsibleSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Always expanded when rendered by parent
  const { theme, setTheme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicks outside the panel to collapse it
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
        onClose()
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
            initial={{ opacity: 0, x: -SETTINGS_PANEL_WIDTH }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -SETTINGS_PANEL_WIDTH }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-12 left-12 z-50",
              `w-[${SETTINGS_PANEL_WIDTH}px] h-[500px]`,
              "bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800",
            )}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-800">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close settings">
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2 text-base">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    aria-label="Toggle dark mode"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2 text-base">
                    <Globe className="h-5 w-5" />
                    Language
                  </Label>
                  <Select defaultValue="en" onValueChange={(value) => console.log("Language changed to:", value)}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Add more settings options here */}
                <div className="space-y-2">
                  <Label htmlFor="notifications" className="flex items-center gap-2 text-base">
                    Notifications
                  </Label>
                  <Switch id="notifications" defaultChecked aria-label="Toggle notifications" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSettingsPanel
