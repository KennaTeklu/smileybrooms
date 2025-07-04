"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { FormProgress } from "@/components/form-progress"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validateEmail, validatePhone } from "@/lib/validation"

export default function CheckoutAddressPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { calculateTotal } = useCart()
  const cartTotal = calculateTotal()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US", // Default to US
  })

  const { errors, validateField, validateForm } = useFormValidation(formData, {
    fullName: (value) => (value.trim() ? null : "Full Name is required."),
    email: (value) => (validateEmail(value) ? null : "Invalid email address."),
    phone: (value) => (validatePhone(value) ? null : "Invalid phone number."),
    address1: (value) => (value.trim() ? null : "Address Line 1 is required."),
    city: (value) => (value.trim() ? null : "City is required."),
    state: (value) => (value.trim() ? null : "State / Province is required."),
    zipCode: (value) => (value.trim() && /^\d{5}(-\d{4})?$/.test(value) ? null : "Invalid Zip Code."),
    country: (value) => (value.trim() ? null : "Country is required."),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      localStorage.setItem("checkoutAddress", JSON.stringify(formData))
      toast({
        title: "Address Saved!",
        description: "Your shipping address has been successfully recorded.",
      })
      router.push("/checkout/payment")
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const savedAddress = localStorage.getItem("checkoutAddress")
    if (savedAddress) {
      try {
        setFormData(JSON.parse(savedAddress))
      } catch (e) {
        console.error("Failed to parse saved address data")
      }
    }
  }, [])

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>

      <FormProgress currentStep={1} totalSteps={3} />

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        {/* Address Form */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => validateField("fullName", formData.fullName)}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => validateField("email", formData.email)}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => validateField("phone", formData.phone)}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  placeholder="123 Main St"
                  value={formData.address1}
                  onChange={handleChange}
                  onBlur={() => validateField("address1", formData.address1)}
                />
                {errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  placeholder="Apartment, Suite, etc."
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Anytown"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => validateField("city", formData.city)}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={() => validateField("state", formData.state)}
                  />
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipCode">Zip / Postal Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="90210"
                    value={formData.zipCode}
                    onChange={handleChange}
                    onBlur={() => validateField("zipCode", formData.zipCode)}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => handleSelectChange(value, "country")} value={formData.country}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>
              <Button type="submit" className="w-full mt-4">
                Continue to Payment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="lg:col-span-1 shadow-lg h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Taxes:</span>
              <span>Calculated at next step</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
