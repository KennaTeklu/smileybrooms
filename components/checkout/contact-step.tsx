"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { formatUSPhone, isValidUSPhone } from "@/lib/validation/phone-validation"
import { isValidEmail } from "@/lib/validation/email-validation" // Assuming this utility exists

interface ContactStepProps {
  data: {
    fullName: string
    email: string
    phone: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function ContactStep({ data, onNext, onBack }: ContactStepProps) {
  const [fullName, setFullName] = useState(data.fullName || "")
  const [email, setEmail] = useState(data.email || "")
  const [phone, setPhone] = useState(data.phone || "")

  const [fullNameError, setFullNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  useEffect(() => {
    setFullName(data.fullName || "")
    setEmail(data.email || "")
    setPhone(data.phone || "")
  }, [data])

  const validateForm = () => {
    let isValid = true

    if (!fullName.trim()) {
      setFullNameError("Full Name is required.")
      isValid = false
    } else {
      setFullNameError(null)
    }

    if (!email.trim() || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError(null)
    }

    if (!phone.trim() || !isValidUSPhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.")
      isValid = false
    } else {
      setPhoneError(null)
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ fullName, email, phone })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSPhone(e.target.value)
    setPhone(formatted)
    if (phoneError && isValidUSPhone(formatted)) {
      setPhoneError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (fullNameError && e.target.value.trim()) {
              setFullNameError(null)
            }
          }}
          placeholder="John Doe"
          required
          aria-invalid={fullNameError ? "true" : "false"}
          aria-describedby={fullNameError ? "fullName-error" : undefined}
        />
        {fullNameError && (
          <p id="fullName-error" className="text-red-500 text-sm">
            {fullNameError}
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
            if (emailError && isValidEmail(e.target.value)) {
              setEmailError(null)
            }
          }}
          placeholder="john.doe@example.com"
          required
          aria-invalid={emailError ? "true" : "false"}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <p id="email-error" className="text-red-500 text-sm">
            {emailError}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(123) 456-7890"
          required
          aria-invalid={phoneError ? "true" : "false"}
          aria-describedby={phoneError ? "phone-error" : undefined}
        />
        {phoneError && (
          <p id="phone-error" className="text-red-500 text-sm">
            {phoneError}
          </p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Cart
        </Button>
        <Button type="submit">Continue to Address</Button>
      </div>
    </form>
  )
}
