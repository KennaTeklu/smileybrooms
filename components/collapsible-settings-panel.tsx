"use client"

import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronDown,
  Palette,
  Text,
  Keyboard,
  Volume2,
  MousePointer2,
  FileTypeIcon as Font,
  Globe,
  Accessibility,
  Settings,
  Share2,
  MessageSquare,
} from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

export function CollapsibleSettingsPanel() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

  const handleThemeChange = (value: string) => {
    updatePreference("prefersDarkTheme", value === "dark")
    updatePreference("prefersLightTheme", value === "light")
  }

  const handleFontFamilyChange = (value: string) => {
    updatePreference("fontFamily", value)
  }

  const handleLanguageChange = (value: string) => {
    updatePreference("language", value)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-md rounded-md border bg-white p-4 shadow-sm dark:bg-gray-950"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-2">
        <h4 className="text-lg font-semibold">Accessibility Settings</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle settings</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4 px-4 pb-2">
        <Separator />

        {/* Theme Settings */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Theme
            </Label>
            <Select
              value={preferences.prefersDarkTheme ? "dark" : preferences.prefersLightTheme ? "light" : "system"}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Adjust the visual theme of the application.</p>
        </div>

        {/* Font Family */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-family" className="flex items-center gap-2">
              <Font className="h-4 w-4" /> Font Family
            </Label>
            <Select value={preferences.fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans-serif (Default)</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Choose a preferred font style for readability.</p>
        </div>

        {/* Language Selection */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="language-select" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Language
            </Label>
            <Select value={preferences.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Select your preferred language for the application.</p>
        </div>

        {/* Keyboard Navigation */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="keyboard-nav" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" /> Keyboard Navigation
            </Label>
            <Switch
              id="keyboard-nav"
              checked={preferences.enableKeyboardNavigation}
              onCheckedChange={(checked) => updatePreference("enableKeyboardNavigation", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Enable enhanced keyboard navigation for easier access.</p>
        </div>

        {/* Sound Effects */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-effects" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" /> Sound Effects
            </Label>
            <Switch
              id="sound-effects"
              checked={preferences.enableSoundEffects}
              onCheckedChange={(checked) => updatePreference("enableSoundEffects", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Toggle sound feedback for interactions.</p>
        </div>

        {/* Cursor Highlight */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cursor-highlight" className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" /> Cursor Highlight
            </Label>
            <Switch
              id="cursor-highlight"
              checked={preferences.highlightCursor}
              onCheckedChange={(checked) => updatePreference("highlightCursor", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Highlight your mouse cursor for better visibility.</p>
        </div>

        {/* High Contrast Mode */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> High Contrast Mode
            </Label>
            <Switch
              id="high-contrast"
              checked={preferences.highContrastMode}
              onCheckedChange={(checked) => updatePreference("highContrastMode", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Increase color contrast for improved readability.</p>
        </div>

        {/* Text Spacing */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="text-spacing" className="flex items-center gap-2">
              <Text className="h-4 w-4" /> Text Spacing
            </Label>
            <Switch
              id="text-spacing"
              checked={preferences.increaseTextSpacing}
              onCheckedChange={(checked) => updatePreference("increaseTextSpacing", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Increase spacing between letters and lines.</p>
        </div>

        {/* Animations */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" /> Reduce Animations
            </Label>
            <Switch
              id="animations"
              checked={preferences.reduceAnimations}
              onCheckedChange={(checked) => updatePreference("reduceAnimations", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Minimize distracting animations.</p>
        </div>

        {/* Tooltips */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tooltips" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Show Tooltips
            </Label>
            <Switch
              id="tooltips"
              checked={preferences.showTooltips}
              onCheckedChange={(checked) => updatePreference("showTooltips", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Display helpful tooltips on hover.</p>
        </div>

        {/* Share Panel Settings */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-panel" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Enable Share Panel
            </Label>
            <Switch
              id="share-panel"
              checked={preferences.enableSharePanel}
              onCheckedChange={(checked) => updatePreference("enableSharePanel", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Allow sharing content via a dedicated panel.</p>
        </div>

        {/* Chatbot Settings */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="chatbot" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Enable Chatbot
            </Label>
            <Switch
              id="chatbot"
              checked={preferences.enableChatbot}
              onCheckedChange={(checked) => updatePreference("enableChatbot", checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">Enable or disable the AI chatbot assistant.</p>
        </div>

        <Separator />
        <Button variant="outline" className="w-full bg-transparent" onClick={resetPreferences}>
          Reset to Defaults
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}
