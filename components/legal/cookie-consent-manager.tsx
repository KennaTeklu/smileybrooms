"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { X, Settings, Shield, BarChart3, Target } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface CookieConsentManagerProps {
  onAccept: (preferences: CookiePreferences) => void
  onDecline: () => void
  jurisdiction?: "US" | "EU" | "CA"
}

export default function CookieConsentManager({ onAccept, onDecline, jurisdiction = "US" }: CookieConsentManagerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    onAccept(allAccepted)
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    onAccept(preferences)
    setIsVisible(false)
  }

  const handleDeclineAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(minimal))
    onDecline()
    setIsVisible(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (!isVisible) return null

  const isEU = jurisdiction === "EU"
  const isCA = jurisdiction === "CA"

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Cookie Preferences</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts.
            {isEU && " Under GDPR, you have the right to control how your data is used."}
            {isCA && " In compliance with PIPEDA, we respect your privacy choices."}
          </div>

          {!showDetails ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accept All Cookies
                </Button>
                <Button variant="outline" onClick={handleDeclineAll} className="flex-1">
                  {isEU ? "Reject All" : "Decline Optional"}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setShowDetails(true)} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Customize Preferences
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Necessary Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for basic site functionality and security
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how visitors interact with our website
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference("analytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">Used to deliver personalized advertisements</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference("marketing", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Functional Cookies</h4>
                      <p className="text-sm text-muted-foreground">Enable enhanced functionality and personalization</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => updatePreference("functional", checked)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptSelected} className="flex-1">
                  Save Preferences
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>
              For more information, read our{" "}
              <a href="/privacy" className="underline hover:no-underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="underline hover:no-underline">
                Terms of Service
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
