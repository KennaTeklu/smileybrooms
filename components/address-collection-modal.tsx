"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MapPin, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

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
  googleMapsLink?: string
  meta?: {
    formType: string
    submitDate: string
    browser: string
    page: string
    referrer: string
    device: string
  }
  data?: {
    serviceArea: string
    hasPreviousDiscount: boolean
    schedulePriority: string
    hasSpecialInstructions: boolean
    instructionsLength: number
    fullAddressString: string
    coordinatesRequested: boolean
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
  const [showVideoRecordingDialog, setShowVideoRecordingDialog] = useState(false)
  const [step, setStep] = useState<"details" | "review" | "success">("details")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Calculate video recording discount (10% or $50, whichever is higher)
  const videoRecordingDiscount = Math.max(calculatedPrice * 0.1, 50)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName) newErrors.fullName = "Full name is required"
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email is required"

    if (!phone) newErrors.phone = "Phone number is required"
    else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone))
      newErrors.phone = "Valid phone number is required"

    if (!address) newErrors.address = "Address is required"
    if (!city) newErrors.city = "City is required"
    if (!state) newErrors.state = "State is required"
    if (!zipCode) newErrors.zipCode = "ZIP code is required"
    else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) newErrors.zipCode = "Valid ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    if (step === "details") {
      setStep("review")
      return
    }

    setIsSubmitting(true)

    try {
      // Check for duplicate address in localStorage
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`
      const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`

      // Create Google Maps link for the address
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

      // Determine the neighborhood or area based on zip code (simplified example)
      // In a real implementation, you might use a zip code API
      const determineArea = (zip: string) => {
        // This is a simplified version - in production you'd want to use a real zip code database
        const firstDigit = zip.charAt(0)
        switch (firstDigit) {
          case "0":
          case "1":
            return "Northeast"
          case "2":
          case "3":
            return "Southeast"
          case "4":
          case "5":
          case "6":
            return "Midwest"
          case "7":
          case "8":
            return "West"
          case "9":
            return "Pacific"
          default:
            return "Unknown"
        }
      }

      // Calculate service priority based on allowed video recording and other factors
      const calculatePriority = () => {
        if (allowVideoRecording) return "High"
        if (specialInstructions && specialInstructions.length > 100) return "Medium"
        return "Standard"
      }

      // Submit the data to your Google Sheet with enhanced metadata
      const addressData = {
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
        googleMapsLink: googleMapsLink,
        meta: {
          formType: "address",
          submitDate: new Date().toISOString(),
          browser: navigator.userAgent,
          page: window.location.pathname,
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        },
        data: {
          serviceArea: determineArea(zipCode),
          hasPreviousDiscount: localStorage.getItem(addressKey) !== null,
          schedulePriority: calculatePriority(),
          hasSpecialInstructions: specialInstructions.length > 0,
          instructionsLength: specialInstructions.length,
          fullAddressString: fullAddress,
          coordinatesRequested: true,
        },
      }

      // Instead of just submitting to Google Sheet directly here,
      // Pass the enhanced data to the parent component
      onSubmit(addressData)

      // Show success step briefly before closing
      setStep("success")
      setTimeout(() => {
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
        setStep("details")
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setStep("details")
      onClose()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Service Details</DialogTitle>
            <DialogDescription>
              {step === "details" && "Please provide your information so we can complete your cleaning service."}
              {step === "review" && "Please review your information before proceeding."}
              {step === "success" && "Your information has been submitted successfully!"}
            </DialogDescription>
          </DialogHeader>

          {step === "details" && (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={cn(errors.fullName && "text-destructive")}>
                  Full Name*
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={cn(errors.fullName && "border-destructive")}
                  required
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>
                    Email Address*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={cn(errors.email && "border-destructive")}
                    required
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={cn(errors.phone && "text-destructive")}>
                    Phone Number*
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className={cn(errors.phone && "border-destructive")}
                    required
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className={cn(errors.address && "text-destructive")}>
                  Address*
                </Label>
                <div className="relative">
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                    className={cn(errors.address && "border-destructive")}
                    required
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className={cn(errors.city && "text-destructive")}>
                    City*
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className={cn(errors.city && "border-destructive")}
                    required
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className={cn(errors.state && "text-destructive")}>
                    State*
                  </Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                    className={cn(errors.state && "border-destructive")}
                    required
                  />
                  {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className={cn(errors.zipCode && "text-destructive")}>
                    ZIP Code*
                  </Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10001"
                    className={cn(errors.zipCode && "border-destructive")}
                    required
                  />
                  {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Gate code, pet information, etc."
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {step === "review" && (
            <div className="py-4 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                    <p className="mt-1">{fullName}</p>
                    <p className="mt-1">{email}</p>
                    <p className="mt-1">{phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Service Address</h3>
                    <p className="mt-1">{address}</p>
                    <p className="mt-1">
                      {city}, {state} {zipCode}
                    </p>
                  </div>
                </div>

                {specialInstructions && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Special Instructions</h3>
                    <p className="mt-1 text-sm">{specialInstructions}</p>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Service Price</h3>
                      <p className="text-sm text-muted-foreground">Base price for selected service</p>
                    </div>
                    <p className="font-medium">{formatCurrency(calculatedPrice)}</p>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <h3 className="font-bold">Total Price</h3>
                    <p className="font-bold">
                      {formatCurrency(calculatedPrice - (allowVideoRecording ? videoRecordingDiscount : 0))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Added to Cart!</h3>
              <p className="text-muted-foreground mt-2">Your service has been added to your cart successfully.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
