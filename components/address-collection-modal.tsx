"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MapPin, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AddressCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddressData) => void
  calculatedPrice: number
}

export interface AddressData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  specialInstructions: string
  allowVideoRecording: boolean
  videoRecordingDiscount: number
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export default function AddressCollectionModal({
  isOpen,
  onClose,
  onSubmit,
  calculatedPrice,
}: AddressCollectionModalProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showVideoRecordingDialog, setShowVideoRecordingDialog] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const { toast } = useToast()

  // Calculate video recording discount (0.1% or $50, whichever is higher)
  const videoRecordingDiscount = Math.max(calculatedPrice * 0.001, 50)

  // Load Google Maps script
  useEffect(() => {
    if (!isOpen || mapLoaded) return

    const googleMapsScript = document.createElement("script")
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
    googleMapsScript.async = true
    googleMapsScript.defer = true
    googleMapsScript.onload = () => {
      setMapLoaded(true)
    }
    document.body.appendChild(googleMapsScript)

    return () => {
      document.body.removeChild(googleMapsScript)
    }
  }, [isOpen, mapLoaded])

  // Initialize autocomplete when map is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    const addressInput = document.getElementById("address") as HTMLInputElement
    if (addressInput) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInput, {
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry"],
      })

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (!place?.address_components) return

        setAddress(place.formatted_address || "")

        // Extract city, state, and zip from address components
        place.address_components.forEach((component) => {
          const types = component.types

          if (types.includes("locality")) {
            setCity(component.long_name)
          }

          if (types.includes("administrative_area_level_1")) {
            setState(component.short_name)
          }

          if (types.includes("postal_code")) {
            setZipCode(component.long_name)
          }
        })
      })
    }
  }, [mapLoaded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!fullName || !email || !phone || !address || !city || !state || !zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Submit the data
    onSubmit({
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      specialInstructions,
      allowVideoRecording,
      videoRecordingDiscount: allowVideoRecording ? videoRecordingDiscount : 0,
    })

    // Reset form
    setFullName("")
    setEmail("")
    setPhone("")
    setAddress("")
    setCity("")
    setState("")
    setZipCode("")
    setSpecialInstructions("")
    setAllowVideoRecording(false)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Service Details</DialogTitle>
            <DialogDescription>
              Please provide your information so we can complete your cleaning service.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name*</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <div className="relative">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  required
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div ref={mapRef} className="h-0"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="NY" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code*</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Input
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Gate code, pet information, etc."
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allow-recording"
                  checked={allowVideoRecording}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setShowVideoRecordingDialog(true)
                    } else {
                      setAllowVideoRecording(false)
                    }
                  }}
                />
                <div>
                  <div className="flex items-center">
                    <Label htmlFor="allow-recording" className="font-medium cursor-pointer">
                      Allow video recording for ${videoRecordingDiscount.toFixed(2)} off
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-blue-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          We may record cleaning sessions for training and social media purposes. By allowing this,
                          you'll receive ${videoRecordingDiscount.toFixed(2)} off your order.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll record parts of the cleaning process for our social media and training.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Continue to Checkout"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Recording Consent Dialog */}
      <Dialog open={showVideoRecordingDialog} onOpenChange={setShowVideoRecordingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Video Recording Consent</DialogTitle>
            <DialogDescription>
              By allowing us to record your cleaning session, you'll receive ${videoRecordingDiscount.toFixed(2)} off.
              Please review our terms:
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto text-sm space-y-4 my-4 pr-2">
            <p>
              By checking the "Allow video recording" box, I hereby authorize Smiley Brooms Cleaning Services ("the
              Company") to record video footage during cleaning sessions at my property.
            </p>
            <p>
              <strong>Purpose:</strong> This footage may be used for staff training, quality control, service
              improvement, and promotional materials including but not limited to social media, website content, and
              advertisements.
            </p>
            <p>
              <strong>Privacy Considerations:</strong> The Company will take reasonable measures to protect my privacy,
              including:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Blurring/obscuring any personal identifying information when possible</li>
              <li>Not recording in private areas (bedrooms, bathrooms) without explicit separate consent</li>
              <li>Focusing primarily on the cleaning process rather than personal property</li>
              <li>Not publishing my address or other contact information</li>
            </ul>
            <p>
              <strong>Rights:</strong> I understand I have the right to:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Request to see footage before it's used publicly</li>
              <li>Withdraw consent for future recordings at any time</li>
              <li>
                Request removal of existing footage from promotional materials (subject to reasonable limitations)
              </li>
            </ul>
            <p>
              <strong>Compensation:</strong> In exchange for this consent, I will receive $
              {videoRecordingDiscount.toFixed(2)} off my cleaning service.
            </p>
            <p>This agreement shall remain in effect until explicitly revoked in writing.</p>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowVideoRecordingDialog(false)}>
              Decline
            </Button>
            <Button
              onClick={() => {
                setAllowVideoRecording(true)
                setShowVideoRecordingDialog(false)
              }}
            >
              I Consent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
