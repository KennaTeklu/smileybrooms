"use client"

import { useState, useRef, useEffect } from "react" // Added useEffect
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Palette, Accessibility, Text, Languages, X } from "lucide-react"
import { useAccessibility } from "@/lib/accessibility-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { usePanelControl } from "@/contexts/panel-control-context" // Import usePanelControl
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { CollapsibleSharePanel } from "@/components/collapsible-share-panel"
import { CollapsibleChatbotPanel } from "@/components/collapsible-chatbot-panel"

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const { registerPanel, unregisterPanel } = usePanelControl() // Use the panel control hook

  // Register panel setter with the context
  useEffect(() => {
    const unregister = registerPanel("settings-panel", setIsOpen)
    return () => unregisterPanel("settings-panel")
  }, [registerPanel, unregisterPanel])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Don't close if the click was on the button itself
    }
    setIsOpen(false)
  })

  useKeyboardShortcuts({
    "alt+s": () => setIsOpen((prev) => !prev),
    Escape: () => setIsOpen(false),
  })

  const handleReset = () => {
    resetPreferences()
  }

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ]

  const fontFamilyOptions = [
    { value: "Inter, sans-serif", label: "Default (Inter)" },
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "monospace", label: "Monospace" },
  ]

  const textAlignmentOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        className={cn(
          `fixed bottom-20 right-4 z-50 rounded-full bg-purple-600/90 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-2 border-purple-500`,
          isOpen ? "px-4 py-3 min-w-[100px] gap-2" : "w-10 h-10 p-0",
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Open settings panel"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between pr-6">
          <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close settings">
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Dark Mode</span>
            <ThemeToggle />
          </div>
          <Tabs defaultValue="accessibility" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900/70">
              <TabsTrigger
                value="accessibility"
                className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                <Accessibility className="h-4 w-4" /> Accessibility
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="flex items-center gap-2 text-purple-800 dark:text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                <Palette className="h-4 w-4" /> Display
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accessibility" className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-gray-700 dark:text-gray-300">
                  High Contrast
                </Label>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                  aria-label="Toggle high contrast mode"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="text-gray-700 dark:text-gray-300">
                  Large Text
                </Label>
                <Switch
                  id="large-text"
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => updatePreference("largeText", checked)}
                  aria-label="Toggle large text mode"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="text-gray-700 dark:text-gray-300">
                  Reduced Motion
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                  aria-label="Toggle reduced motion"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader-mode" className="text-gray-700 dark:text-gray-300">
                  Screen Reader Mode
                </Label>
                <Switch
                  id="screen-reader-mode"
                  checked={preferences.screenReaderMode}
                  onCheckedChange={(checked) => updatePreference("screenReaderMode", checked)}
                  aria-label="Toggle screen reader mode"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-navigation" className="text-gray-700 dark:text-gray-300">
                  Keyboard Navigation
                </Label>
                <Switch
                  id="keyboard-navigation"
                  checked={preferences.keyboardNavigation}
                  onCheckedChange={(checked) => updatePreference("keyboardNavigation", checked)}
                  aria-label="Toggle keyboard navigation indicators"
                />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              <Button
                onClick={handleReset}
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                aria-label="Reset all accessibility settings"
              >
                Reset All Settings
              </Button>
            </TabsContent>

            <TabsContent value="display" className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="text-alignment" className="mb-2 block text-gray-700 dark:text-gray-300">
                  <Text className="mr-2 inline-block h-4 w-4" /> Text Alignment
                </Label>
                <Select
                  value={preferences.textAlignment}
                  onValueChange={(value: "left" | "center" | "right" | "justify") =>
                    updatePreference("textAlignment", value)
                  }
                >
                  <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    {textAlignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-family" className="mb-2 block text-gray-700 dark:text-gray-300">
                  <Text className="mr-2 inline-block h-4 w-4" /> Font Family
                </Label>
                <Select
                  value={preferences.fontFamily}
                  onValueChange={(value: string) => updatePreference("fontFamily", value)}
                >
                  <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    {fontFamilyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block text-gray-700 dark:text-gray-300">
                  <Languages className="mr-2 inline-block h-4 w-4" /> Language
                </Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value: string) => updatePreference("language", value)}
                >
                  <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Share Options</span>
            <CollapsibleSharePanel />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Chatbot</span>
            <CollapsibleChatbotPanel />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
