"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Mic,
  Keyboard,
  Eye,
  Monitor,
  HelpCircle,
  Maximize2,
  ZoomIn,
  Zap,
  MousePointer2,
  Volume2,
  Sun,
  Moon,
} from "lucide-react"
import { useAccessibility } from "@/lib/accessibility-context"
import { useVoiceCommands } from "@/lib/voice-commands"
import { useKeyboardNavigation } from "@/lib/keyboard-navigation"
import { useTheme } from "next-themes"

export function EnhancedAccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("preferences")
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const voiceCommands = useVoiceCommands()
  const keyboardNav = useKeyboardNavigation()
  const [isListening, setIsListening] = useState(false)
  const { theme, setTheme } = useTheme()

  // Set up voice command state change listener
  if (voiceCommands) {
    voiceCommands.setOnStateChange(setIsListening)
  }

  const preferenceItems = [
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
      id: "screenReader",
      label: "Screen Reader Optimized",
      description: "Enhances compatibility with screen readers",
      icon: <Volume2 className="h-4 w-4" />,
      value: preferences.screenReader,
    },
    {
      id: "voiceControl",
      label: "Voice Control",
      description: "Enable voice commands for navigation",
      icon: <Mic className="h-4 w-4" />,
      value: preferences.voiceControl,
    },
    {
      id: "keyboardOnly",
      label: "Keyboard Navigation",
      description: "Optimized for keyboard-only navigation",
      icon: <Keyboard className="h-4 w-4" />,
      value: preferences.keyboardOnly,
    },
  ]

  const toggleVoiceCommands = () => {
    if (!voiceCommands) return

    const newState = voiceCommands.toggleListening()
    setIsListening(newState)

    // Also update the preference
    updatePreference("voiceControl", newState)
  }

  // Register some example voice commands
  if (voiceCommands && voiceCommands.getCommands().length === 0) {
    voiceCommands.registerCommands([
      {
        phrases: ["open cart", "show cart", "view cart"],
        handler: () => {
          // This would open the cart
          console.log("Voice command: Opening cart")
        },
        description: "Open shopping cart",
      },
      {
        phrases: ["checkout", "check out", "proceed to checkout"],
        handler: () => {
          // This would proceed to checkout
          console.log("Voice command: Proceeding to checkout")
        },
        description: "Proceed to checkout",
      },
      {
        phrases: ["clear cart", "empty cart", "remove all items"],
        handler: () => {
          // This would clear the cart
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
          updatePreference("prefersLightTheme", true)
          updatePreference("prefersDarkTheme", false)
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
          setTheme(theme === "dark" ? "light" : "dark")
          updatePreference("prefersDarkTheme", theme !== "dark")
          updatePreference("prefersLightTheme", theme === "dark")
        },
      },
    ])
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12"
        onClick={() => setOpen(true)}
        aria-label="Accessibility options"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center">Accessibility Options</DrawerTitle>
          </DrawerHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="preferences">
                <Monitor className="h-4 w-4 mr-2" />
                <span>Display</span>
              </TabsTrigger>
              <TabsTrigger value="controls">
                <MousePointer2 className="h-4 w-4 mr-2" />
                <span>Controls</span>
              </TabsTrigger>
              <TabsTrigger value="help">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>Help</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-4">
              {/* Theme Selection */}
              <div className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <p className="text-xs text-muted-foreground">Choose between light and dark mode</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => {
                      setTheme("light")
                      updatePreference("prefersLightTheme", true)
                      updatePreference("prefersDarkTheme", false)
                    }}
                  >
                    <Sun className="h-4 w-4 mr-1" /> Light
                  </Button>
                  <Button
                    size="sm"
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => {
                      setTheme("dark")
                      updatePreference("prefersDarkTheme", true)
                      updatePreference("prefersLightTheme", false)
                    }}
                  >
                    <Moon className="h-4 w-4 mr-1" /> Dark
                  </Button>
                </div>
              </div>

              {preferenceItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                  <div className="mt-0.5">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={(checked) => updatePreference(item.id as any, checked)}
                    aria-label={`Toggle ${item.label}`}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="controls" className="space-y-4">
              {/* Voice Control */}
              <div className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Voice Control</h4>
                  <p className="text-xs text-muted-foreground">
                    {voiceCommands?.isSupported()
                      ? "Use voice commands to navigate the site"
                      : "Voice control is not supported in your browser"}
                  </p>
                </div>
                <Switch
                  checked={isListening}
                  onCheckedChange={toggleVoiceCommands}
                  disabled={!voiceCommands?.isSupported()}
                  aria-label="Toggle voice control"
                />
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  <Keyboard className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Keyboard Navigation</h4>
                  <p className="text-xs text-muted-foreground">Optimized for keyboard-only navigation</p>
                </div>
                <Switch
                  checked={preferences.keyboardOnly}
                  onCheckedChange={(checked) => {
                    updatePreference("keyboardOnly", checked)
                    if (keyboardNav) {
                      checked ? keyboardNav.enable() : keyboardNav.disable()
                    }
                  }}
                  aria-label="Toggle keyboard navigation"
                />
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  {keyboardNav?.getShortcuts().map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">
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
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Voice Commands</h4>
                  <div className="space-y-2 text-sm">
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

            <TabsContent value="help" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium mb-2">Accessibility Statement</h4>
                <p className="text-sm text-muted-foreground">
                  smileybrooms is committed to ensuring digital accessibility for people with disabilities. We are
                  continually improving the user experience for everyone, and applying the relevant accessibility
                  standards.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium mb-2">Conformance Status</h4>
                <p className="text-sm text-muted-foreground">
                  The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to
                  improve accessibility for people with disabilities. It defines three levels of conformance: Level A,
                  Level AA, and Level AAA. smileybrooms is partially conformant with WCAG 2.2 level AA.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-medium mb-2">Contact Us</h4>
                <p className="text-sm text-muted-foreground">
                  If you encounter any accessibility barriers, please email{" "}
                  <a href="mailto:accessibility@smileybrooms.com" className="underline">
                    accessibility@smileybrooms.com
                  </a>
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DrawerFooter>
            <Button variant="outline" onClick={resetPreferences}>
              Reset All Preferences
            </Button>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
