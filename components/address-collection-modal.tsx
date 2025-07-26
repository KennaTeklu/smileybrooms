"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, CreditCard } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Arizona ZIP code validation function
const isValidArizonaZip = (zipCode: string): boolean => {
  const arizonaZipRanges = [
    { min: 85001, max: 85099 }, // Phoenix metro area
    { min: 85201, max: 85299 }, // Mesa/Tempe/Chandler area
    { min: 85301, max: 85399 }, // Glendale/Peoria/Surprise area
    { min: 85501, max: 85599 }, // Globe/Superior area
    { min: 85601, max: 85699 }, // Sierra Vista/Benson area
    { min: 85701, max: 85799 }, // Tucson metro area
    { min: 86001, max: 86099 }, // Flagstaff/Sedona area
    { min: 86301, max: 86399 }, // Prescott/Prescott Valley area
    { min: 86401, max: 86499 }, // Kingman/Bullhead City area
    { min: 86501, max: 86599 }, // Yuma area
  ]

  // Clean the ZIP code (remove non-digits and limit to 5 characters)
  const cleanZip = zipCode.replace(/\D/g, "").substring(0, 5)
  if (cleanZip.length !== 5) return false

  const zipNum = Number.parseInt(cleanZip, 10)
  return arizonaZipRanges.some((range) => zipNum >= range.min && zipNum <= range.max)
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
}

interface AddressCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddressData) => void
}

export default function AddressCollectionModal({ isOpen, onClose, onSubmit }: AddressCollectionModalProps) {
  const [formData, setFormData] = useState<AddressData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "AZ", // Default to Arizona
    zipCode: "",
    specialInstructions: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required field validations
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Street address is required"
    if (!formData.city.trim()) newErrors.city = "Please select a city"
    if (!formData.state) newErrors.state = "State is required"

    // ZIP code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!isValidArizonaZip(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid Arizona ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)

      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "AZ",
        zipCode: "",
        specialInstructions: "",
      })

      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Enter Your Service Address
          </DialogTitle>
          <DialogDescription>
            Please provide your address and contact information for the cleaning service. We currently serve Glendale,
            Phoenix, and Peoria, Arizona.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</h3>

              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Service Address Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Address</h3>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                    <SelectTrigger id="city" className={errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Glendale">Glendale</SelectItem>
                      <SelectItem value="Phoenix">Phoenix</SelectItem>
                      <SelectItem value="Peoria">Peoria</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                    <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Arizona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AZ">Arizona</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="85001"
                  maxLength={5}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter a valid Arizona ZIP code</p>
              </div>
            </div>

            {/* Special Instructions Section */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Entry instructions, pets, areas to avoid, parking information, etc."
                className="h-20 resize-none"
              />
              <p className="text-xs text-gray-500">Help us provide better service with any special notes</p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-600">Service Area:</p>
                <p className="text-sm font-medium">Glendale, Phoenix & Peoria, AZ</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
