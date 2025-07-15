"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, User } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import { isValidUSPhone, formatUSPhone } from "@/lib/validation/phone-validation"
import { isValidEmail } from "@/lib/validation/email-validation" // Assuming this exists or will be created

interface ContactStepProps {
  data: CheckoutData["contact"]
  onSave: (data: CheckoutData["contact"]) => void
  onNext: () => void
}

export default function ContactStep({ data, onSave, onNext }: ContactStepProps) {
  const { toast } = useToast()
  const [contactData, setContactData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setContactData(data)
  }, [data])

  const handleChange = (field: string, value: string) => {
    let processedValue = value
    if (field === "phone") {
      processedValue = formatUSPhone(value)
    }
    setContactData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!contactData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!contactData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!contactData.email.trim()) newErrors.email = "Email is required"
    else if (!isValidEmail(contactData.email)) newErrors.email = "Email is invalid" // Using isValidEmail
    if (!contactData.phone.trim()) newErrors.phone = "Phone is required"
    else if (!isValidUSPhone(contactData.phone)) newErrors.phone = "Phone number is invalid (e.g., (555) 123-4567)" // Using isValidUSPhone
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      onSave(contactData)
      onNext()
      setIsSubmitting(false)
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>Please provide your contact details for the service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-base">
                First Name
              </Label>
              <Input
                id="firstName"
                value={contactData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`mt-2 h-12 ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-base">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={contactData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`mt-2 h-12 ${errors.lastName ? "border-red-500" : ""}`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contactData.email}
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
              value={contactData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`mt-2 h-12 ${errors.phone ? "border-red-500" : ""}`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Address
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
