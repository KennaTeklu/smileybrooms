"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ShoppingCart, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { US_STATES } from "@/lib/location-data"

export interface AddressFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  specialInstructions: string
  allowVideoRecording: boolean
}

interface InlineAddressFormProps {
  onSubmit: (data: AddressFormData) => void
  calculatedPrice: number
  serviceDetails: {
    roomName: string
    roomCount: number
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    frequency: string
  }
}

export function InlineAddressForm({ onSubmit, calculatedPrice, serviceDetails }: InlineAddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
    allowVideoRecording: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, allowVideoRecording: checked }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const videoRecordingDiscount = formData.allowVideoRecording ? 25 : 0
      const finalPrice = calculatedPrice - videoRecordingDiscount

      // Create complete service data
      const serviceData = {
        ...formData,
        serviceDetails,
        pricing: {
          basePrice: calculatedPrice,
          videoRecordingDiscount,
          finalPrice,
        },
      }

      // Call the onSubmit callback to add to cart
      onSubmit(serviceData)

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        specialInstructions: "",
        allowVideoRecording: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const finalPrice = calculatedPrice - (formData.allowVideoRecording ? 25 : 0)

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Service Address & Contact Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</h4>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-red-500" : ""}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Address</h4>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "border-red-500" : ""}
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "border-red-500" : ""}
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                  <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
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
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="w-1/2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? "border-red-500" : ""}
                placeholder="12345"
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="Entry instructions, pets, areas to avoid, etc."
              className="h-20"
            />
          </div>

          {/* Video Recording Discount */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="allowVideoRecording"
              checked={formData.allowVideoRecording}
              onCheckedChange={handleCheckboxChange}
            />
            <div>
              <div className="flex items-center">
                <Label htmlFor="allowVideoRecording" className="font-medium cursor-pointer">
                  Allow video recording for $25 off
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      We may record cleaning sessions for training and social media purposes. By allowing this, you'll
                      receive $25 off your order.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll record parts of the cleaning process for our social media and training.
              </p>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 dark:bg-gray-800/20 p-4 rounded-lg mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service Price:</span>
                <span>${calculatedPrice.toFixed(2)}</span>
              </div>
              {formData.allowVideoRecording && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Video Recording Discount:</span>
                  <span>-$25.00</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            <ShoppingCart className="h-4 w-4" />
            {isSubmitting ? "Adding to Cart..." : "Add to Cart"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your service will be added to cart with all the details you've provided.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
