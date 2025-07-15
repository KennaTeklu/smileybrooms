"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  isValidUSZip,
  formatUSZip,
} from "@/lib/validation/address-validation"
import { isValidCreditCardNumber, isValidExpiryDate, isValidCVC } from "@/lib/validation/payment-validation" // Assuming these exist
import { PaymentMethodSelector } from "@/components/payment-method-selector" // Assuming this component exists

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export function PaymentStep({ onNext, onBack, initialData, serviceAddress }: any) {
  const [paymentMethod, setPaymentMethod] = useState(initialData.paymentMethod || "credit_card")
  const [cardNumber, setCardNumber] = useState(initialData.cardDetails?.cardNumber || "")
  const [expiryDate, setExpiryDate] = useState(initialData.cardDetails?.expiryDate || "")
  const [cvc, setCvc] = useState(initialData.cardDetails?.cvc || "")
  const [billingAddressSameAsService, setBillingAddressSameAsService] = useState(
    initialData.billingAddressSameAsService ?? true,
  )
  const [billingStreet, setBillingStreet] = useState(initialData.billingAddress?.street || "")
  const [billingCity, setBillingCity] = useState(initialData.billingAddress?.city || "")
  const [billingState, setBillingState] = useState(initialData.billingAddress?.state || "")
  const [billingZip, setBillingZip] = useState(initialData.billingAddress?.zip || "")

  const [errors, setErrors] = useState<{
    cardNumber?: string
    expiryDate?: string
    cvc?: string
    billingStreet?: string
    billingCity?: string
    billingState?: string
    billingZip?: string
  }>({})

  useEffect(() => {
    setPaymentMethod(initialData.paymentMethod || "credit_card")
    setCardNumber(initialData.cardDetails?.cardNumber || "")
    setExpiryDate(initialData.cardDetails?.expiryDate || "")
    setCvc(initialData.cardDetails?.cvc || "")
    setBillingAddressSameAsService(initialData.billingAddressSameAsService ?? true)
    setBillingStreet(initialData.billingAddress?.street || "")
    setBillingCity(initialData.billingAddress?.city || "")
    setBillingState(initialData.billingAddress?.state || "")
    setBillingZip(initialData.billingAddress?.zip || "")
    setErrors({})
  }, [initialData])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (paymentMethod === "credit_card") {
      if (!cardNumber.trim() || !isValidCreditCardNumber(cardNumber)) {
        newErrors.cardNumber = "A valid credit card number is required."
      }
      if (!expiryDate.trim() || !isValidExpiryDate(expiryDate)) {
        newErrors.expiryDate = "Valid MM/YY format required (e.g., 12/25)."
      }
      if (!cvc.trim() || !isValidCVC(cvc)) {
        newErrors.cvc = "Valid 3 or 4 digit CVC is required."
      }
    }

    if (!billingAddressSameAsService) {
      if (!billingStreet.trim() || !isValidStreetAddress(billingStreet)) {
        newErrors.billingStreet = "Billing street address is required."
      }
      if (!billingCity.trim() || !isValidCity(billingCity)) {
        newErrors.billingCity = "Billing city is required."
      }
      if (!billingState || !isValidUSState(billingState)) {
        newErrors.billingState = "Please select a valid billing state."
      }
      if (!billingZip.trim() || !isValidUSZip(billingZip)) {
        newErrors.billingZip = "A valid 5-digit billing ZIP code is required."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({
        paymentMethod,
        cardDetails: paymentMethod === "credit_card" ? { cardNumber, expiryDate, cvc } : undefined,
        billingAddressSameAsService,
        billingAddress: billingAddressSameAsService
          ? serviceAddress
          : {
              street: billingStreet,
              city: billingCity,
              state: billingState,
              zip: billingZip,
            },
      })
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ") // Add space every 4 digits
    setCardNumber(formattedValue.slice(0, 19)) // Max 16 digits + 3 spaces
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }
    setExpiryDate(value.slice(0, 5)) // MM/YY
    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: undefined }))
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    setCvc(value.slice(0, 4)) // Max 4 digits
    if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: undefined }))
  }

  const handleBillingZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZip = formatUSZip(e.target.value)
    setBillingZip(formattedZip)
    if (errors.billingZip) {
      setErrors((prev) => ({ ...prev, billingZip: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Information</CardTitle>
        <CardDescription>Select your payment method and provide billing details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <Label>Payment Method</Label>
            <PaymentMethodSelector selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19} // 16 digits + 3 spaces
                  required
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5} // MM/YY
                    required
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="XXX"
                    value={cvc}
                    onChange={handleCvcChange}
                    maxLength={4}
                    required
                  />
                  {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="billingAddressSameAsService"
                checked={billingAddressSameAsService}
                onCheckedChange={(checked) => {
                  setBillingAddressSameAsService(checked as boolean)
                  setErrors({}) // Clear billing address errors when toggling
                }}
              />
              <Label htmlFor="billingAddressSameAsService">Billing address same as service address</Label>
            </div>
          </div>

          {!billingAddressSameAsService && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Billing Address</h3>
              <div className="grid gap-2">
                <Label htmlFor="billingStreet">Street Address</Label>
                <Input
                  id="billingStreet"
                  type="text"
                  placeholder="123 Main St"
                  value={billingStreet}
                  onChange={(e) => {
                    setBillingStreet(e.target.value)
                    if (errors.billingStreet) setErrors((prev) => ({ ...prev, billingStreet: undefined }))
                  }}
                  required
                />
                {errors.billingStreet && <p className="text-red-500 text-sm">{errors.billingStreet}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    type="text"
                    placeholder="Phoenix"
                    value={billingCity}
                    onChange={(e) => {
                      setBillingCity(e.target.value)
                      if (errors.billingCity) setErrors((prev) => ({ ...prev, billingCity: undefined }))
                    }}
                    required
                  />
                  {errors.billingCity && <p className="text-red-500 text-sm">{errors.billingCity}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billingState">State</Label>
                  <Select
                    value={billingState}
                    onValueChange={(value) => {
                      setBillingState(value)
                      if (errors.billingState) setErrors((prev) => ({ ...prev, billingState: undefined }))
                    }}
                    required
                  >
                    <SelectTrigger id="billingState">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.billingState && <p className="text-red-500 text-sm">{errors.billingState}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billingZip">ZIP Code</Label>
                <Input
                  id="billingZip"
                  type="text"
                  placeholder="85001"
                  value={billingZip}
                  onChange={handleBillingZipChange}
                  maxLength={5}
                  required
                />
                {errors.billingZip && <p className="text-red-500 text-sm">{errors.billingZip}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
              Back to Address
            </Button>
            <Button type="submit" className="w-full">
              Continue to Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
