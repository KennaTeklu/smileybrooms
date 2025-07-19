"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  Settings,
} from "lucide-react"
import { useTheme } from "next-themes"

export function EnhancedAccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("preferences")
  const { theme } = useTheme()

  const preferenceItems = [
    {
      id: "highContrast",
      label: "High Contrast",
      description:
        "This setting increases the contrast between text and background colors for improved readability, especially for users with low vision.",
      icon: <Eye className="h-4 w-4" />,
    },
    {
      id: "largeText",
      label: "Large Text",
      description:
        "This option increases the base font size across the website, making text easier to read for individuals with visual impairments.",
      icon: <ZoomIn className="h-4 w-4" />,
    },
    {
      id: "reducedMotion",
      label: "Reduced Motion",
      description:
        "This feature minimizes animations and transitions on the site, which can be beneficial for users prone to motion sickness or distractions.",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "screenReader",
      label: "Screen Reader Optimized",
      description:
        "This mode enhances compatibility with screen readers by providing clearer semantic structures and alternative text for non-text content.",
      icon: <Volume2 className="h-4 w-4" />,
    },
  ]

  const controlItems = [
    {
      id: "voiceControl",
      label: "Voice Control",
      description:
        "Voice control allows users to navigate and interact with the site using spoken commands. This is particularly useful for users with limited mobility.",
      icon: <Mic className="h-4 w-4" />,
      supported: true, // Assuming support for explanation
    },
    {
      id: "keyboardOnly",
      label: "Keyboard Navigation",
      description:
        "This optimization ensures that all interactive elements are accessible and navigable using only a keyboard, providing an alternative to mouse interaction.",
      icon: <Keyboard className="h-4 w-4" />,
    },
  ]

  const keyboardShortcuts = [
    {
      description: "Open shopping cart",
      keys: ["Alt", "C"],
    },
    {
      description: "Toggle accessibility panel",
      keys: ["Alt", "A"],
    },
    {
      description: "Go to homepage",
      keys: ["Alt", "H"],
    },
    {
      description: "Toggle dark/light mode",
      keys: ["Alt", "D"],
    },
  ]

  const voiceCommands = [
    {
      description: "Open shopping cart",
      phrase: "open cart",
    },
    {
      description: "Proceed to checkout",
      phrase: "checkout",
    },
    {
      description: "Clear shopping cart",
      phrase: "clear cart",
    },
    {
      description: "Switch to dark mode",
      phrase: "dark mode",
    },
    {
      description: "Switch to light mode",
      phrase: "light mode",
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 bg-transparent"
        onClick={() => setOpen(true)}
        aria-label="Accessibility options"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center">Accessibility Information</DrawerTitle>
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
              {/* Theme Information */}
              <div className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <p className="text-xs text-muted-foreground">
                    The current theme is {theme === "dark" ? "Dark" : "Light"}. This setting adjusts the visual
                    appearance of the website to reduce eye strain or improve visibility in different lighting
                    conditions.
                  </p>
                </div>
              </div>

              {preferenceItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                  <div className="mt-0.5">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
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
                    {controlItems[0].description}
                    {controlItems[0].supported
                      ? ""
                      : " (Note: Voice control may not be fully supported in all browsers.)"}
                  </p>
                </div>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-start space-x-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  <Keyboard className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Keyboard Navigation</h4>
                  <p className="text-xs text-muted-foreground">{controlItems[1].description}</p>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Available Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">{shortcut.keys.join(" + ")}</kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Commands */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Available Voice Commands</h4>
                <div className="space-y-2 text-sm">
                  {voiceCommands.map((command, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{command.description}</span>
                      <span className="text-xs text-muted-foreground">Say: "{command.phrase}"</span>
                    </div>
                  ))}
                </div>
              </div>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
