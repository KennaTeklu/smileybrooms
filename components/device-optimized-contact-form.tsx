"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mic, Phone, Mail } from "lucide-react"
import { useDeviceDetection } from "@/lib/device-detection"

export function DeviceOptimizedContactForm() {
  const device = useDeviceDetection()
  const [preferredContact, setPreferredContact] = useState(device.isMobile ? "sms" : "email")
  const [isListening, setIsListening] = useState(false)

  const handleVoiceInput = () => {
    if (!device.supportsTouchEvents) return

    setIsListening(true)
    // Voice recognition implementation would go here
    setTimeout(() => setIsListening(false), 3000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Get Your Free Quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              className={device.isMobile ? "h-12 text-16px" : "h-10"} // Prevent zoom on iOS
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              className={device.isMobile ? "h-12 text-16px" : "h-10"}
              placeholder={device.isMobile ? "Tap to enter" : "(555) 123-4567"}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <div className="relative">
            <Textarea
              id="message"
              className={device.isMobile ? "min-h-32 text-16px" : "min-h-24"}
              placeholder="Tell us about your cleaning needs..."
            />
            {device.supportsTouchEvents && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2"
                onClick={handleVoiceInput}
                disabled={isListening}
              >
                <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        <div>
          <Label>Preferred Contact Method</Label>
          <RadioGroup value={preferredContact} onValueChange={setPreferredContact} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Text Message (SmileyBrooms.com: (602) 800-0605) {device.isMobile && "(Recommended)"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email {!device.isMobile && "(Recommended)"}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          className={`w-full ${device.isMobile ? "h-12 text-lg" : "h-10"}`}
          size={device.isMobile ? "lg" : "default"}
        >
          {device.isMobile ? "Get My Quote" : "Request Free Quote"}
        </Button>
      </CardContent>
    </Card>
  )
}
