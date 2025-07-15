"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isValidEmail } from "@/lib/validation/email-validation"
import { isValidUSPhone, formatUSPhone } from "@/lib/validation/phone-validation"
import { cn } from "@/lib/utils"

interface ContactStepProps {
  initialData: {
    fullName: string
    email: string
    phone: string
  }
  onNext: (data: { fullName: string; email: string; phone: string }) => void
}

export function ContactStep({ initialData, onNext }: ContactStepProps) {
  const [fullName, setFullName] = useState(initialData.fullName)
  const [email, setEmail] = useState(initialData.email)
  const [phone, setPhone] = useState(initialData.phone)
  const [errors, setErrors] = useState({ fullName: "", email: "", phone: "" })

  const validateForm = () => {
    let valid = true
    const newErrors = { fullName: "", email: "", phone: "" }

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required."
      valid = false
    }

    if (!email.trim() || !isValidEmail(email)) {
      newErrors.email = "A valid email is required."
      valid = false
    }

    if (!phone.trim() || !isValidUSPhone(phone)) {
      newErrors.phone = "A valid 10-digit phone number is required."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ fullName, email, phone })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Please provide your contact details for the service.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setErrors((prev) => ({ ...prev, fullName: "" }))
            }}
            placeholder="John Doe"
            className={cn({ "border-red-500": errors.fullName })}
            aria-invalid={!!errors.fullName}
            aria-describedby="fullName-error"
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-sm text-red-500">
              {errors.fullName}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: "" }))
            }}
            placeholder="john.doe@example.com"
            className={cn({ "border-red-500": errors.email })}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              const formatted = formatUSPhone(e.target.value)
              setPhone(formatted)
              setErrors((prev) => ({ ...prev, phone: "" }))
            }}
            placeholder="(123) 456-7890"
            className={cn({ "border-red-500": errors.phone })}
            aria-invalid={!!errors.phone}
            aria-describedby="phone-error"
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-500">
              {errors.phone}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit">Continue to Address</Button>
      </CardFooter>
    </form>
  )
}
