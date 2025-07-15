"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { isValidEmail } from "@/lib/validation/email-validation" // Assuming this exists
import { formatUSPhone, isValidUSPhone } from "@/lib/validation/phone-validation" // Assuming this exists

interface ContactStepProps {
  onNext: (data: { fullName: string; email: string; phone: string }) => void
  initialData: { fullName: string; email: string; phone: string }
}

export function ContactStep({ onNext, initialData }: ContactStepProps) {
  const [fullName, setFullName] = useState(initialData.fullName || "")
  const [email, setEmail] = useState(initialData.email || "")
  const [phone, setPhone] = useState(initialData.phone || "")
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({})

  useEffect(() => {
    setFullName(initialData.fullName || "")
    setEmail(initialData.email || "")
    setPhone(initialData.phone || "")
    setErrors({}) // Clear errors when initialData changes
  }, [initialData])

  const validateForm = () => {
    const newErrors: { fullName?: string; email?: string; phone?: string } = {}
    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required."
    }
    if (!email.trim() || !isValidEmail(email)) {
      newErrors.email = "A valid email is required."
    }
    if (!phone.trim() || !isValidUSPhone(phone)) {
      newErrors.phone = "A valid 10-digit US phone number is required."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ fullName, email, phone })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatUSPhone(e.target.value)
    setPhone(formattedPhone)
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Contact Information</CardTitle>
        <CardDescription>Please provide your contact details for the service.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
              }}
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <Button type="submit" className="w-full">
            Continue to Address
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
