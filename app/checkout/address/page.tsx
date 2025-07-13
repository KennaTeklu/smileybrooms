"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Home, Building, Navigation } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { CheckoutPreview } from "@/components/checkout-preview"
import { useRoomContext } from "@/lib/room-context"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validateAddress } from "@/lib/validation/address-validation"

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
}

export default function AddressCollectionPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice } = useCart()
  const { roomCounts, roomConfigs } = useRoomContext()
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
  })

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  })

  const { errors, validateField, validateForm, setErrors } = useFormValidation(address, validateAddress)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/pricing")
    }

    // Try to load saved address data from localStorage
    const savedAddress = localStorage.getItem("checkout-address")
    if (savedAddress) {
      try {
        setAddressData(JSON.parse(savedAddress))
      } catch (e) {
        console.error("Failed to parse saved address data")
      }
    }
  }, [cartItems.length, router])

  // Redirect to checkout page if no items in cart
  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/checkout")
    }
  }, [cartItems.length, router])

  const handleChange = (field: string, value: string) => {
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setAddress((prev) => ({ ...prev, [id]: value }))
    validateField(id as keyof typeof address, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Save address data to localStorage
        localStorage.setItem("checkout-address", JSON.stringify(addressData))

        // Proceed to checkout
        router.push("/checkout/payment")
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem saving your address information.",
          variant: "destructive",
        })
      } finally {
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

  if (cartItems.length === 0) {
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
            <h1 className="text-4xl font-bold mb-4">Service Address</h1>
            <p className="text-xl text-muted-foreground">Where would you like us to provide your cleaning service?</p>
          </div>
        </div>

        {/* Address Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Progress value={66} className="w-full mb-8" />
          <h1 className="text-3xl font-bold text-center mb-8">Checkout: Address Details</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Enter Your Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
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
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
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
                      <Link href="/cart">
                        <Button variant="outline" size="lg" className="px-8 bg-transparent">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Button>
                      </Link>
                      <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
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
              </Card>
            </div>
            <div className="lg:col-span-1">
              <CheckoutPreview
                cartItems={cartItems}
                totalPrice={getTotalPrice()}
                roomCounts={roomCounts}
                roomConfigs={roomConfigs}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
