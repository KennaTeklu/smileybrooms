"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { formatUSPhone } from "@/lib/validation/phone-validation"
import { useState } from "react"

interface ReviewStepProps {
  checkoutData: {
    contact: {
      fullName: string
      email: string
      phone: string
    }
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
    payment: {
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
    termsAgreed: boolean
  }
  cartItems: any[] // Replace 'any' with actual CartItem type if available
  totalAmount: number
  onBack: () => void
  onSubmitOrder: () => void
}

export function ReviewStep({ checkoutData, cartItems, totalAmount, onBack, onSubmitOrder }: ReviewStepProps) {
  const [termsAgreed, setTermsAgreed] = useState(checkoutData.termsAgreed)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAgreed) {
      setError("You must agree to the terms and conditions to place your order.")
      return
    }
    setError(null)
    onSubmitOrder()
  }

  const formatAddress = (address: any) => {
    if (!address) return "N/A"
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  }

  const formatCardNumberDisplay = (cardNumber?: string) => {
    if (!cardNumber) return "N/A"
    const cleaned = cardNumber.replace(/\s/g, "")
    return `**** **** **** ${cleaned.slice(-4)}`
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
        <CardDescription>Please review all details before confirming your order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <p>
            Full Name: <strong>{checkoutData.contact.fullName}</strong>
          </p>
          <p>
            Email: <strong>{checkoutData.contact.email}</strong>
          </p>
          <p>
            Phone: <strong>{formatUSPhone(checkoutData.contact.phone)}</strong>
          </p>
        </div>

        <Separator />

        {/* Service Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Service Address</h3>
          <p>
            Address: <strong>{formatAddress(checkoutData.address)}</strong>
          </p>
        </div>

        <Separator />

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <p>
            Method: <strong>{checkoutData.payment.method === "card" ? "Credit Card" : "Pay In-Person (Zelle)"}</strong>
          </p>
          {checkoutData.payment.method === "card" && (
            <>
              <p>
                Card Number: <strong>{formatCardNumberDisplay(checkoutData.payment.cardDetails?.cardNumber)}</strong>
              </p>
              <p>
                Expiry Date: <strong>{checkoutData.payment.cardDetails?.expiryDate}</strong>
              </p>
              <p>
                Billing Address:{" "}
                <strong>
                  {checkoutData.payment.billingAddressSameAsService
                    ? "Same as service address"
                    : formatAddress(checkoutData.payment.billingAddress)}
                </strong>
              </p>
            </>
          )}
        </div>

        <Separator />

        {/* Cart Items */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center font-bold text-xl">
            <span>Total:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <Separator />

        {/* Terms and Conditions */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAgreed}
            onCheckedChange={(checked) => {
              setTermsAgreed(checked as boolean)
              setError(null)
            }}
          />
          <Label htmlFor="terms">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
          </Label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Payment
        </Button>
        <Button type="submit">Place Order</Button>
      </CardFooter>
    </form>
  )
}
