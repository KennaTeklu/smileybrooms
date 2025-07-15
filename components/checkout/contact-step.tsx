"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, User, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"

interface ContactStepProps {
  data: CheckoutData["contact"]
  onSave: (data: CheckoutData["contact"]) => void
  onNext: () => void
}

export default function ContactStep({ data, onSave, onNext }: ContactStepProps) {
  const { toast } = useToast()
  const [contactData, setContactData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validFields, setValidFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setContactData(data)
  }, [data])

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        return value.trim().length >= 2 ? "" : "First name must be at least 2 characters"
      case "lastName":
        return value.trim().length >= 2 ? "" : "Last name must be at least 2 characters"
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) ? "" : "Please enter a valid email address"
      case "phone":
        const phoneRegex = /^$$\d{3}$$ \d{3}-\d{4}$/
        return phoneRegex.test(value) ? "" : "Please enter a valid phone number"
      default:
        return ""
    }
  }

  const handleChange = (field: string, value: string) => {
    let processedValue = value

    if (field === "phone") {
      processedValue = formatPhoneNumber(value)
    }

    setContactData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))

    // Real-time validation
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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const fields = ["firstName", "lastName", "email", "phone"]

    fields.forEach((field) => {
      const error = validateField(field, contactData[field as keyof typeof contactData])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        onSave(contactData)
        onNext()
        setIsSubmitting(false)
        toast({
          title: "Contact information saved",
          description: "Moving to address details...",
        })
      }, 800)
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
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

  const isFormValid = Object.values(validFields).filter(Boolean).length === 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
        <CardDescription className="text-lg">Let's start with your basic contact details</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Label htmlFor="firstName" className="text-base font-medium flex items-center gap-2">
                First Name
                {getFieldIcon("firstName")}
              </Label>
              <Input
                id="firstName"
                value={contactData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                className={`mt-3 h-12 text-base transition-all duration-200 ${
                  touched.firstName
                    ? validFields.firstName
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : errors.firstName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    : "focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder="Enter your first name"
              />
              <AnimatePresence>
                {touched.firstName && errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.firstName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Label htmlFor="lastName" className="text-base font-medium flex items-center gap-2">
                Last Name
                {getFieldIcon("lastName")}
              </Label>
              <Input
                id="lastName"
                value={contactData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                className={`mt-3 h-12 text-base transition-all duration-200 ${
                  touched.lastName
                    ? validFields.lastName
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : errors.lastName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    : "focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                placeholder="Enter your last name"
              />
              <AnimatePresence>
                {touched.lastName && errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.lastName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
              {getFieldIcon("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={contactData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`mt-3 h-12 text-base transition-all duration-200 ${
                touched.email
                  ? validFields.email
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                    : errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  : "focus:border-blue-500 focus:ring-blue-500/20"
              }`}
              placeholder="Enter your email address"
            />
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phone Field */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
              {getFieldIcon("phone")}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={contactData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              className={`mt-3 h-12 text-base transition-all duration-200 ${
                touched.phone
                  ? validFields.phone
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                    : errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  : "focus:border-blue-500 focus:ring-blue-500/20"
              }`}
              placeholder="(555) 123-4567"
              maxLength={14}
            />
            <AnimatePresence>
              {touched.phone && errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Form Completion</span>
              <span>{Object.values(validFields).filter(Boolean).length}/4 fields</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${(Object.values(validFields).filter(Boolean).length / 4) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end pt-6"
          >
            <Button
              type="submit"
              size="lg"
              className={`px-8 h-12 text-base transition-all duration-200 ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Address
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
