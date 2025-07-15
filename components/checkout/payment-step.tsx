"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, CreditCard, Banknote, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES } from "@/lib/location-data"
import {
  isValidUSZip,
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  formatUSZip,
} from "@/lib/validation/address-validation"

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
}

export default function PaymentStep({ data, onSave, onNext, onPrevious }: PaymentStepProps) {
  const { toast } = useToast()
  const [paymentData, setPaymentData] = useState(data)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPaymentData(data)
  }, [data])

  const handleChange = (field: string, value: string) => {
    setPaymentData((prev) => ({
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

  const handleCardDetailsChange = (field: string, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [field]: value,
      },
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBillingAddressChange = (field: string, value: string) => {
    let processedValue = value
    if (field === "zipCode") {
      processedValue = formatUSZip(value)
    }
    setPaymentData((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: processedValue,
      },
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

    if (paymentData.method === "credit_card") {
      if (!paymentData.cardDetails.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
      if (!paymentData.cardDetails.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
      else if (!/^\d{16}$/.test(paymentData.cardDetails.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Card number must be 16 digits"
      if (!paymentData.cardDetails.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.cardDetails.expiryDate))
        newErrors.expiryDate = "Expiry date must be MM/YY"
      if (!paymentData.cardDetails.cvc.trim()) newErrors.cvc = "CVC is required"
      else if (!/^\d{3,4}$/.test(paymentData.cardDetails.cvc)) newErrors.cvc = "CVC must be 3 or 4 digits"

      if (!paymentData.billingAddressSameAsService) {
        if (!paymentData.billingAddress.address.trim())
          newErrors.billingAddress_address = "Billing street address is required"
        else if (!isValidStreetAddress(paymentData.billingAddress.address))
          newErrors.billingAddress_address = "Billing street address is invalid"
        if (!paymentData.billingAddress.city.trim()) newErrors.billingAddress_city = "Billing city is required"
        else if (!isValidCity(paymentData.billingAddress.city))
          newErrors.billingAddress_city = "Billing city is invalid"
        if (!paymentData.billingAddress.state) newErrors.billingAddress_state = "Billing state is required"
        else if (!isValidUSState(paymentData.billingAddress.state))
          newErrors.billingAddress_state = "Invalid billing state selected"
        if (!paymentData.billingAddress.zipCode.trim())
          newErrors.billingAddress_zipCode = "Billing ZIP code is required"
        else if (!isValidUSZip(paymentData.billingAddress.zipCode))
          newErrors.billingAddress_zipCode = "Billing ZIP code is invalid (e.g., 10001 or 10001-1234)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      onSave(paymentData)
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
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>How would you like to pay for your service?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Payment Method</h3>
            <RadioGroup
              value={paymentData.method}
              onValueChange={(value) => handleChange("method", value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="credit_card"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${paymentData.method === "credit_card" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
                <CreditCard className="h-8 w-8 mb-2 text-blue-600" />
                <span className="font-medium">Credit Card</span>
              </Label>
              <Label
                htmlFor="paypal"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${paymentData.method === "paypal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                <Banknote className="h-8 w-8 mb-2 text-blue-600" />
                <span className="font-medium">PayPal</span>
              </Label>
              <Label
                htmlFor="apple_pay"
                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${paymentData.method === "apple_pay" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <RadioGroupItem value="apple_pay" id="apple_pay" className="sr-only" />
                <Wallet className="h-8 w-8 mb-2 text-blue-600" />
                <span className="font-medium">Apple Pay</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Credit Card Details (conditionally rendered) */}
          {paymentData.method === "credit_card" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium">Credit Card Details</h3>
              <div>
                <Label htmlFor="cardholderName" className="text-base">
                  Cardholder Name
                </Label>
                <Input
                  id="cardholderName"
                  value={paymentData.cardDetails.cardholderName}
                  onChange={(e) => handleCardDetailsChange("cardholderName", e.target.value)}
                  className={`mt-2 h-12 ${errors.cardholderName ? "border-red-500" : ""}`}
                  placeholder="John Doe"
                />
                {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
              </div>
              <div>
                <Label htmlFor="cardNumber" className="text-base">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  value={paymentData.cardDetails.cardNumber}
                  onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                  className={`mt-2 h-12 ${errors.cardNumber ? "border-red-500" : ""}`}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={19} // 16 digits + 3 spaces
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="expiryDate" className="text-base">
                    Expiry Date (MM/YY)
                  </Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.cardDetails.expiryDate}
                    onChange={(e) => handleCardDetailsChange("expiryDate", e.target.value)}
                    className={`mt-2 h-12 ${errors.expiryDate ? "border-red-500" : ""}`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <Label htmlFor="cvc" className="text-base">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    value={paymentData.cardDetails.cvc}
                    onChange={(e) => handleCardDetailsChange("cvc", e.target.value)}
                    className={`mt-2 h-12 ${errors.cvc ? "border-red-500" : ""}`}
                    placeholder="XXX"
                    maxLength={4}
                  />
                  {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
                </div>
              </div>

              {/* Billing Address */}
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="billingAddressSameAsService"
                  checked={paymentData.billingAddressSameAsService}
                  onChange={(e) => handleChange("billingAddressSameAsService", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="billingAddressSameAsService" className="text-base font-medium">
                  Billing address same as service address
                </Label>
              </div>

              {!paymentData.billingAddressSameAsService && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 mt-4"
                >
                  <h3 className="text-lg font-medium">Billing Address</h3>
                  <div>
                    <Label htmlFor="billingAddress" className="text-base">
                      Street Address
                    </Label>
                    <Input
                      id="billingAddress"
                      value={paymentData.billingAddress.address}
                      onChange={(e) => handleBillingAddressChange("address", e.target.value)}
                      className={`mt-2 h-12 ${errors.billingAddress_address ? "border-red-500" : ""}`}
                      placeholder="123 Main Street"
                    />
                    {errors.billingAddress_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingAddress_address}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="billingAddress2" className="text-base">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="billingAddress2"
                      value={paymentData.billingAddress.address2}
                      onChange={(e) => handleBillingAddressChange("address2", e.target.value)}
                      className="mt-2 h-12"
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="billingCity" className="text-base">
                        City
                      </Label>
                      <Input
                        id="billingCity"
                        value={paymentData.billingAddress.city}
                        onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                        className={`mt-2 h-12 ${errors.billingAddress_city ? "border-red-500" : ""}`}
                        placeholder="New York"
                      />
                      {errors.billingAddress_city && (
                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress_city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billingState" className="text-base">
                        State
                      </Label>
                      <Select
                        value={paymentData.billingAddress.state}
                        onValueChange={(value) => handleBillingAddressChange("state", value)}
                      >
                        <SelectTrigger
                          id="billingState"
                          className={`mt-2 h-12 ${errors.billingAddress_state ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.billingAddress_state && (
                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress_state}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billingZipCode" className="text-base">
                        ZIP Code
                      </Label>
                      <Input
                        id="billingZipCode"
                        value={paymentData.billingAddress.zipCode}
                        onChange={(e) => handleBillingAddressChange("zipCode", e.target.value)}
                        className={`mt-2 h-12 ${errors.billingAddress_zipCode ? "border-red-500" : ""}`}
                        placeholder="10001"
                      />
                      {errors.billingAddress_zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress_zipCode}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>
            <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Review
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
