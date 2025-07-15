"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Home, Building, Navigation, Mail } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { generateOutOfServiceMailtoLink } from "@/lib/email-utils"

interface AddressStepProps {
  data: CheckoutData["address"]
  onSave: (data: CheckoutData["address"]) => void
  onNext: () => void
  onPrevious: () => void
}

export default function AddressStep({ data, onSave, onNext, onPrevious }: AddressStepProps) {
  const { toast } = useToast()
  const [addressData, setAddressData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOutOfServiceDialog, setShowOutOfServiceDialog] = useState(false)

  useEffect(() => {
    setAddressData(data)
  }, [data])

  const handleChange = (field: string, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!addressData.fullName.trim()) newErrors.fullName = "Name is required"
    if (!addressData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(addressData.email)) newErrors.email = "Email is invalid"
    if (!addressData.phone.trim()) newErrors.phone = "Phone is required"
    if (!addressData.address.trim()) newErrors.address = "Address is required"
    if (!addressData.city.trim()) newErrors.city = "City is required"
    if (!addressData.state) newErrors.state = "State is required"
    if (!addressData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (addressData.state !== "AZ") {
        // Check if state is not Arizona
        setShowOutOfServiceDialog(true)
        toast({
          title: "Service Area Limitation",
          description: "Currently, we only provide services in Arizona. Please contact us for future plans.",
          variant: "destructive",
        })
      } else {
        setIsSubmitting(true)
        onSave(addressData)
        onNext()
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  const getAddressTypeIcon = () => {
    switch (addressData.addressType) {
      case "commercial":
        return <Building className="h-5 w-5" />
      case "other":
        return <Navigation className="h-5 w-5" />
      default:
        return <Home className="h-5 w-5" />
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Service Address
        </CardTitle>
        <CardDescription>Where would you like us to provide your cleaning service?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information (pre-filled from previous step) */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <Input id="fullName" value={addressData.fullName} disabled className="mt-2 h-12 bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input id="email" type="email" value={addressData.email} disabled className="mt-2 h-12 bg-gray-100" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-base">
                Phone
              </Label>
              <Input id="phone" type="tel" value={addressData.phone} disabled className="mt-2 h-12 bg-gray-100" />
            </div>
          </div>

          {/* Address Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Type</h3>
            <div className="flex flex-wrap gap-4">
              <Card
                className={`cursor-pointer flex-1 min-w-[150px] ${addressData.addressType === "residential" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                onClick={() => handleChange("addressType", "residential")}
              >
                <CardContent className="p-4 text-center">
                  <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Residential</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer flex-1 min-w-[150px] ${addressData.addressType === "commercial" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                onClick={() => handleChange("addressType", "commercial")}
              >
                <CardContent className="p-4 text-center">
                  <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Commercial</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer flex-1 min-w-[150px] ${addressData.addressType === "other" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
                onClick={() => handleChange("addressType", "other")}
              >
                <CardContent className="p-4 text-center">
                  <Navigation className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Other</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              {getAddressTypeIcon()}
              Service Address
            </h3>
            <div>
              <Label htmlFor="address" className="text-base">
                Street Address
              </Label>
              <Input
                id="address"
                value={addressData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={`mt-2 h-12 ${errors.address ? "border-red-500" : ""}`}
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <Label htmlFor="address2" className="text-base">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="address2"
                value={addressData.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
                className="mt-2 h-12"
                placeholder="Apt 4B"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city" className="text-base">
                  City
                </Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`mt-2 h-12 ${errors.city ? "border-red-500" : ""}`}
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state" className="text-base">
                  State
                </Label>
                <Select value={addressData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger id="state" className={`mt-2 h-12 ${errors.state ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-base">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={addressData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className={`mt-2 h-12 ${errors.zipCode ? "border-red-500" : ""}`}
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Special Instructions (Optional)</h3>
            <Textarea
              id="specialInstructions"
              value={addressData.specialInstructions}
              onChange={(e) => handleChange("specialInstructions", e.target.value)}
              placeholder="Entry instructions, pets, areas to avoid, etc."
              className="h-32"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contact
            </Button>
            <Button type="submit" size="lg" className="px-8" disabled={isSubmitting || showOutOfServiceDialog}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={showOutOfServiceDialog} onOpenChange={setShowOutOfServiceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Service Area Limitation</DialogTitle>
            <DialogDescription>
              Currently, we only provide services in Arizona. We'd love to hear from you if you're interested in our
              services in {addressData.state}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Click the button below to send us an email with your inquiry.</p>
          </div>
          <DialogFooter>
            <a
              href={generateOutOfServiceMailtoLink(addressData.state)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowOutOfServiceDialog(false)}
            >
              <Button type="button">
                <Mail className="mr-2 h-4 w-4" />
                Email Us About {addressData.state}
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
