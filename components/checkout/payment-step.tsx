"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import {
  isValidUSZip,
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  formatUSZip,
} from "@/lib/validation/address-validation"

interface PaymentStepProps {
  data: {
    paymentMethod: string
    cardDetails: {
      cardNumber: string
      expiryDate: string
      cvc: string
      cardholderName: string
    }
    billingAddressSameAsService: boolean
    billingAddress: {
      street: string
      city: string
      state: string
      zip: string
      unit?: string
    }
    serviceAddress: {
      street: string
      city: string
      state: string
      zip: string
      unit?: string
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

export function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod || "credit_card")
  const [cardNumber, setCardNumber] = useState(data.cardDetails.cardNumber || "")
  const [expiryDate, setExpiryDate] = useState(data.cardDetails.expiryDate || "")
  const [cvc, setCvc] = useState(data.cardDetails.cvc || "")
  const [cardholderName, setCardholderName] = useState(data.cardDetails.cardholderName || "")
  const [billingAddressSameAsService, setBillingAddressSameAsService] = useState(
    data.billingAddressSameAsService ?? true,
  )
  const [billingStreet, setBillingStreet] = useState(data.billingAddress.street || "")
  const [billingCity, setBillingCity] = useState(data.billingAddress.city || "")
  const [billingState, setBillingState] = useState(data.billingAddress.state || "")
  const [billingZip, setBillingZip] = useState(data.billingAddress.zip || "")
  const [billingUnit, setBillingUnit] = useState(data.billingAddress.unit || "")

  const [cardNumberError, setCardNumberError] = useState<string | null>(null)
  const [expiryDateError, setExpiryDateError] = useState<string | null>(null)
  const [cvcError, setCvcError] = useState<string | null>(null)
  const [cardholderNameError, setCardholderNameError] = useState<string | null>(null)
  const [billingStreetError, setBillingStreetError] = useState<string | null>(null)
  const [billingCityError, setBillingCityError] = useState<string | null>(null)
  const [billingStateError, setBillingStateError] = useState<string | null>(null)
  const [billingZipError, setBillingZipError] = useState<string | null>(null)

  useEffect(() => {
    setPaymentMethod(data.paymentMethod || "credit_card")
    setCardNumber(data.cardDetails.cardNumber || "")
    setExpiryDate(data.cardDetails.expiryDate || "")
    setCvc(data.cardDetails.cvc || "")
    setCardholderName(data.cardDetails.cardholderName || "")
    setBillingAddressSameAsService(data.billingAddressSameAsService ?? true)
    setBillingStreet(data.billingAddress.street || "")
    setBillingCity(data.billingAddress.city || "")
    setBillingState(data.billingAddress.state || "")
    setBillingZip(data.billingAddress.zip || "")
    setBillingUnit(data.billingAddress.unit || "")
  }, [data])

  const validateForm = () => {
    let isValid = true

    if (paymentMethod === "credit_card") {
      if (!cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) {
        setCardNumberError("Please enter a valid card number.")
        isValid = false
      } else {
        setCardNumberError(null)
      }

      if (!expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
        setExpiryDateError("Invalid expiry date (MM/YY).")
        isValid = false
      } else {
        setExpiryDateError(null)
      }

      if (!cvc.match(/^\d{3,4}$/)) {
        setCvcError("Invalid CVC.")
        isValid = false
      } else {
        setCvcError(null)
      }

      if (!cardholderName.trim()) {
        setCardholderNameError("Cardholder name is required.")
        isValid = false
      } else {
        setCardholderNameError(null)
      }

      if (!billingAddressSameAsService) {
        if (!billingStreet.trim() || !isValidStreetAddress(billingStreet)) {
          setBillingStreetError("Please enter a valid street address.")
          isValid = false
        } else {
          setBillingStreetError(null)
        }

        if (!billingCity.trim() || !isValidCity(billingCity)) {
          setBillingCityError("Please enter a valid city.")
          isValid = false
        } else {
          setBillingCityError(null)
        }

        if (!billingState.trim() || !isValidUSState(billingState)) {
          setBillingStateError("Please select a state.")
          isValid = false
        } else {
          setBillingStateError(null)
        }

        if (!billingZip.trim() || !isValidUSZip(billingZip)) {
          setBillingZipError("Please enter a valid 5-digit ZIP code.")
          isValid = false
        } else {
          setBillingZipError(null)
        }
      }
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({
        paymentMethod,
        cardDetails: { cardNumber, expiryDate, cvc, cardholderName },
        billingAddressSameAsService,
        billingAddress: billingAddressSameAsService
          ? data.serviceAddress // Use service address if same
          : { street: billingStreet, city: billingCity, state: billingState, zip: billingZip, unit: billingUnit },
      })
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ") // Add space every 4 digits
    setCardNumber(formattedValue.trim())
    if (cardNumberError && formattedValue.replace(/\s/g, "").match(/^\d{13,19}$/)) {
      setCardNumberError(null)
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setExpiryDate(value)
    if (expiryDateError && value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      setExpiryDateError(null)
    }
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4) // Max 4 digits
    setCvc(value)
    if (cvcError && value.match(/^\d{3,4}$/)) {
      setCvcError(null)
    }
  }

  const handleBillingZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSZip(e.target.value)
    setBillingZip(formatted)
    if (billingZipError && isValidUSZip(formatted)) {
      setBillingZipError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label>Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit_card" id="credit_card" />
            <Label htmlFor="credit_card">Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" disabled />
            <Label htmlFor="paypal">PayPal (Coming Soon)</Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "credit_card" && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19} // Max length for formatted number
              required
              aria-invalid={cardNumberError ? "true" : "false"}
              aria-describedby={cardNumberError ? "cardNumber-error" : undefined}
            />
            {cardNumberError && (
              <p id="cardNumber-error" className="text-red-500 text-sm">
                {cardNumberError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength={5}
                required
                aria-invalid={expiryDateError ? "true" : "false"}
                aria-describedby={expiryDateError ? "expiryDate-error" : undefined}
              />
              {expiryDateError && (
                <p id="expiryDate-error" className="text-red-500 text-sm">
                  {expiryDateError}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="XXX"
                maxLength={4}
                required
                aria-invalid={cvcError ? "true" : "false"}
                aria-describedby={cvcError ? "cvc-error" : undefined}
              />
              {cvcError && (
                <p id="cvc-error" className="text-red-500 text-sm">
                  {cvcError}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value)
                if (cardholderNameError && e.target.value.trim()) {
                  setCardholderNameError(null)
                }
              }}
              placeholder="John Doe"
              required
              aria-invalid={cardholderNameError ? "true" : "false"}
              aria-describedby={cardholderNameError ? "cardholderName-error" : undefined}
            />
            {cardholderNameError && (
              <p id="cardholderName-error" className="text-red-500 text-sm">
                {cardholderNameError}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="billingAddressSameAsService"
              checked={billingAddressSameAsService}
              onCheckedChange={(checked) => setBillingAddressSameAsService(!!checked)}
            />
            <Label htmlFor="billingAddressSameAsService">Billing address same as service address</Label>
          </div>

          {!billingAddressSameAsService && (
            <div className="space-y-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold text-lg">Billing Address</h3>
              <div className="grid gap-2">
                <Label htmlFor="billingStreet">Street Address</Label>
                <Input
                  id="billingStreet"
                  value={billingStreet}
                  onChange={(e) => {
                    setBillingStreet(e.target.value)
                    if (billingStreetError && isValidStreetAddress(e.target.value)) {
                      setBillingStreetError(null)
                    }
                  }}
                  placeholder="123 Main St"
                  required
                  aria-invalid={billingStreetError ? "true" : "false"}
                  aria-describedby={billingStreetError ? "billingStreet-error" : undefined}
                />
                {billingStreetError && (
                  <p id="billingStreet-error" className="text-red-500 text-sm">
                    {billingStreetError}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billingUnit">Unit/Apt/Suite (Optional)</Label>
                <Input
                  id="billingUnit"
                  value={billingUnit}
                  onChange={(e) => setBillingUnit(e.target.value)}
                  placeholder="Apt 4B"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    value={billingCity}
                    onChange={(e) => {
                      setBillingCity(e.target.value)
                      if (billingCityError && isValidCity(e.target.value)) {
                        setBillingCityError(null)
                      }
                    }}
                    placeholder="Anytown"
                    required
                    aria-invalid={billingCityError ? "true" : "false"}
                    aria-describedby={billingCityError ? "billingCity-error" : undefined}
                  />
                  {billingCityError && (
                    <p id="billingCity-error" className="text-red-500 text-sm">
                      {billingCityError}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billingState">State</Label>
                  <Select
                    value={billingState}
                    onValueChange={(value) => {
                      setBillingState(value)
                      if (billingStateError && isValidUSState(value)) {
                        setBillingStateError(null)
                      }
                    }}
                    required
                  >
                    <SelectTrigger
                      id="billingState"
                      aria-invalid={billingStateError ? "true" : "false"}
                      aria-describedby={billingStateError ? "billingState-error" : undefined}
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
                  {billingStateError && (
                    <p id="billingState-error" className="text-red-500 text-sm">
                      {billingStateError}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billingZip">ZIP Code</Label>
                <Input
                  id="billingZip"
                  value={billingZip}
                  onChange={handleBillingZipChange}
                  placeholder="12345"
                  maxLength={5}
                  required
                  aria-invalid={billingZipError ? "true" : "false"}
                  aria-describedby={billingZipError ? "billingZip-error" : undefined}
                />
                {billingZipError && (
                  <p id="billingZip-error" className="text-red-500 text-sm">
                    {billingZipError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button type="submit">Continue to Review</Button>
      </div>
    </form>
  )
}
