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
// Removed Checkbox import as it's no longer used for video consent in this modal

// Arizona ZIP code validation
const isValidArizonaZip = (zipCode: string): boolean => {
  const arizonaZipRanges = [
    { min: 85001, max: 85099 }, // Phoenix area
    { min: 85201, max: 85299 }, // Mesa/Tempe area
    { min: 85301, max: 85399 }, // Glendale/Peoria area
    { min: 85501, max: 85599 }, // Globe area
    { min: 85601, max: 85699 }, // Sierra Vista area
    { min: 85701, max: 85799 }, // Tucson area
    { min: 86001, max: 86099 }, // Flagstaff area
    { min: 86301, max: 86399 }, // Prescott area
    { min: 86401, max: 86499 }, // Kingman area
    { min: 86501, max: 86599 }, // Yuma area
  ]

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
  // Removed wantsLiveVideo and videoConsentDetails from this interface
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
    state: "AZ",
    zipCode: "",
    specialInstructions: "",
    // Removed wantsLiveVideo and videoConsentDetails from initial state
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

  // Removed handleVideoConsentChange as it's no longer relevant for this modal

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
    else if (!isValidArizonaZip(formData.zipCode)) newErrors.zipCode = "Please enter a valid Arizona ZIP code"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "AZ",
        zipCode: "",
        specialInstructions: "",
        // Removed wantsLiveVideo and videoConsentDetails from reset state
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
            Enter Your Address
          </DialogTitle>
          <DialogDescription>
            Please provide your address and contact information for the cleaning service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</h3>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500" : ""}
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
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Address</h3>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        city: value,
                      }))

                      // Clear error when field is edited
                      if (errors.city) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.city
                          return newErrors
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="city" className={errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select city" />
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
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state || "AZ"}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        state: value,
                      }))

                      // Clear error when field is edited
                      if (errors.state) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.state
                          return newErrors
                        })
                      }
                    }}
                  >
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
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? "border-red-500" : ""}
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

            {/* Removed Live Video Option from here */}
          </div>

          <DialogFooter className="pt-4">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-600">Total Price:</p>
                <p className="text-xl font-bold">{/* Price will be displayed in the cart component */}</p>
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
