"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Home, Loader2, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useDeviceDetection } from "@/lib/device-detection"
import { options } from "@/lib/options" // Import the options file

export default function AddressStep() {
  const router = useRouter()
  const { cart } = useCart()
  const { toast } = useToast()
  const deviceInfo = useDeviceDetection()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false)
  const [showPaymentSection, setShowPaymentSection] = useState(false)

  // Validation states
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [zipCodeError, setZipCodeError] = useState<string | null>(null)

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
    }

    // Load saved address data from localStorage
    const savedAddress = localStorage.getItem("checkout-address")
    if (savedAddress) {
      try {
        const data = JSON.parse(savedAddress)
        setFullName(data.fullName || "")
        setEmail(data.email || "")
        setPhone(data.phone || "")
        setAddressLine1(data.addressLine1 || "")
        setAddressLine2(data.addressLine2 || "")
        setCity(data.city || "")
        setState(data.state || "")
        setZipCode(data.zipCode || "")
      } catch (e) {
        console.error("Failed to parse saved address data from localStorage", e)
      }
    }
  }, [cart.items.length, router])

  const validateEmail = (value: string) => {
    if (!value.includes("@") || !value.includes(".")) {
      setEmailError("Please enter a valid email address.")
      return false
    }
    setEmailError(null)
    return true
  }

  const validatePhone = (value: string) => {
    if (!options.phoneRegex.test(value)) {
      setPhoneError("Please enter a valid 10-digit phone number (e.g., 555-555-5555).")
      return false
    }
    setPhoneError(null)
    return true
  }

  const validateZipCode = (value: string) => {
    if (!/^\d{5}(-\d{4})?$/.test(value)) {
      setZipCodeError("Please enter a valid 5-digit or 5+4 digit ZIP code.")
      return false
    }
    setZipCodeError(null)
    return true
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPhoneValid = validatePhone(phone)
    const isZipCodeValid = validateZipCode(zipCode)

    if (
      !fullName ||
      !email ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !zipCode ||
      !isEmailValid ||
      !isPhoneValid ||
      !isZipCodeValid
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and correct any errors.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAddress(true)

    try {
      const addressData = {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
      }
      localStorage.setItem("checkout-address", JSON.stringify(addressData))
      toast({
        title: "Address Saved",
        description: "Your address has been saved successfully.",
        variant: "success",
      })
      setShowPaymentSection(true)
      router.push("/checkout/payment")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAddress(false)
    }
  }

  const isFormDisabled = isSubmittingAddress || showPaymentSection

  return (
    <div
      className={`min-h-screen py-12 ${
        deviceInfo.isIOS
          ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
          : deviceInfo.isAndroid
            ? "bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-gray-900 dark:to-purple-900"
            : "bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      }`}
    >
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
            >
              <Home className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Your Address</h1>
            <p className="text-xl text-muted-foreground">Where should we send our cleaning team?</p>
          </div>
        </div>

        {/* Address Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Please provide your address details for the service.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        validateEmail(e.target.value)
                      }}
                      required
                      disabled={isFormDisabled}
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="555-555-5555"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      validatePhone(e.target.value)
                    }}
                    required
                    disabled={isFormDisabled}
                  />
                  {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    placeholder="123 Main St"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apt 4B"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Anytown"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="90210"
                      value={zipCode}
                      onChange={(e) => {
                        setZipCode(e.target.value)
                        validateZipCode(e.target.value)
                      }}
                      required
                      disabled={isFormDisabled}
                    />
                    {zipCodeError && <p className="text-red-500 text-sm">{zipCodeError}</p>}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Link href="/cart">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent" disabled={isFormDisabled}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  </Link>
                  <Button type="submit" size="lg" className="px-8" disabled={isFormDisabled}>
                    {isSubmittingAddress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Badges */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Data Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
