"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Palette, Accessibility, Bell, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAccessibility } from "@/lib/accessibility-context"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { preferences, updatePreference, resetPreferences } = useAccessibility()
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* Theme Settings */}
        <Card className="card-enhanced card-hover shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 glass-light rounded-lg shadow-soft">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              Appearance
            </CardTitle>
            <CardDescription className="text-base">Customize how Smiley Brooms looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-light p-4 rounded-lg shadow-soft button-hover-lift cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-3 cursor-pointer text-base">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      Light
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-6">Clean and professional</p>
                </div>
                <div className="glass-light p-4 rounded-lg shadow-soft button-hover-lift cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-3 cursor-pointer text-base">
                      <Moon className="h-5 w-5 text-blue-500" />
                      Dark
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-6">Rich and modern</p>
                </div>
                <div className="glass-light p-4 rounded-lg shadow-soft button-hover-lift cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-3 cursor-pointer text-base">
                      <Monitor className="h-5 w-5 text-gray-500" />
                      System
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-6">Match your device</p>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="card-enhanced card-hover shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 glass-light rounded-lg shadow-soft">
                <Accessibility className="h-5 w-5 text-primary" />
              </div>
              Accessibility
            </CardTitle>
            <CardDescription className="text-base">Adjust settings to improve your experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
                <div className="space-y-1">
                  <Label className="text-base font-medium">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                  className="shadow-soft"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Large Text</Label>
                  <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                </div>
                <Switch
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => updatePreference("largeText", checked)}
                  className="shadow-soft"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                  className="shadow-soft"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Screen Reader Support</Label>
                  <p className="text-sm text-muted-foreground">Enhanced support for screen readers</p>
                </div>
                <Switch
                  checked={preferences.screenReader}
                  onCheckedChange={(checked) => updatePreference("screenReader", checked)}
                  className="shadow-soft"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Keyboard Navigation</Label>
                  <p className="text-sm text-muted-foreground">Enhanced keyboard navigation support</p>
                </div>
                <Switch
                  checked={preferences.keyboardOnly}
                  onCheckedChange={(checked) => updatePreference("keyboardOnly", checked)}
                  className="shadow-soft"
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={resetPreferences}
              className="w-full button-hover-lift glass-light shadow-soft"
            >
              Reset Accessibility Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-enhanced card-hover shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 glass-light rounded-lg shadow-soft">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              Notifications
            </CardTitle>
            <CardDescription className="text-base">Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 glass-light rounded-lg shadow-soft">
              <div className="space-y-1">
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about your bookings</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} className="shadow-soft" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="card-enhanced card-hover shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 glass-light rounded-lg shadow-soft">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              Privacy & Security
            </CardTitle>
            <CardDescription className="text-base">Manage your privacy and security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full button-hover-lift glass-light shadow-soft">
              Download My Data
            </Button>
            <Button
              variant="outline"
              className="w-full button-hover-lift glass-light shadow-soft text-destructive hover:text-destructive"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
