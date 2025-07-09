"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronRight, Sun, Moon, Palette, TextIcon as TextSize, Contrast, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/lib/accessibility-context"

export function CollapsibleSettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("display")
  const panelRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    grayscale,
    toggleGrayscale,
    invertColors,
    toggleInvertColors,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    animations,
    toggleAnimations,
    screenReaderMode,
    toggleScreenReaderMode,
    linkHighlight,
    toggleLinkHighlight,
  } = useAccessibility()

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 p-2">
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              </TabsList>
              <div className="p-4 flex-1 overflow-auto">
                <TabsContent value="display" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        Dark Mode
                      </Label>
                      <Switch
                        id="theme-toggle"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-size" className="flex items-center gap-2">
                        <TextSize className="h-4 w-4" />
                        Font Size ({fontSize}%)
                      </Label>
                      <Slider
                        id="font-size"
                        min={80}
                        max={150}
                        step={5}
                        value={[fontSize]}
                        onValueChange={([value]) => setFontSize(value)}
                        className="w-[80%]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="line-height" className="flex items-center gap-2">
                        <TextSize className="h-4 w-4" />
                        Line Height ({lineHeight.toFixed(1)})
                      </Label>
                      <Slider
                        id="line-height"
                        min={1.0}
                        max={2.0}
                        step={0.1}
                        value={[lineHeight]}
                        onValueChange={([value]) => setLineHeight(value)}
                        className="w-[80%]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="letter-spacing" className="flex items-center gap-2">
                        <TextSize className="h-4 w-4" />
                        Letter Spacing ({letterSpacing.toFixed(2)}em)
                      </Label>
                      <Slider
                        id="letter-spacing"
                        min={0}
                        max={0.1}
                        step={0.01}
                        value={[letterSpacing]}
                        onValueChange={([value]) => setLetterSpacing(value)}
                        className="w-[80%]"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="accessibility" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast" className="flex items-center gap-2">
                        <Contrast className="h-4 w-4" />
                        High Contrast
                      </Label>
                      <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grayscale" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Grayscale
                      </Label>
                      <Switch id="grayscale" checked={grayscale} onCheckedChange={toggleGrayscale} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="invert-colors" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Invert Colors
                      </Label>
                      <Switch id="invert-colors" checked={invertColors} onCheckedChange={toggleInvertColors} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations" className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: animations ? 360 : 0 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.div>
                        Animations
                      </Label>
                      <Switch id="animations" checked={animations} onCheckedChange={toggleAnimations} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="screen-reader-mode" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Screen Reader Mode
                      </Label>
                      <Switch
                        id="screen-reader-mode"
                        checked={screenReaderMode}
                        onCheckedChange={toggleScreenReaderMode}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="link-highlight" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Link Highlight
                      </Label>
                      <Switch id="link-highlight" checked={linkHighlight} onCheckedChange={toggleLinkHighlight} />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
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
