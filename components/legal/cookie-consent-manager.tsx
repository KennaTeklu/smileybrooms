"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function useCookieConsentManager() {
  const [showConsent, setShowConsent] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [marketingEnabled, setMarketingEnabled] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent")
    if (!consentGiven) {
      setShowConsent(true)
    } else {
      const consent = JSON.parse(consentGiven)
      setAnalyticsEnabled(consent.analytics)
      setMarketingEnabled(consent.marketing)
    }
  }, [])

  const handleAccept = () => {
    const consent = {
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookieConsent", JSON.stringify(consent))
    setShowConsent(false)
    toast({
      title: "Cookie Preferences Saved!",
      description: "Your cookie choices have been successfully updated.",
      variant: "default",
    })
  }

  const handleReject = () => {
    const consent = {
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookieConsent", JSON.stringify(consent))
    setShowConsent(false)
    setAnalyticsEnabled(false)
    setMarketingEnabled(false)
    toast({
      title: "Cookies Rejected",
      description: "Only essential cookies will be used.",
      variant: "destructive",
    })
  }

  const CookieConsentDialog = () => (
    <Dialog open={showConsent} onOpenChange={setShowConsent}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cookie Consent</DialogTitle>
          <DialogDescription>
            We use cookies to improve your experience. Please choose your preferences below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="essential-cookies">Essential Cookies</Label>
            <Switch id="essential-cookies" checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics-cookies">Analytics Cookies</Label>
            <Switch id="analytics-cookies" checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-cookies">Marketing Cookies</Label>
            <Switch id="marketing-cookies" checked={marketingEnabled} onCheckedChange={setMarketingEnabled} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReject}>
            Reject All
          </Button>
          <Button onClick={handleAccept}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return { CookieConsentDialog }
}
