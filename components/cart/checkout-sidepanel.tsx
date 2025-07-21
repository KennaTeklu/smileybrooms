"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  User,
  Check,
  Shield,
  ArrowRight,
  X,
  Home,
  Building,
  Navigation,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Clock,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import type { CheckoutData } from "@/lib/types"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import { US_STATES } from "@/lib/location-data"

type CheckoutStepId = "welcome" | "contact" | "address" | "confirmation"

interface CheckoutSidePanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCheckoutComplete: (data: CheckoutData) => void
}

export default function CheckoutSidePanel({ isOpen, onOpenChange, onCheckoutComplete }: CheckoutSidePanelProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState<CheckoutStepId>("welcome")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    address: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      addressType: "residential",
    },
    payment: {
      paymentMethod: "card",
      allowVideoRecording: false,
      agreeToTerms: false,
    },
  })

  // Auto-save functionality
  useEffect(() => {
    if (!isOpen) return

    const autoSave = setTimeout(() => {
      if (checkoutData.contact.firstName || checkoutData.contact.email) {
        localStorage.setItem("checkout-contact", JSON.stringify(checkoutData.contact))
      }
      if (checkoutData.address.address || checkoutData.address.city) {
        localStorage.setItem("checkout-address", JSON.stringify(checkoutData.address))
      }
    }, 1000)

    return () => clearTimeout(autoSave)
  }, [checkoutData, isOpen])

  // Load saved data
  useEffect(() => {
    if (!isOpen) return

    try {
      const savedContact = localStorage.getItem("checkout-contact")
      const savedAddress = localStorage.getItem("checkout-address")

      if (savedContact || savedAddress) {
        setCheckoutData((prev) => ({
          ...prev,
          contact: savedContact ? JSON.parse(savedContact) : prev.contact,
          address: savedAddress ? JSON.parse(savedAddress) : prev.address,
        }))

        // Skip welcome if we have saved data
        if (savedContact) {
          setCurrentStep("contact")
        }
      }
    } catch (e) {
      console.error("Failed to load saved data", e)
    }
  }, [isOpen])

  const validateStep = (step: CheckoutStepId) => {
    const newErrors: Record<string, string> = {}

    if (step === "contact") {
      const { firstName, lastName, email, phone } = checkoutData.contact
      if (!firstName.trim()) newErrors.firstName = "We'd love to know your first name"
      if (!lastName.trim()) newErrors.lastName = "And your last name too"
      if (!email.trim()) newErrors.email = "We need your email to send updates"
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address"
      if (!phone.trim()) newErrors.phone = "Phone number helps us coordinate the service"
    }

    if (step === "address") {
      const { address, city, state, zipCode } = checkoutData.address
      if (!address.trim()) newErrors.address = "Where should our team go?"
      if (!city.trim()) newErrors.city = "Which city are you in?"
      if (!state) newErrors.state = "Please select your state"
      if (!zipCode.trim()) newErrors.zipCode = "ZIP code helps us find you"
      else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) newErrors.zipCode = "Please enter a valid ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (section: "contact" | "address", field: string, value: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleStepTransition = async (nextStep: CheckoutStepId) => {
    if (currentStep === "contact" && !validateStep("contact")) {
      // Focus first error field
      const firstError = Object.keys(errors)[0]
      const errorElement = document.getElementById(firstError)
      errorElement?.focus()
      return
    }

    if (currentStep === "address" && !validateStep("address")) {
      const firstError = Object.keys(errors)[0]
      const errorElement = document.getElementById(firstError)
      errorElement?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      if (currentStep === "contact") {
        // Auto-populate address fields
        setCheckoutData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            fullName: `${prev.contact.firstName} ${prev.contact.lastName}`,
            email: prev.contact.email,
            phone: prev.contact.phone,
          },
        }))
      }

      if (nextStep === "confirmation") {
        // Complete checkout
        await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate processing
        onCheckoutComplete(checkoutData)
        onOpenChange(false)

        toast({
          title: "🎉 All set!",
          description: "Your information has been saved. Let's finalize your order!",
        })
        return
      }

      setCurrentStep(nextStep)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12 px-6"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Let's get your space sparkling! ✨
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          We just need a few quick details to personalize your cleaning experience. This will only take 2 minutes!
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Takes less than 2 minutes</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your information is secure</span>
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep("contact")}
        size="lg"
        className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Let's Start!
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  )

  const renderContactStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Nice to meet you! 👋</h2>
            <p className="text-muted-foreground">Tell us a bit about yourself</p>
          </div>
        </div>
        <Badge variant="secondary" className="mb-6">
          Step 1 of 2
        </Badge>
      </div>

      <div className="space-y-6" ref={formRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={checkoutData.contact.firstName}
              onChange={(e) => handleInputChange("contact", "firstName", e.target.value)}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              className={`h-12 transition-all ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500"
                  : focusedField === "firstName"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
              }`}
              placeholder="John"
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={checkoutData.contact.lastName}
              onChange={(e) => handleInputChange("contact", "lastName", e.target.value)}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              className={`h-12 transition-all ${
                errors.lastName
                  ? "border-red-500 focus:border-red-500"
                  : focusedField === "lastName"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
              }`}
              placeholder="Doe"
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={checkoutData.contact.email}
            onChange={(e) => handleInputChange("contact", "email", e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className={`h-12 transition-all ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : focusedField === "email"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : ""
            }`}
            placeholder="john.doe@example.com"
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
          {!errors.email && checkoutData.contact.email && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              We'll send booking confirmations here
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={checkoutData.contact.phone}
            onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
            className={`h-12 transition-all ${
              errors.phone
                ? "border-red-500 focus:border-red-500"
                : focusedField === "phone"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : ""
            }`}
            placeholder="(555) 123-4567"
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
          {!errors.phone && checkoutData.contact.phone && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4" />
              For service coordination and updates
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <Button
          onClick={() => handleStepTransition("address")}
          disabled={isSubmitting}
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              Continue to Address
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )

  const renderAddressStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Where should we work our magic? ✨</h2>
            <p className="text-muted-foreground">Tell us about your space</p>
          </div>
        </div>
        <Badge variant="secondary" className="mb-6">
          Step 2 of 2
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium">What type of space is this?</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "residential", icon: Home, label: "Home", desc: "House, apartment, condo" },
              { value: "commercial", icon: Building, label: "Business", desc: "Office, store, restaurant" },
              { value: "other", icon: Navigation, label: "Other", desc: "Something else" },
            ].map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange("address", "addressType", value)}
                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all hover:shadow-md ${
                  checkoutData.address.addressType === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground text-center">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Address Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-base font-medium">
              Street Address *
            </Label>
            <Input
              id="address"
              value={checkoutData.address.address}
              onChange={(e) => handleInputChange("address", "address", e.target.value)}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              className={`h-12 transition-all ${
                errors.address
                  ? "border-red-500 focus:border-red-500"
                  : focusedField === "address"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : ""
              }`}
              placeholder="123 Main Street"
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            {errors.address && (
              <p id="address-error" className="text-sm text-red-500 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2" className="text-base font-medium">
              Apartment, Suite, etc. (Optional)
            </Label>
            <Input
              id="address2"
              value={checkoutData.address.address2}
              onChange={(e) => handleInputChange("address", "address2", e.target.value)}
              className="h-12"
              placeholder="Apt 4B, Suite 200, Floor 3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base font-medium">
                City *
              </Label>
              <Input
                id="city"
                value={checkoutData.address.city}
                onChange={(e) => handleInputChange("address", "city", e.target.value)}
                onFocus={() => setFocusedField("city")}
                onBlur={() => setFocusedField(null)}
                className={`h-12 transition-all ${
                  errors.city
                    ? "border-red-500 focus:border-red-500"
                    : focusedField === "city"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                }`}
                placeholder="New York"
                aria-describedby={errors.city ? "city-error" : undefined}
              />
              {errors.city && (
                <p id="city-error" className="text-sm text-red-500">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-base font-medium">
                State *
              </Label>
              <Select
                value={checkoutData.address.state}
                onValueChange={(value) => handleInputChange("address", "state", value)}
              >
                <SelectTrigger className={`h-12 ${errors.state ? "border-red-500" : ""}`}>
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
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-base font-medium">
                ZIP Code *
              </Label>
              <Input
                id="zipCode"
                value={checkoutData.address.zipCode}
                onChange={(e) => handleInputChange("address", "zipCode", e.target.value)}
                onFocus={() => setFocusedField("zipCode")}
                onBlur={() => setFocusedField(null)}
                className={`h-12 transition-all ${
                  errors.zipCode
                    ? "border-red-500 focus:border-red-500"
                    : focusedField === "zipCode"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                }`}
                placeholder="10001"
                aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
              />
              {errors.zipCode && (
                <p id="zipCode-error" className="text-sm text-red-500">
                  {errors.zipCode}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions" className="text-base font-medium">
              Anything special we should know? (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              value={checkoutData.address.specialInstructions}
              onChange={(e) => handleInputChange("address", "specialInstructions", e.target.value)}
              placeholder="Entry instructions, pets, areas to focus on or avoid, parking info..."
              className="h-24 resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Help us provide the best service by sharing any important details
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t space-y-4">
        <Button
          onClick={() => handleStepTransition("confirmation")}
          disabled={isSubmitting}
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              Review My Order
              <Check className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <Button variant="ghost" onClick={() => setCurrentStep("contact")} className="w-full">
          ← Back to Contact Info
        </Button>
      </div>
    </motion.div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 flex flex-col"
        aria-labelledby="checkout-title"
        aria-describedby="checkout-description"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-green-950/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 id="checkout-title" className="text-xl font-bold">
                {currentStep === "welcome" && "Welcome!"}
                {currentStep === "contact" && "Contact Info"}
                {currentStep === "address" && "Service Address"}
                {currentStep === "confirmation" && "Almost Done!"}
              </h1>
              <p id="checkout-description" className="text-sm text-muted-foreground">
                {currentStep === "welcome" && "Let's get started with your cleaning service"}
                {currentStep === "contact" && "Tell us how to reach you"}
                {currentStep === "address" && "Where should we clean?"}
                {currentStep === "confirmation" && "Reviewing your information"}
              </p>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close checkout">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Card className="border-0 shadow-none h-full">
            <CardContent className="p-0 h-full">
              <AnimatePresence mode="wait">
                {currentStep === "welcome" && renderWelcomeStep()}
                {currentStep === "contact" && renderContactStep()}
                {currentStep === "address" && renderAddressStep()}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>100% Satisfaction</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
