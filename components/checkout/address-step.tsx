"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useEffect, useCallback } from "react" // Added useCallback
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Home, Building, Navigation, CreditCard, Lock, Loader2 } from "lucide-react" // Added Loader2
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import { motion } from "framer-motion"
import { PricingEngine } from "@/utils/pricing-engine"
import { Checkbox } from "@/components/ui/checkbox"
import { options } from "@/lib/options" // Declared the variable before using it

// Re-defining types based on the attached file's structure
type AddressData = {
  fullName: string
  email: string
  phone: string
  address: string
  address2: string
  city: string
  state: string
  zipCode: string
  specialInstructions: string
  addressType: "residential" | "commercial" | "other"
  allowVideoRecording: boolean
  videoConsentDetails?: string
  agreeToTerms: boolean
}

type StripeSessionData = {
  sessionId?: string
  paymentStatus?: "pending" | "processing" | "succeeded" | "failed"
}

// Helper for email validation
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
// Helper for phone validation (basic)
const isValidPhone = (phone: string) => /^$$?([0-9]{3})$$?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)
// Helper for zip code validation (basic US 5-digit)
const isValidZipCode = (zip: string) => /^\d{5}$/.test(zip)

export default function AddressCollectionPage(): ReactElement {
  const router = useRouter()
  const { cart } = useCart()
  const { toast } = useToast()

  const [addressData, setAddressData] = useState<AddressData>({
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
    allowVideoRecording: false,
    videoConsentDetails: undefined,
    agreeToTerms: false,
  })

  const [stripeSession, setStripeSession] = useState<StripeSessionData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false) // Renamed for clarity
  const [isCreatingStripeSession, setIsCreatingStripeSession] = useState(false)
  const [showPaymentSection, setShowPaymentSection] = useState(false)

  // Calculate pricing using the unified pricing engine
  const pricing = useState(() => {
    if (cart.items.length === 0) return null

    const rooms = cart.items
      .filter((item) => item.roomType)
      .map((item) => ({
        room: item.roomType!,
        quantity: item.quantity,
        selectedTier: item.selectedTier,
        selectedAddOns: item.selectedAddOns,
        selectedReductions: item.selectedReductions,
        unitPrice: item.unitPrice,
      }))

    const addOns = cart.items
      .filter((item) => !item.roomType)
      .map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice,
      }))

    // Include video recording discount if applicable
    const discountCodes = addressData.allowVideoRecording ? ["VIDEO_RECORDING_DISCOUNT"] : []
    if (cart.couponCode) {
      discountCodes.push(cart.couponCode)
    }

    return PricingEngine.formatForDisplay(
      PricingEngine.calculate({
        rooms: rooms,
        addOns: addOns,
        frequency: cart.paymentFrequency || "one-time",
        cleanlinessMultiplier: 1,
        discountCodes: discountCodes,
        paymentMethod: "card",
      }),
      { showDetailed: true, includeImages: true },
    )
  })[0]

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      router.push("/pricing") // Redirect to a page where they can add items
      return
    }

    // Try to load saved address data from localStorage
    const savedAddress = localStorage.getItem("checkout-address")
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress)
        setAddressData(parsed)
        // If we have complete address data, show payment section
        if (
          parsed.fullName &&
          parsed.email &&
          parsed.address &&
          parsed.city &&
          parsed.state &&
          parsed.zipCode &&
          parsed.agreeToTerms
        ) {
          setShowPaymentSection(true)
        }
      } catch (e) {
        console.error("Failed to parse saved address data from localStorage:", e)
      }
    }

    // Check for existing Stripe session (less critical for redirect, more for status)
    const savedStripeSession = localStorage.getItem("stripe-session")
    if (savedStripeSession) {
      try {
        setStripeSession(JSON.parse(savedStripeSession))
      } catch (e) {
        console.error("Failed to parse Stripe session data from localStorage:", e)
      }
    }
  }, [cart.items.length, router, toast])

  const handleChange = useCallback(
    (field: string, value: string | boolean) => {
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Clear error when field is edited
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleCheckboxChange = useCallback(
    (field: keyof AddressData, checked: boolean) => {
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
      // Clear terms error if checked
      if (field === "agreeToTerms" && checked && errors.agreeToTerms) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.agreeToTerms
          return newErrors
        })
      }
    },
    [errors],
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!addressData.fullName.trim()) newErrors.fullName = "Full Name is required."
    if (!addressData.email.trim()) newErrors.email = "Email is required."
    else if (!isValidEmail(addressData.email)) newErrors.email = "Please enter a valid email address."

    if (!addressData.phone.trim()) newErrors.phone = "Phone number is required."
    else if (!isValidPhone(addressData.phone)) newErrors.phone = "Please enter a valid 10-digit phone number."

    if (!addressData.address.trim()) newErrors.address = "Street Address is required."
    if (!addressData.city.trim()) newErrors.city = "City is required."
    if (!addressData.state) newErrors.state = "State is required."
    if (!addressData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required."
    else if (!isValidZipCode(addressData.zipCode)) newErrors.zipCode = "Please enter a valid 5-digit ZIP code."
    if (!addressData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [addressData])

  const handleAddressSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (validateForm()) {
        setIsSubmittingAddress(true)

        try {
          // Save address data to localStorage
          localStorage.setItem("checkout-address", JSON.stringify(addressData))

          setShowPaymentSection(true)

          toast({
            title: "Address Saved!",
            description: "Your service address has been saved. Proceed to payment.",
            variant: "success",
          })

          // Smooth scroll to payment section
          setTimeout(() => {
            document.getElementById("payment-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }, 100)
        } catch (error) {
          console.error("Error saving address:", error)
          toast({
            title: "Error Saving Address",
            description: "There was a problem saving your address information. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsSubmittingAddress(false)
        }
      } else {
        toast({
          title: "Please Correct Errors",
          description: "Some required fields are missing or invalid. Please review your information.",
          variant: "destructive",
        })
      }
    },
    [addressData, validateForm, toast],
  )

  const createStripeSession = useCallback(async () => {
    if (!pricing) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before proceeding to payment.",
        variant: "destructive",
      })
      router.push("/pricing")
      return
    }

    if (!validateForm()) {
      toast({
        title: "Address Incomplete",
        description: "Please complete all required address fields and agree to the terms.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingStripeSession(true)

    try {
      // Prepare line items for Stripe
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
            metadata: {
              id: item.id,
              sku: item.id, // Using id as sku for simplicity
              type: item.roomType ? "room" : "addon",
              ...(item.roomType && { roomType: item.roomType }),
              ...(item.selectedTier && { selectedTier: item.selectedTier }),
              ...(item.selectedAddOns && { selectedAddOns: JSON.stringify(item.selectedAddOns) }),
              ...(item.selectedReductions && { selectedReductions: JSON.stringify(item.selectedReductions) }),
              paymentFrequency: item.paymentFrequency || "one-time",
              isFullHousePromoApplied: item.isFullHousePromoApplied ? "true" : "false",
              paymentType: item.paymentType || "online",
              sourceSection: item.sourceSection || "unknown",
              // Stringify any complex metadata objects
              ...(item.metadata &&
                Object.keys(item.metadata).reduce((acc, key) => {
                  acc[key] =
                    typeof item.metadata[key] === "object"
                      ? JSON.stringify(item.metadata[key])
                      : String(item.metadata[key])
                  return acc
                }, {})),
            },
          },
          unit_amount: Math.round(item.unitPrice * 100), // Stripe expects amount in cents
        },
        quantity: item.quantity,
      }))

      // Add discount as a line item if applicable (Stripe Checkout handles coupons differently, but for custom discounts, this works)
      if (pricing.discounts && pricing.discounts.length > 0) {
        pricing.discounts.forEach((discount) => {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: `Discount: ${discount.name}`,
                metadata: {
                  type: "discount",
                  code: discount.code || discount.name,
                },
              },
              unit_amount: -Math.round(discount.amount * 100), // Negative amount for discount
            },
            quantity: 1,
          })
        })
      }

      const sessionData = {
        lineItems: lineItems,
        customerInfo: {
          name: addressData.fullName,
          email: addressData.email,
          phone: addressData.phone,
          address: {
            line1: addressData.address,
            line2: addressData.address2,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.zipCode,
            country: "US", // Assuming US for now
          },
        },
        metadata: {
          cartId: cart.id || Date.now().toString(),
          frequency: cart.paymentFrequency || "one-time",
          cleanlinessLevel: cart.cleanlinessLevel || "standard",
          allowVideoRecording: addressData.allowVideoRecording ? "true" : "false",
          videoConsentDetails: addressData.videoConsentDetails || "N/A",
          agreeToTerms: addressData.agreeToTerms ? "true" : "false",
          // Add any other top-level cart metadata
          ...cart.metadata,
        },
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create checkout session")
      }

      const { sessionId, url } = await response.json()

      // Save session info
      const stripeSessionData = { sessionId, paymentStatus: "pending" }
      setStripeSession(stripeSessionData)
      localStorage.setItem("stripe-session", JSON.stringify(stripeSessionData))

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error: any) {
      console.error("Error creating Stripe session:", error)
      toast({
        title: "Payment Error",
        description: error.message || "Unable to initialize payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingStripeSession(false)
    }
  }, [addressData, cart, pricing, toast, validateForm, router])

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

  if (cart.items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Service Address & Payment</h1>
            <p className="text-xl text-muted-foreground">Complete your booking in just two simple steps</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${showPaymentSection ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Address</span>
            </div>
            <div className={`h-0.5 w-16 ${showPaymentSection ? "bg-green-500" : "bg-gray-300"}`} />
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${showPaymentSection ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                Service Address
              </CardTitle>
              <CardDescription>
                Please provide the address where you'd like us to perform the cleaning service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Contact Information</h3>

                  <div>
                    <Label htmlFor="fullName" className="text-base">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={addressData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={`mt-2 h-12 ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="John Doe"
                      disabled={isSubmittingAddress || showPaymentSection}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={addressData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`mt-2 h-12 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="john.doe@example.com"
                        disabled={isSubmittingAddress || showPaymentSection}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={addressData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={`mt-2 h-12 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder="(555) 123-4567"
                        disabled={isSubmittingAddress || showPaymentSection}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Type</h3>

                  <div className="flex flex-wrap gap-4">
                    {["residential", "commercial", "other"].map((type) => (
                      <Card
                        key={type}
                        className={`cursor-pointer flex-1 min-w-[150px] ${
                          addressData.addressType === type ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                        } ${isSubmittingAddress || showPaymentSection ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={() =>
                          !(isSubmittingAddress || showPaymentSection) && handleChange("addressType", type)
                        }
                      >
                        <CardContent className="p-4 text-center">
                          {type === "residential" && <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />}
                          {type === "commercial" && <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />}
                          {type === "other" && <Navigation className="h-8 w-8 mx-auto mb-2 text-blue-600" />}
                          <p className="font-medium capitalize">{type}</p>
                        </CardContent>
                      </Card>
                    ))}
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
                      disabled={isSubmittingAddress || showPaymentSection}
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
                      disabled={isSubmittingAddress || showPaymentSection}
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
                        disabled={isSubmittingAddress || showPaymentSection}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-base">
                        State
                      </Label>
                      <Select
                        value={addressData.state}
                        onValueChange={(value) => handleChange("state", value)}
                        disabled={isSubmittingAddress || showPaymentSection}
                      >
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
                        disabled={isSubmittingAddress || showPaymentSection}
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
                    disabled={isSubmittingAddress || showPaymentSection}
                  />
                </div>

                {/* Additional Options (Video Recording) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }} // Adjusted delay
                >
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Additional Options</h3>
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Checkbox
                        id="videoRecording"
                        checked={addressData.allowVideoRecording}
                        onCheckedChange={(checked) => handleCheckboxChange("allowVideoRecording", checked as boolean)}
                        disabled={isSubmittingAddress || showPaymentSection}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="videoRecording" className="text-base">
                          Allow video recording for quality assurance and social media use
                          <span className="text-green-600 font-medium ml-2">(Save 10% on your order)</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          By selecting this, you acknowledge that a live video stream of your cleaning may be recorded
                          and used for internal quality assurance and promotional purposes. Your privacy is important to
                          us; recordings will be handled in accordance with our Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }} // Adjusted delay
                >
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Checkbox
                      id="terms"
                      checked={addressData.agreeToTerms}
                      onCheckedChange={(checked) => handleCheckboxChange("agreeToTerms", checked as boolean)}
                      required
                      disabled={isSubmittingAddress || showPaymentSection}
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
                  {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                </motion.div>

                {/* Address Submit Button */}
                {!showPaymentSection && (
                  <div className="flex justify-between pt-6">
                    <Link href="/cart">
                      <Button variant="outline" size="lg" className="px-8 bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" size="lg" className="px-8" disabled={isSubmittingAddress}>
                      {isSubmittingAddress ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Saving Address...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Edit Address Button */}
                {showPaymentSection && (
                  <div className="pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPaymentSection(false)}
                      className="w-full"
                      disabled={isCreatingStripeSession} // Disable if payment session is being created
                    >
                      Edit Address Information
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Section */}
        {showPaymentSection && pricing && (
          <motion.div
            id="payment-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Complete Your Payment
                </CardTitle>
                <CardDescription>Review your order and proceed with secure payment through Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Order Summary */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-medium">Order Summary</h3>

                  {/* Room Charges */}
                  {pricing.roomDisplay && pricing.roomDisplay.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Rooms</h4>
                      {pricing.roomDisplay.map((room, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {room.image &&
                              options.includeImages && ( // Conditionally render image
                                <img
                                  src={room.image || "/placeholder.svg"}
                                  alt={room.room}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              )}
                            {room.icon}
                            <div>
                              <p className="font-medium">{room.room}</p>
                              {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${room.adjustedRate.toFixed(2)}</p>
                            {room.baseRate !== room.adjustedRate && (
                              <p className="text-sm text-muted-foreground line-through">${room.baseRate.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add-On Charges */}
                  {pricing.addOnDisplay && pricing.addOnDisplay.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Add-Ons</h4>
                      {pricing.addOnDisplay.map((addon, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {addon.icon}
                            <div>
                              <p className="font-medium">{addon.name}</p>
                              {addon.badge && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {addon.badge}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="font-medium">${addon.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Discounts */}
                  {pricing.discounts && pricing.discounts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-600">Discounts Applied</h4>
                      {pricing.discounts.map((discount, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <p className="font-medium text-green-700 dark:text-green-300">{discount.name}</p>
                          <p className="font-medium text-green-700 dark:text-green-300">
                            -${discount.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subtotal, Tax, Total */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between text-base">
                      <p className="text-gray-700 dark:text-gray-300">Subtotal</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">${pricing.subtotal.toFixed(2)}</p>
                    </div>
                    {pricing.tax !== undefined && (
                      <div className="flex items-center justify-between text-base">
                        <p className="text-gray-700 dark:text-gray-300">Estimated Tax</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">${pricing.tax.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-lg font-semibold">Total Amount</p>
                        <p className="text-sm text-muted-foreground">
                          Service frequency: {cart.paymentFrequency || "one-time"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${pricing.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">per service</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Button */}
                <div className="space-y-4">
                  <Button
                    onClick={createStripeSession}
                    disabled={isCreatingStripeSession || !addressData.agreeToTerms || pricing.total <= 0} // Disable if submitting, terms not agreed, or total is zero/negative
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isCreatingStripeSession ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                        Creating Secure Checkout...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-3 h-5 w-5" />
                        Pay Securely with Stripe - ${pricing.total.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      Secure Payment
                    </div>
                    <div>•</div>
                    <div>SSL Encrypted</div>
                    <div>•</div>
                    <div>PCI Compliant</div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    By clicking "Pay Securely with Stripe", you agree to our Terms of Service and Privacy Policy. Your
                    payment information is processed securely by Stripe and never stored on our servers.
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <Link href="/cart">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
