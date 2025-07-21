"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"

interface ContactStepProps {
  data: CheckoutData["contact"]
  onSave: (data: CheckoutData["contact"]) => void
  onNext: () => void
  isSubmitting: boolean
}

export default function ContactStep({ data, onSave, onNext, isSubmitting }: ContactStepProps) {
  const { toast } = useToast()
  const [contactData, setContactData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setContactData(data)
  }, [data])

  const handleChange = (field: string, value: string) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
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
    else if (!/\S+@\S+\.\S+/.test(contactData.email)) newErrors.email = "Email is invalid"
    if (!contactData.phone.trim()) newErrors.phone = "Phone is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(contactData)
      onNext()
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
        <CardDescription>How we can reach you about your service.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="firstName" className="text-base">
                First Name
              </Label>
              <Input
                id="firstName"
                value={contactData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`mt-2 h-11 rounded-lg ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1.5">{errors.firstName}</p>}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="lastName" className="text-base">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={contactData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`mt-2 h-11 rounded-lg ${errors.lastName ? "border-red-500" : ""}`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1.5">{errors.lastName}</p>}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contactData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-2 h-11 rounded-lg ${errors.email ? "border-red-500" : ""}`}
              placeholder="john.doe@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Label htmlFor="phone" className="text-base">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={contactData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`mt-2 h-11 rounded-lg ${errors.phone ? "border-red-500" : ""}`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
          </motion.div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="default" className="px-6 rounded-lg" disabled={isSubmitting}>
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
