"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  isValidUSZip,
  formatUSZip,
} from "@/lib/validation/address-validation"

interface PaymentStepProps {
  initialData: {
    method: "card" | "in_person" | ""
    cardDetails?: {
      cardNumber: string
      expiryDate: string
      cvc: string
    }
    billingAddressSameAsService: boolean
    billingAddress?: {
      street: string
      city: string
      state: string
      zip: string
    }
  }
  onNext: (data: any) => void
  onBack: () => void
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export function PaymentStep({ initialData, onNext, onBack }: PaymentStepProps) {
  const [method, setMethod] = useState<"card" | "in_person" | "">(initialData.method)
  const [cardNumber, setCardNumber] = useState(initialData.cardDetails?.cardNumber || "")
  const [expiryDate, setExpiryDate] = useState(initialData.cardDetails?.expiryDate || "")
  const [cvc, setCvc] = useState(initialData.cardDetails?.cvc || "")
  const [billingAddressSameAsService, setBillingAddressSameAsService] = useState(
    initialData.billingAddressSameAsService,
  )
  const [billingStreet, setBillingStreet] = useState(initialData.billingAddress?.street || "")
  const [billingCity, setBillingCity] = useState(initialData.billingAddress?.city || "")
  const [billingState, setBillingState] = useState(initialData.billingAddress?.state || "")
  const [billingZip, setBillingZip] = useState(initialData.billingAddress?.zip || "")

  const [errors, setErrors] = useState({
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      method: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      billingStreet: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
    }

    if (!method) {
      newErrors.method = "Please select a payment method."
      valid = false
    }

    if (method === "card") {
      // Basic card validation
      if (!cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) {
        newErrors.cardNumber = "Valid card number required."
        valid = false
      }
      if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiryDate = "MM/YY format required."
        valid = false
      } else {
        const [month, year] = expiryDate.split("/").map(Number)
        const currentYear = new Date().getFullYear() % 100 // Last two digits
        const currentMonth = new Date().getMonth() + 1 // 1-indexed
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = "Card has expired."
          valid = false
        }
      }
      if (!cvc.match(/^\d{3,4}$/)) {
        newErrors.cvc = "Valid CVC required (3-4 digits)."
        valid = false
      }

      if (!billingAddressSameAsService) {
        if (!billingStreet.trim() || !isValidStreetAddress(billingStreet)) {
          newErrors.billingStreet = "A valid street address is required."
          valid = false
        }
        if (!billingCity.trim() || !isValidCity(billingCity)) {
          newErrors.billingCity = "A valid city is required."
          valid = false
        }
        if (!billingState || !isValidUSState(billingState)) {
          newErrors.billingState = "Please select a state."
          valid = false
        }
        if (!billingZip.trim() || !isValidUSZip(billingZip)) {
          newErrors.billingZip = "A valid 5-digit ZIP code is required."
          valid = false
        }
      }
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({
        method,
        cardDetails: method === "card" ? { cardNumber, expiryDate, cvc } : undefined,
        billingAddressSameAsService,
        billingAddress: billingAddressSameAsService
          ? undefined
          : {
              street: billingStreet,
              city: billingCity,
              state: billingState,
              zip: billingZip,
            },
      })
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/.{1,4}/g)
    return match ? match.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>How would you like to pay for your service?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={method} onValueChange={(value: "card" | "in_person") => setMethod(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_person" id="in_person" />
            <Label htmlFor="in_person">Pay In-Person (Zelle)</Label>
          </div>
        </RadioGroup>
        {errors.method && <p className="text-sm text-red-500">{errors.method}</p>}

        {method === "card" && (
          <div className="space-y-4 border p-4 rounded-md">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(formatCardNumber(e.target.value))
                  setErrors((prev) => ({ ...prev, cardNumber: "" }))
                }}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19} // 16 digits + 3 spaces
                className={cn({ "border-red-500": errors.cardNumber })}
                aria-invalid={!!errors.cardNumber}
                aria-describedby="cardNumber-error"
              />
              {errors.cardNumber && (
                <p id="cardNumber-error" className="text-sm text-red-500">
                  {errors.cardNumber}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(formatExpiryDate(e.target.value))
                    setErrors((prev) => ({ ...prev, expiryDate: "" }))
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={cn({ "border-red-500": errors.expiryDate })}
                  aria-invalid={!!errors.expiryDate}
                  aria-describedby="expiryDate-error"
                />
                {errors.expiryDate && (
                  <p id="expiryDate-error" className="text-sm text-red-500">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={cvc}
                  onChange={(e) => {
                    setCvc(e.target.value.replace(/\D/g, ""))
                    setErrors((prev) => ({ ...prev, cvc: "" }))
                  }}
                  placeholder="XXX"
                  maxLength={4}
                  className={cn({ "border-red-500": errors.cvc })}
                  aria-invalid={!!errors.cvc}
                  aria-describedby="cvc-error"
                />
                {errors.cvc && (
                  <p id="cvc-error" className="text-sm text-red-500">
                    {errors.cvc}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="billingAddressSameAsService"
                checked={billingAddressSameAsService}
                onCheckedChange={(checked) => setBillingAddressSameAsService(checked as boolean)}
              />
              <Label htmlFor="billingAddressSameAsService">Billing address same as service address</Label>
            </div>

            {!billingAddressSameAsService && (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Billing Address</h3>
                <div className="grid gap-2">
                  <Label htmlFor="billingStreet">Street Address</Label>
                  <Input
                    id="billingStreet"
                    value={billingStreet}
                    onChange={(e) => {
                      setBillingStreet(e.target.value)
                      setErrors((prev) => ({ ...prev, billingStreet: "" }))
                    }}
                    placeholder="123 Billing St"
                    className={cn({ "border-red-500": errors.billingStreet })}
                    aria-invalid={!!errors.billingStreet}
                    aria-describedby="billingStreet-error"
                  />
                  {errors.billingStreet && (
                    <p id="billingStreet-error" className="text-sm text-red-500">
                      {errors.billingStreet}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      value={billingCity}
                      onChange={(e) => {
                        setBillingCity(e.target.value)
                        setErrors((prev) => ({ ...prev, billingCity: "" }))
                      }}
                      placeholder="Phoenix"
                      className={cn({ "border-red-500": errors.billingCity })}
                      aria-invalid={!!errors.billingCity}
                      aria-describedby="billingCity-error"
                    />
                    {errors.billingCity && (
                      <p id="billingCity-error" className="text-sm text-red-500">
                        {errors.billingCity}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billingState">State</Label>
                    <Select
                      value={billingState}
                      onValueChange={(value) => {
                        setBillingState(value)
                        setErrors((prev) => ({ ...prev, billingState: "" }))
                      }}
                    >
                      <SelectTrigger
                        className={cn({ "border-red-500": errors.billingState })}
                        aria-invalid={!!errors.billingState}
                        aria-describedby="billingState-error"
                      >
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.billingState && (
                      <p id="billingState-error" className="text-sm text-red-500">
                        {errors.billingState}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billingZip">ZIP Code</Label>
                  <Input
                    id="billingZip"
                    value={billingZip}
                    onChange={(e) => {
                      const formatted = formatUSZip(e.target.value)
                      setBillingZip(formatted)
                      setErrors((prev) => ({ ...prev, billingZip: "" }))
                    }}
                    placeholder="85001"
                    maxLength={5}
                    className={cn({ "border-red-500": errors.billingZip })}
                    aria-invalid={!!errors.billingZip}
                    aria-describedby="billingZip-error"
                  />
                  {errors.billingZip && (
                    <p id="billingZip-error" className="text-sm text-red-500">
                      {errors.billingZip}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button type="submit">Continue to Review</Button>
      </CardFooter>
    </form>
  )
}
