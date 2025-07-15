"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import type { CartState } from "@/lib/cart-context" // Assuming CartState is exported from cart-context
import { formatUSPhone } from "@/lib/validation/phone-validation" // Assuming this utility exists
import { formatAddress } from "@/lib/validation/address-validation" // Assuming this utility exists

interface ReviewStepProps {
  data: {
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
      unit?: string
    }
    billingAddressSameAsService: boolean
    billingAddress: {
      street: string
      city: string
      state: string
      zip: string
      unit?: string
    }
    paymentMethod: string
    cardDetails: {
      cardNumber: string
      expiryDate: string
      cvc: string
      cardholderName: string
    }
    notes?: string
  }
  cart: CartState // Pass the entire cart state
  onNext: (data: any) => void
  onBack: () => void
  isLastStep: boolean
}

export function ReviewStep({ data, cart, onNext, onBack, isLastStep }: ReviewStepProps) {
  const { contact, address, billingAddressSameAsService, billingAddress, paymentMethod, cardDetails, notes } = data

  const displayBillingAddress = billingAddressSameAsService ? address : billingAddress

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                {item.name} (x{item.quantity})
              </span>
              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(cart.totalPrice)}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
        <p>
          <strong>Name:</strong> {contact.fullName}
        </p>
        <p>
          <strong>Email:</strong> {contact.email}
        </p>
        <p>
          <strong>Phone:</strong> {formatUSPhone(contact.phone)}
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-3">Service Address</h3>
        <p>{formatAddress(address)}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-3">Billing Address</h3>
        <p>{billingAddressSameAsService ? "Same as service address" : formatAddress(displayBillingAddress)}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-3">Payment Method</h3>
        <p>
          <strong>Method:</strong> {paymentMethod === "credit_card" ? "Credit Card" : "PayPal"}
        </p>
        {paymentMethod === "credit_card" && (
          <>
            <p>
              <strong>Cardholder:</strong> {cardDetails.cardholderName}
            </p>
            <p>
              <strong>Card Number:</strong> **** **** **** {cardDetails.cardNumber.slice(-4)}
            </p>
            <p>
              <strong>Expiry Date:</strong> {cardDetails.expiryDate}
            </p>
          </>
        )}
      </div>

      {notes && (
        <>
          <Separator />
          <div>
            <h3 className="text-xl font-semibold mb-3">Additional Notes</h3>
            <p>{notes}</p>
          </div>
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Payment
        </Button>
        <Button type="button" onClick={onNext}>
          {isLastStep ? "Confirm Order" : "Continue"}
        </Button>
      </div>
    </div>
  )
}
