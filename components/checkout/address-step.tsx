"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MapPin, Home, Building, Navigation, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"

interface AddressStepProps {
  data: CheckoutData["address"]
  onSave: (data: CheckoutData["address"]) => void
  onNext: () => void
  onPrevious: () => void
}

export default function AddressStep({ data, onSave, onNext, onPrevious }: AddressStepProps) {
  const { toast } = useToast()
  const [addressData, setAddressData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validFields, setValidFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setAddressData(data)
  }, [data])

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "address":
        return value.trim().length >= 5 ? "" : "Please enter a complete street address"
      case "city":
        return value.trim().length >= 2 ? "" : "Please enter a valid city name"
      case "state":
        return value ? "" : "Please select a state"
      case "zipCode":
        const zipRegex = /^\d{5}(-\d{4})?$/
        return zipRegex.test(value) ? "" : "Please enter a valid ZIP code"
      default:
        return ""
    }
  }

  const handleChange = (field: string, value: string) => {
    let processedValue = value

    if (field === "zipCode") {
      processedValue = value.replace(/[^\d-]/g, "")
    }

    setAddressData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))

    // Real-time validation for required fields
    if (["address", "city", "state", "zipCode"].includes(field)) {
      const error = validateField(field, processedValue)
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }))

      setValidFields((prev) => ({
        ...prev,
        [field]: !error,
      }))
    }

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields = ["address", "city", "state", "zipCode"]

    requiredFields.forEach((field) => {
      const error = validateField(field, addressData[field as keyof typeof addressData])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        onSave(addressData)
        onNext()
        setIsSubmitting(false)
        toast({
          title: "Address information saved",
          description: "Moving to payment details...",
        })
      }, 800)
    } else {
      toast({
        title: "Please check your address",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  const getAddressTypeIcon = () => {
    switch (addressData.addressType) {
      case "commercial":
        return <Building className="h-6 w-6" />
      case "other":
        return <Navigation className="h-6 w-6" />
      default:
        return <Home className="h-6 w-6" />
    }
  }

  const getFieldIcon = (field: string) => {
    if (!touched[field]) return null
    return validFields[field] ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : errors[field] ? (
      <AlertCircle className="h-5 w-5 text-red-500" />
    ) : null
  }

  const requiredFieldsValid = ["address", "city", "state", "zipCode"].every((field) => validFields[field])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl font-bold">Service Address</CardTitle>
        <CardDescription className="text-lg">Where would you like us to provide your cleaning service?</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Contact Information Confirmed</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{addressData.fullName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{addressData.email}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 font-medium">{addressData.phone}</span>
              </div>
            </div>
          </motion.div>

          {/* Address Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">Property Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: "residential", icon: Home, label: "Residential", desc: "House, apartment, condo" },
                { type: "commercial", icon: Building, label: "Commercial", desc: "Office, retail, warehouse" },
                { type: "other", icon: Navigation, label: "Other", desc: "Special property type" },
              ].map(({ type, icon: Icon, label, desc }) => (
                <motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      addressData.addressType === type
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : "hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleChange("addressType", type)}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon
                        className={`h-8 w-8 mx-auto mb-3 ${
                          addressData.addressType === type ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <p className="font-medium mb-1">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Address Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              {getAddressTypeIcon()}
              <h3 className="text-lg font-medium">Service Address Details</h3>
            </div>

            {/* Street Address */}
            <div>
              <Label htmlFor="address" className="text-base font-medium flex items-center gap-2">
                Street Address
                {getFieldIcon("address")}
              </Label>
              <Input
                id="address"
                value={addressData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                className={`mt-3 h-12 text-base transition-all duration-200 ${
                  touched.address
                    ? validFields.address
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : errors.address
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    : "focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder="123 Main Street"
              />
              <AnimatePresence>
                {touched.address && errors.address && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.address}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Address Line 2 */}
            <div>
              <Label htmlFor="address2" className="text-base font-medium text-muted-foreground">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="address2"
                value={addressData.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
                className="mt-3 h-12 text-base focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Apt 4B, Suite 200, etc."
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city" className="text-base font-medium flex items-center gap-2">
                  City
                  {getFieldIcon("city")}
                </Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  className={`mt-3 h-12 text-base transition-all duration-200 ${
                    touched.city
                      ? validFields.city
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                        : errors.city
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      : "focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="New York"
                />
                <AnimatePresence>
                  {touched.city && errors.city && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.city}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label htmlFor="state" className="text-base font-medium flex items-center gap-2">
                  State
                  {getFieldIcon("state")}
                </Label>
                <Select
                  value={addressData.state}
                  onValueChange={(value) => {
                    handleChange("state", value)
                    handleBlur("state")
                  }}
                >
                  <SelectTrigger
                    id="state"
                    className={`mt-3 h-12 text-base transition-all duration-200 ${
                      touched.state
                        ? validFields.state
                          ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                          : errors.state
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        : "focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  >
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
                <AnimatePresence>
                  {touched.state && errors.state && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.state}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-base font-medium flex items-center gap-2">
                  ZIP Code
                  {getFieldIcon("zipCode")}
                </Label>
                <Input
                  id="zipCode"
                  value={addressData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  onBlur={() => handleBlur("zipCode")}
                  className={`mt-3 h-12 text-base transition-all duration-200 ${
                    touched.zipCode
                      ? validFields.zipCode
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                        : errors.zipCode
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      : "focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="10001"
                  maxLength={10}
                />
                <AnimatePresence>
                  {touched.zipCode && errors.zipCode && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.zipCode}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Special Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Special Instructions</h3>
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </div>
            <Textarea
              id="specialInstructions"
              value={addressData.specialInstructions}
              onChange={(e) => handleChange("specialInstructions", e.target.value)}
              placeholder="Any special entry instructions, pets, areas to avoid, or other important details for our cleaning team..."
              className="h-32 text-base resize-none focus:border-blue-500 focus:ring-blue-500/20"
            />
            <p className="text-sm text-muted-foreground">
              Help us provide the best service by sharing any relevant details about your property.
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Address Completion</span>
              <span>{Object.values(validFields).filter(Boolean).length}/4 required fields</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${(Object.values(validFields).filter(Boolean).length / 4) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between pt-6"
          >
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 text-base bg-transparent hover:bg-gray-50"
              onClick={onPrevious}
              type="button"
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Back to Contact
            </Button>

            <Button
              type="submit"
              size="lg"
              className={`px-8 h-12 text-base transition-all duration-200 ${
                requiredFieldsValid
                  ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isSubmitting || !requiredFieldsValid}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </motion.div>
  )
}
