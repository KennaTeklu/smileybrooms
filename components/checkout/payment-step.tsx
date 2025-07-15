"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PaymentData, AddressData } from "@/app/checkout/page"
import { isValidUSZip, isValidStreetAddress, isValidCity, isValidUSState } from "@/lib/validation/address-validation"
import { formatUSZip } from "@/lib/utils" // Assuming formatUSZip is in utils

interface PaymentStepProps {
  data: PaymentData
  onNext: (data: Partial<PaymentData>) => void
  onBack: () => void
}

export function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState(data.method)
  const [cardNumber, setCardNumber] = useState(data.last4 ? `************${data.last4}` : "")
  const [expiryMonth, setExpiryMonth] = useState(data.expiryMonth || "")
  const [expiryYear, setExpiryYear] = useState(data.expiryYear || "")
  const [cvc, setCvc] = useState(data.cvc || "")
  const [billingAddressSameAsService, setBillingAddressSameAsService] = useState(
    data.billingAddressSameAsService ?? true,
  )
  const [billingAddress, setBillingAddress] = useState<AddressData>(
    data.billingAddress || { street: "", city: "", state: "", zipCode: "" },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\D/g, "").length < 13 || cardNumber.replace(/\D/g, "").length > 19) {
        newErrors.cardNumber = "Card number must be between 13 and 19 digits."
      }
      if (!expiryMonth || !expiryYear) {
        newErrors.expiry = "Expiry date is required."
      } else {
        const currentYear = new Date().getFullYear() % 100 // Last two digits of current year
        const currentMonth = new Date().getMonth() + 1 // Month is 0-indexed
        const expMonthNum = Number.parseInt(expiryMonth, 10)
        const expYearNum = Number.parseInt(expiryYear, 10)

        if (expYearNum < currentYear || (expYearNum === currentYear && expMonthNum < currentMonth)) {
          newErrors.expiry = "Expiry date cannot be in the past."
        }
      }
      if (!cvc || cvc.length < 3 || cvc.length > 4) {
        newErrors.cvc = "CVC must be 3 or 4 digits."
      }

      if (!billingAddressSameAsService) {
        if (!isValidStreetAddress(billingAddress.street)) {
          newErrors.billingStreet = "Invalid street address."
        }
        if (!isValidCity(billingAddress.city)) {
          newErrors.billingCity = "Invalid city."
        }
        if (!isValidUSState(billingAddress.state)) {
          newErrors.billingState = "Invalid state."
        }
        if (!isValidUSZip(billingAddress.zipCode)) {
          newErrors.billingZipCode = "Invalid ZIP code (5 digits)."
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const last4 = cardNumber.replace(/\D/g, "").slice(-4)
      onNext({
        method: paymentMethod,
        cardType: paymentMethod === "card" ? "Visa" : undefined, // Placeholder, ideally detect card type
        last4: paymentMethod === "card" ? last4 : undefined,
        expiryMonth: paymentMethod === "card" ? expiryMonth : undefined,
        expiryYear: paymentMethod === "card" ? expiryYear : undefined,
        cvc: paymentMethod === "card" ? cvc : undefined,
        billingAddressSameAsService,
        billingAddress: billingAddressSameAsService ? undefined : billingAddress,
      })
    }
  }

  const handleBillingAddressChange = (field: keyof AddressData, value: string) => {
    setBillingAddress((prev) => {
      const updated = { ...prev, [field]: value }
      // Apply formatting for zip code
      if (field === "zipCode") {
        updated.zipCode = formatUSZip(value)
      }
      return updated
    })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i))
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
          <CardDescription>Choose how you'd like to pay for your service.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in_person" id="in_person" />
              <Label htmlFor="in_person">Pay In-Person (Cash/Zelle)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
            <CardDescription>Enter your credit or debit card information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value
                      .replace(/\s/g, "")
                      .replace(/(\d{4})/g, "$1 ")
                      .trim(),
                  )
                }
                maxLength={19}
                required
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryMonth">Expiry Month</Label>
                <Select value={expiryMonth} onValueChange={setExpiryMonth} required>
                  <SelectTrigger id="expiryMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryYear">Expiry Year</Label>
                <Select value={expiryYear} onValueChange={setExpiryYear} required>
                  <SelectTrigger id="expiryYear">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.slice(-2)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="XXX"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                />
                {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
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
          </CardContent>
        </Card>
      )}

      {paymentMethod === "card" && !billingAddressSameAsService && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
            <CardDescription>Enter your billing address details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="billingStreet">Street Address</Label>
              <Input
                id="billingStreet"
                type="text"
                placeholder="123 Main St"
                value={billingAddress.street}
                onChange={(e) => handleBillingAddressChange("street", e.target.value)}
                required
              />
              {errors.billingStreet && <p className="text-red-500 text-sm">{errors.billingStreet}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  type="text"
                  placeholder="Anytown"
                  value={billingAddress.city}
                  onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                  required
                />
                {errors.billingCity && <p className="text-red-500 text-sm">{errors.billingCity}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billingState">State</Label>
                <Select
                  value={billingAddress.state}
                  onValueChange={(value) => handleBillingAddressChange("state", value)}
                  required
                >
                  <SelectTrigger id="billingState">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
                {errors.billingState && <p className="text-red-500 text-sm">{errors.billingState}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billingZipCode">ZIP Code</Label>
              <Input
                id="billingZipCode"
                type="text"
                placeholder="90210"
                value={billingAddress.zipCode}
                onChange={(e) => handleBillingAddressChange("zipCode", e.target.value)}
                maxLength={5}
                required
              />
              {errors.billingZipCode && <p className="text-red-500 text-sm">{errors.billingZipCode}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue to Review</Button>
      </div>
    </form>
  )
}
