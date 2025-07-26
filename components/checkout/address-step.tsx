"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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

interface AddressData {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface AddressStepProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: AddressData) => void
}

const AddressStep: React.FC<AddressStepProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AddressData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "AZ", // Default to Arizona
    zipCode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required"
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters"
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please select a city"
    }

    if (!formData.state) {
      newErrors.state = "State is required"
    }

    // ZIP code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!isValidArizonaZip(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid Arizona ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "AZ",
        zipCode: "",
      })

      onClose()
    } catch (error) {
      console.error("Error submitting address:", error)
      setErrors({ submit: "Failed to save address. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
          <DialogDescription>
            Enter your shipping address to complete your order. We serve Glendale, Phoenix, and Peoria, Arizona.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Address Field */}
          <div className="grid gap-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main Street, Apt 4B"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* City and State Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Glendale">Glendale</SelectItem>
                  <SelectItem value="Phoenix">Phoenix</SelectItem>
                  <SelectItem value="Peoria">Peoria</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Arizona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AZ">Arizona</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>
          </div>

          {/* ZIP Code Field */}
          <div className="grid gap-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="85001"
              maxLength={5}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            <p className="text-xs text-gray-500">Enter a valid Arizona ZIP code</p>
          </div>

          {/* Submit Error */}
          {errors.submit && <div className="text-sm text-red-500 text-center">{errors.submit}</div>}
        </form>

        <DialogFooter>
          <div className="w-full flex flex-col gap-3">
            <div className="text-center text-sm text-gray-600">Service Area: Glendale, Phoenix & Peoria, Arizona</div>
            <Button type="submit" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Saving Address..." : "Continue to Payment"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddressStep
