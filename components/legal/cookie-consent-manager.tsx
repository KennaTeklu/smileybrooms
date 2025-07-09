"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Cookie, Shield, BarChart3, MapPin, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
  icon: React.ReactNode
  cookies: string[]
}

interface GeoLocation {
  country: string
  region: string
  requiresExplicitConsent: boolean
  hasRightToForget: boolean
}

export default function CookieConsentManager() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null)
  const [categories, setCategories] = useState<CookieCategory[]>([
    {
      id: "essential",
      name: "Essential Cookies",
      description: "Required for basic website functionality and security",
      required: true,
      enabled: true,
      icon: <Shield className="h-4 w-4" />,
      cookies: ["session_id", "csrf_token", "auth_state"],
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      required: false,
      enabled: false,
      icon: <BarChart3 className="h-4 w-4" />,
      cookies: ["_ga", "_gid", "analytics_session"],
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "Used to deliver personalized advertisements and track campaign performance",
      required: false,
      enabled: false,
      icon: <MapPin className="h-4 w-4" />,
      cookies: ["fb_pixel", "google_ads", "marketing_prefs"],
    },
    {
      id: "preferences",
      name: "Preference Cookies",
      description: "Remember your settings and preferences for a better experience",
      required: false,
      enabled: false,
      icon: <Settings className="h-4 w-4" />,
      cookies: ["theme_preference", "language", "accessibility_settings"],
    },
  ])

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      // Detect geo location for compliance rules
      detectGeoLocation()
      setIsVisible(true)
    } else {
      // Load saved preferences
      const savedPrefs = JSON.parse(consent)
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          enabled: savedPrefs[cat.id] !== false,
        })),
      )
    }
  }, [])

  const detectGeoLocation = async () => {
    try {
      // In a real implementation, use a geo-IP service
      const response = await fetch("/api/geo-detect")
      const geo = await response.json()

      // Mock geo detection for demo
      const mockGeo: GeoLocation = {
        country: "US",
        region: "CA",
        requiresExplicitConsent: false, // GDPR regions would be true
        hasRightToForget: false, // GDPR regions would be true
      }

      setGeoLocation(mockGeo)
    } catch (error) {
      console.error("Geo detection failed:", error)
    }
  }

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, enabled } : cat)))
  }

  const handleAcceptAll = () => {
    const allEnabled = categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.id]: true,
      }),
      {},
    )

    localStorage.setItem("cookie_consent", JSON.stringify(allEnabled))
    localStorage.setItem("consent_timestamp", new Date().toISOString())
    setIsVisible(false)

    // Apply cookie settings
    applyCookieSettings(allEnabled)
  }

  const handleAcceptSelected = () => {
    const selectedPrefs = categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.id]: cat.enabled,
      }),
      {},
    )

    localStorage.setItem("cookie_consent", JSON.stringify(selectedPrefs))
    localStorage.setItem("consent_timestamp", new Date().toISOString())
    setIsVisible(false)

    // Apply cookie settings
    applyCookieSettings(selectedPrefs)
  }

  const handleRejectAll = () => {
    const essentialOnly = categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat.id]: cat.required,
      }),
      {},
    )

    localStorage.setItem("cookie_consent", JSON.stringify(essentialOnly))
    localStorage.setItem("consent_timestamp", new Date().toISOString())
    setIsVisible(false)

    // Apply cookie settings
    applyCookieSettings(essentialOnly)
  }

  const applyCookieSettings = (settings: Record<string, boolean>) => {
    // Enable/disable analytics
    if (settings.analytics) {
      // Initialize Google Analytics
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      })
    }

    // Enable/disable marketing cookies
    if (settings.marketing) {
      window.gtag?.("consent", "update", {
        ad_storage: "granted",
      })
    }

    // Apply other cookie settings...
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookie Preferences
            {geoLocation && (
              <Badge variant="outline" className="ml-auto">
                {geoLocation.country} - {geoLocation.region}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and provide personalized services.
            {geoLocation?.requiresExplicitConsent && (
              <span className="text-amber-600 font-medium">
                {" "}
                Your location requires explicit consent for non-essential cookies.
              </span>
            )}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showDetails ? (
            <div className="space-y-4">
              <p className="text-sm">We respect your privacy. Choose which cookies you'd like to allow:</p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accept All Cookies
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(true)} className="flex-1">
                  Customize Settings
                </Button>
                <Button variant="ghost" onClick={handleRejectAll} className="flex-1">
                  Reject Non-Essential
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={cn(
                      "flex items-start justify-between p-3 rounded-lg border",
                      category.required ? "bg-muted/50" : "bg-background",
                    )}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <h4 className="font-medium">{category.name}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <div className="text-xs text-muted-foreground">Cookies: {category.cookies.join(", ")}</div>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={(enabled) => handleCategoryToggle(category.id, enabled)}
                      disabled={category.required}
                      className="ml-4"
                    />
                  </div>
                ))}
              </div>

              {geoLocation?.hasRightToForget && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <Shield className="h-4 w-4 inline mr-1" />
                    You have the right to request deletion of your personal data at any time.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAcceptSelected} className="flex-1">
                  Save Preferences
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
