"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Settings, Palette, Accessibility, Text, Languages } from "lucide-react"
import { useAccessibility } from "@/lib/accessibility-context"

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

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
    <div className="fixed left-4 top-1/2 z-50 -translate-y-1/2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-purple-600/90 text-white shadow-lg hover:bg-purple-700 hover:text-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={() => setIsOpen(true)}
        aria-label="Open settings panel"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-md border-r border-purple-700 bg-purple-900/95 p-6 text-white shadow-2xl backdrop-blur-md"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center text-2xl font-bold text-purple-100">
              <Settings className="mr-2 h-6 w-6" />
              Settings
            </SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="accessibility" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-800/70">
              <TabsTrigger
                value="accessibility"
                className="flex items-center gap-2 text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                <Accessibility className="h-4 w-4" /> Accessibility
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="flex items-center gap-2 text-purple-100 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                <Palette className="h-4 w-4" /> Display
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accessibility" className="mt-4 space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-purple-100">
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
                <Label htmlFor="large-text" className="text-purple-100">
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
                <Label htmlFor="reduced-motion" className="text-purple-100">
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
                <Label htmlFor="screen-reader-mode" className="text-purple-100">
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
                <Label htmlFor="keyboard-navigation" className="text-purple-100">
                  Keyboard Navigation
                </Label>
                <Switch
                  id="keyboard-navigation"
                  checked={preferences.keyboardNavigation}
                  onCheckedChange={(checked) => updatePreference("keyboardNavigation", checked)}
                  aria-label="Toggle keyboard navigation indicators"
                />
              </div>
              <Separator className="bg-purple-700" />
              <Button
                onClick={handleReset}
                className="w-full bg-purple-700 text-purple-100 hover:bg-purple-800"
                aria-label="Reset all accessibility settings"
              >
                Reset All Settings
              </Button>
            </TabsContent>

            <TabsContent value="display" className="mt-4 space-y-6">
              <div>
                <Label htmlFor="text-alignment" className="mb-2 block text-purple-100">
                  <Text className="mr-2 inline-block h-4 w-4" /> Text Alignment
                </Label>
                <Select
                  value={preferences.textAlignment}
                  onValueChange={(value: "left" | "center" | "right" | "justify") =>
                    updatePreference("textAlignment", value)
                  }
                >
                  <SelectTrigger className="w-full bg-purple-800/70 text-purple-100">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-800 text-purple-100">
                    {textAlignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-family" className="mb-2 block text-purple-100">
                  <Text className="mr-2 inline-block h-4 w-4" /> Font Family
                </Label>
                <Select
                  value={preferences.fontFamily}
                  onValueChange={(value: string) => updatePreference("fontFamily", value)}
                >
                  <SelectTrigger className="w-full bg-purple-800/70 text-purple-100">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-800 text-purple-100">
                    {fontFamilyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block text-purple-100">
                  <Languages className="mr-2 inline-block h-4 w-4" /> Language
                </Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value: string) => updatePreference("language", value)}
                >
                  <SelectTrigger className="w-full bg-purple-800/70 text-purple-100">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-800 text-purple-100">
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
        </SheetContent>
      </Sheet>
    </div>
  )
}
