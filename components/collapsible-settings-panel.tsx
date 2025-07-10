"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mic,
  Keyboard,
  Eye,
  Monitor,
  HelpCircle,
  ZoomIn,
  Zap,
  MousePointer2,
  Volume2,
  Sun,
  Moon,
  Text,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  ChevronRight,
} from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useVoiceCommands } from "@/lib/voice-commands"
import { useKeyboardNavigation } from "@/lib/keyboard-navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import type { AccessibilityPreferences } from "@/lib/accessibility-context" // Corrected import path for type

export function CollapsibleSettingsPanel() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("display")
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const voiceCommands = useVoiceCommands()
  const keyboardNav = useKeyboardNavigation()
  const [isListening, setIsListening] = useState(false)
  const { theme, setTheme } = useTheme()

  // Set up voice command state change listener
  if (voiceCommands) {
    voiceCommands.setOnStateChange(setIsListening)
  }

  const displayPreferenceItems = [
    {
      id: "highContrast",
      label: "High Contrast",
      description: "Increases contrast for better readability",
      icon: <Eye className="h-4 w-4" />,
      value: preferences.highContrast,
    },
    {
      id: "largeText",
      label: "Large Text",
      description: "Increases text size throughout the site",
      icon: <ZoomIn className="h-4 w-4" />,
      value: preferences.largeText,
    },
    {
      id: "reducedMotion",
      label: "Reduced Motion",
      description: "Minimizes animations and transitions",
      icon: <Zap className="h-4 w-4" />,
      value: preferences.reducedMotion,
    },
    {
      id: "screenReaderMode",
      label: "Screen Reader Optimized",
      description: "Enhances compatibility with screen readers",
      icon: <Volume2 className="h-4 w-4" />,
      value: preferences.screenReaderMode,
    },
  ]

  const controlPreferenceItems = [
    {
      id: "voiceControl",
      label: "Voice Control",
      description: "Enable voice commands for navigation",
      icon: <Mic className="h-4 w-4" />,
      value: preferences.voiceControl,
      disabled: !voiceCommands?.isSupported(),
    },
    {
      id: "keyboardNavigation",
      label: "Keyboard Navigation",
      description: "Optimized for keyboard-only navigation with visible focus",
      icon: <Keyboard className="h-4 w-4" />,
      value: preferences.keyboardNavigation,
    },
  ]

  const handleUpdatePreference = (id: keyof AccessibilityPreferences, checked: boolean) => {
    updatePreference(id, checked)
    // Special handling for voice control and keyboard navigation
    if (id === "voiceControl" && voiceCommands) {
      if (checked) {
        voiceCommands.startListening()
      } else {
        voiceCommands.stopListening()
      }
      setIsListening(checked)
    }
    if (id === "keyboardNavigation" && keyboardNav) {
      checked ? keyboardNav.enable() : keyboardNav.disable()
    }
  }

  // Register some example voice commands
  if (voiceCommands && voiceCommands.getCommands().length === 0) {
    voiceCommands.registerCommands([
      {
        phrases: ["open cart", "show cart", "view cart"],
        handler: () => {
          console.log("Voice command: Opening cart")
        },
        description: "Open shopping cart",
      },
      {
        phrases: ["checkout", "check out", "proceed to checkout"],
        handler: () => {
          console.log("Voice command: Proceeding to checkout")
        },
        description: "Proceed to checkout",
      },
      {
        phrases: ["clear cart", "empty cart", "remove all items"],
        handler: () => {
          console.log("Voice command: Clearing cart")
        },
        description: "Clear shopping cart",
      },
      {
        phrases: ["dark mode", "switch to dark mode", "enable dark mode"],
        handler: () => {
          setTheme("dark")
          updatePreference("prefersDarkTheme", true)
          updatePreference("prefersLightTheme", false)
        },
        description: "Switch to dark mode",
      },
      {
        phrases: ["light mode", "switch to light mode", "enable light mode"],
        handler: () => {
          setTheme("light")
          updatePreference("prefersDarkTheme", false)
          updatePreference("prefersLightTheme", true)
        },
        description: "Switch to light mode",
      },
    ])
  }

  // Register some example keyboard shortcuts
  if (keyboardNav && keyboardNav.getShortcuts().length === 0) {
    keyboardNav.registerShortcuts([
      {
        key: "c",
        altKey: true,
        description: "Open cart",
        handler: () => {
          console.log("Keyboard shortcut: Opening cart")
        },
      },
      {
        key: "a",
        altKey: true,
        description: "Toggle accessibility panel",
        handler: () => {
          setOpen(!open)
        },
      },
      {
        key: "h",
        altKey: true,
        description: "Go to homepage",
        handler: () => {
          console.log("Keyboard shortcut: Going to homepage")
        },
      },
      {
        key: "d",
        altKey: true,
        description: "Toggle dark/light mode",
        handler: () => {
          const newTheme = theme === "dark" ? "light" : "dark"
          setTheme(newTheme)
          updatePreference("prefersDarkTheme", newTheme === "dark")
          updatePreference("prefersLightTheme", newTheme === "light")
        },
      },
    ])
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full h-12 w-12 bg-purple-500 text-white shadow-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={() => setOpen(true)}
        aria-label="Accessibility options"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 border-t-4 border-purple-500 rounded-t-xl shadow-2xl">
          <DrawerHeader className="bg-purple-500 text-white p-4 rounded-t-lg flex items-center justify-center">
            <Monitor className="h-6 w-6 mr-2" />
            <DrawerTitle className="text-center text-xl font-bold">Accessibility & Settings</DrawerTitle>
          </DrawerHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4 py-2">
            <TabsList className="grid grid-cols-3 mb-4 bg-purple-200 dark:bg-gray-700 rounded-lg p-1">
              <TabsTrigger
                value="display"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Display</span>
              </TabsTrigger>
              <TabsTrigger
                value="controls"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
              >
                <MousePointer2 className="h-4 w-4 mr-2" />
                <span>Controls</span>
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Help</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="space-y-4 p-2 overflow-y-auto max-h-[calc(85vh-200px)]">
              {/* Theme Selection */}
              <div className="flex items-center justify-between space-x-4 p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  )}
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Theme</h4>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={preferences.prefersLightTheme ? "default" : "outline"}
                    onClick={() => {
                      setTheme("light")
                      updatePreference("prefersLightTheme", true)
                      updatePreference("prefersDarkTheme", false)
                    }}
                    className={cn(
                      "text-purple-700 border-purple-400 hover:bg-purple-100 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-gray-700",
                      preferences.prefersLightTheme &&
                        "bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
                    )}
                  >
                    <Sun className="h-4 w-4 mr-1" /> Light
                  </Button>
                  <Button
                    size="sm"
                    variant={preferences.prefersDarkTheme ? "default" : "outline"}
                    onClick={() => {
                      setTheme("dark")
                      updatePreference("prefersDarkTheme", true)
                      updatePreference("prefersLightTheme", false)
                    }}
                    className={cn(
                      "text-purple-700 border-purple-400 hover:bg-purple-100 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-gray-700",
                      preferences.prefersDarkTheme &&
                        "bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
                    )}
                  >
                    <Moon className="h-4 w-4 mr-1" /> Dark
                  </Button>
                </div>
              </div>

              {/* Font Size Slider */}
              <div className="p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Text className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label htmlFor="fontSize" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Font Size: {preferences.largeText ? "Large" : "Normal"}
                  </Label>
                </div>
                <Slider
                  id="fontSize"
                  min={80}
                  max={150}
                  step={5}
                  value={[preferences.largeText ? 125 : 100]}
                  onValueChange={(val) => updatePreference("largeText", val[0] >= 125)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Adjust the base font size of the text.</p>
              </div>

              {/* Text Alignment */}
              <div className="p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <AlignLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label htmlFor="textAlignment" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Text Alignment
                  </Label>
                </div>
                <Select
                  value={preferences.textAlignment}
                  onValueChange={(val: "left" | "center" | "right" | "justify") =>
                    updatePreference("textAlignment", val)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">
                      <div className="flex items-center">
                        <AlignLeft className="h-4 w-4 mr-2" /> Left
                      </div>
                    </SelectItem>
                    <SelectItem value="center">
                      <div className="flex items-center">
                        <AlignCenter className="h-4 w-4 mr-2" /> Center
                      </div>
                    </SelectItem>
                    <SelectItem value="right">
                      <div className="flex items-center">
                        <AlignRight className="h-4 w-4 mr-2" /> Right
                      </div>
                    </SelectItem>
                    <SelectItem value="justify">
                      <div className="flex items-center">
                        <AlignJustify className="h-4 w-4 mr-2" /> Justify
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Adjust the alignment of text content.</p>
              </div>

              {/* Font Family */}
              <div className="p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Type className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label htmlFor="fontFamily" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Font Family
                  </Label>
                </div>
                <Select
                  value={preferences.fontFamily}
                  onValueChange={(val: string) => updatePreference("fontFamily", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter, sans-serif">Sans-serif (Default)</SelectItem>
                    <SelectItem value="Georgia, serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Choose a different font style.</p>
              </div>

              {/* Language Selection */}
              <div className="p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Text className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label htmlFor="language" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Language
                  </Label>
                </div>
                <Select value={preferences.language} onValueChange={(val: string) => updatePreference("language", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Select your preferred language for the site.</p>
              </div>

              {displayPreferenceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <div className="mt-0.5 text-purple-600 dark:text-purple-400">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={(checked) =>
                      handleUpdatePreference(item.id as keyof AccessibilityPreferences, checked)
                    }
                    aria-label={`Toggle ${item.label}`}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="controls" className="space-y-4 p-2 overflow-y-auto max-h-[calc(85vh-200px)]">
              {controlPreferenceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <div className="mt-0.5 text-purple-600 dark:text-purple-400">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.id === "voiceControl" && !voiceCommands?.isSupported()
                        ? "Voice control is not supported in your browser"
                        : item.description}
                    </p>
                  </div>
                  <Switch
                    checked={item.id === "voiceControl" ? isListening : item.value}
                    onCheckedChange={(checked) =>
                      handleUpdatePreference(item.id as keyof AccessibilityPreferences, checked)
                    }
                    disabled={item.disabled}
                    aria-label={`Toggle ${item.label}`}
                  />
                </div>
              ))}

              {/* Keyboard Shortcuts */}
              <div className="mt-4 p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {keyboardNav?.getShortcuts().map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-purple-200 dark:bg-gray-700 rounded text-xs font-mono text-purple-800 dark:text-purple-200">
                        {[
                          shortcut.ctrlKey && "Ctrl",
                          shortcut.altKey && "Alt",
                          shortcut.shiftKey && "Shift",
                          shortcut.key.toUpperCase(),
                        ]
                          .filter(Boolean)
                          .join(" + ")}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Commands */}
              {voiceCommands?.isSupported() && (
                <div className="mt-4 p-3 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Voice Commands</h4>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {voiceCommands.getCommands().map((command, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{command.description}</span>
                        <span className="text-xs text-muted-foreground">Say: "{command.phrases[0]}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="help" className="space-y-4 p-2 overflow-y-auto max-h-[calc(85vh-200px)]">
              <div className="p-4 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Accessibility Statement</h4>
                <p className="text-sm text-muted-foreground">
                  smileybrooms is committed to ensuring digital accessibility for people with disabilities. We are
                  continually improving the user experience for everyone, and applying the relevant accessibility
                  standards.
                </p>
              </div>

              <div className="p-4 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Conformance Status</h4>
                <p className="text-sm text-muted-foreground">
                  The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to
                  improve accessibility for people with disabilities. It defines three levels of conformance: Level A,
                  Level AA, and Level AAA. smileybrooms is partially conformant with WCAG 2.2 level AA.
                </p>
              </div>

              <div className="p-4 border border-purple-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Contact Us</h4>
                <p className="text-sm text-muted-foreground">
                  If you encounter any accessibility barriers, please email{" "}
                  <a
                    href="mailto:accessibility@smileybrooms.com"
                    className="underline text-purple-600 dark:text-purple-400"
                  >
                    accessibility@smileybrooms.com
                  </a>
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DrawerFooter className="p-4 bg-purple-100 dark:bg-gray-900 border-t border-purple-200 dark:border-gray-700 rounded-b-xl flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={resetPreferences}
              className="w-full sm:w-auto border-purple-500 text-purple-700 hover:bg-purple-200 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-gray-700 bg-transparent"
            >
              Reset All Preferences
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
