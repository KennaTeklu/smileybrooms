"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Home, Building, Navigation } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { CheckoutButton } from "@/components/checkout-button" // Import the dedicated CheckoutButton

interface AddressStepProps {
  data: CheckoutData["address"]
  onSave: (data: CheckoutData["address"]) => void
  onNext: () => void // Still needed for non-Stripe paths, or if this step is part of a larger wizard
  onPrevious: () => void
  checkoutData: CheckoutData // To get contact info
}

export default function AddressStep({ data, onSave, onNext, onPrevious, checkoutData }: AddressStepProps) {
  const { toast } = useToast()
  const [addressData, setAddressData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false) // For local form validation/saving

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

  const handleCheckboxChange = (field: keyof CheckoutData["address"], checked: boolean) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: checked,
    }))
    if (field === "allowVideoRecording" && checked) {
      setAddressData((prev) => ({
        ...prev,
        videoConsentDetails: new Date().toISOString(),
      }))
    } else if (field === "allowVideoRecording" && !checked) {
      setAddressData((prev) => ({
        ...prev,
        videoConsentDetails: undefined,
      }))
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
    if (!addressData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  // This function will be called by the CheckoutButton's onClick,
  // but we still need a way to trigger validation before it.
  const handleProceedToPayment = () => {
    setIsSubmitting(true)
    if (validateForm()) {
      onSave(addressData) // Save the data before proceeding
      // The CheckoutButton's internal onClick will handle Stripe redirection
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
      setIsSubmitting(false)
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Contact Information (pre-filled from previous step) */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contact Information (Pre-filled)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={addressData.fullName}
                  disabled
                  className="mt-2 h-11 rounded-lg bg-gray-100"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={addressData.email}
                  disabled
                  className="mt-2 h-11 rounded-lg bg-gray-100"
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label htmlFor="phone" className="text-base">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={addressData.phone}
                disabled
                className="mt-2 h-11 rounded-lg bg-gray-100"
              />
            </motion.div>
          </div>

          {/* Address Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Type</h3>
            <div className="flex flex-wrap gap-4">
              <Card
                className={`cursor-pointer flex-1 min-w-[120px] sm:min-w-[150px] transition-all hover:shadow-md ${addressData.addressType === "residential" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
                onClick={() => handleChange("addressType", "residential")}
              >
                <CardContent className="p-4 text-center">
                  <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Residential</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer flex-1 min-w-[120px] sm:min-w-[150px] transition-all hover:shadow-md ${addressData.addressType === "commercial" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
                onClick={() => handleChange("addressType", "commercial")}
              >
                <CardContent className="p-4 text-center">
                  <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Commercial</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer flex-1 min-w-[120px] sm:min-w-[150px] transition-all hover:shadow-md ${addressData.addressType === "other" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Label htmlFor="address" className="text-base">
                Street Address
              </Label>
              <Input
                id="address"
                value={addressData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={`mt-2 h-11 rounded-lg ${errors.address ? "border-red-500" : ""}`}
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Label htmlFor="address2" className="text-base">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="address2"
                value={addressData.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
                className="mt-2 h-11 rounded-lg"
                placeholder="Apt 4B"
              />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Label htmlFor="city" className="text-base">
                  City
                </Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`mt-2 h-11 rounded-lg ${errors.city ? "border-red-500" : ""}`}
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Label htmlFor="state" className="text-base">
                  State
                </Label>
                <Select value={addressData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger id="state" className={`mt-2 h-11 rounded-lg ${errors.state ? "border-red-500" : ""}`}>
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
                {errors.state && <p className="text-red-500 text-xs mt-1.5">{errors.state}</p>}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Label htmlFor="zipCode" className="text-base">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={addressData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className={`mt-2 h-11 rounded-lg ${errors.zipCode ? "border-red-500" : ""}`}
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1.5">{errors.zipCode}</p>}
              </motion.div>
            </div>
          </div>

          {/* Special Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Special Instructions (Optional)</h3>
              <Textarea
                id="specialInstructions"
                value={addressData.specialInstructions}
                onChange={(e) => handleChange("specialInstructions", e.target.value)}
                placeholder="Entry instructions, pets, areas to avoid, etc."
                className="h-32 rounded-lg"
              />
            </div>
          </motion.div>

          {/* Additional Options (Video Recording) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          >
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Additional Options</h3>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Checkbox
                  id="videoRecording"
                  checked={addressData.allowVideoRecording}
                  onCheckedChange={(checked) => handleCheckboxChange("allowVideoRecording", checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="videoRecording" className="text-base">
                    Allow video recording for quality assurance and social media use
                    <span className="text-green-600 font-medium ml-2">(Save 10% on your order)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    By selecting this, you acknowledge that a live video stream of your cleaning may be recorded and
                    used for internal quality assurance and promotional purposes. Your privacy is important to us;
                    recordings will be handled in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
          >
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Checkbox
                id="terms"
                checked={addressData.agreeToTerms}
                onCheckedChange={(checked) => handleCheckboxChange("agreeToTerms", checked as boolean)}
                required
              />
              <Label htmlFor="terms" className="text-base">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1.5">{errors.agreeToTerms}</p>}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contact
            </Button>
            <CheckoutButton
              customerEmail={checkoutData.contact.email}
              customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
              customerAddress={{
                line1: addressData.address,
                city: addressData.city,
                state: addressData.state,
                postal_code: addressData.zipCode,
                country: "US", // Assuming US for now
              }}
              allowVideoRecording={addressData.allowVideoRecording}
              videoConsentDetails={addressData.videoConsentDetails}
              className="px-6 rounded-lg"
              size="default"
              onClick={handleProceedToPayment} // Trigger validation before Stripe
              disabled={isSubmitting || !addressData.agreeToTerms} // Disable if submitting or terms not agreed
            >
              Continue to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </CheckoutButton>
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
