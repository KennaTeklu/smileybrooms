"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatUSPhone, formatAddress } from "@/lib/utils" // Assuming formatAddress exists
import { useCart } from "@/lib/cart-context"
import Image from "next/image"

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
      paymentMethod: string
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
  }
  onBack: () => void
  onSubmit: () => void
}

export function ReviewStep({ checkoutData, onBack, onSubmit }: ReviewStepProps) {
  const { cart } = useCart()

  const displayCardNumber = checkoutData.payment.cardDetails?.cardNumber
    ? `**** **** **** ${checkoutData.payment.cardDetails.cardNumber.slice(-4)}`
    : "N/A"

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Review Your Order</CardTitle>
        <CardDescription>Please review all details before confirming your booking.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <p>
            <strong>Name:</strong> {checkoutData.contact.fullName}
          </p>
          <p>
            <strong>Email:</strong> {checkoutData.contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {formatUSPhone(checkoutData.contact.phone)}
          </p>
        </div>

        <Separator />

        {/* Service Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Service Address</h3>
          <p>{formatAddress(checkoutData.address)}</p>
        </div>

        <Separator />

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <p>
            <strong>Method:</strong>{" "}
            {checkoutData.payment.paymentMethod === "credit_card" ? "Credit Card" : "In-Person"}
          </p>
          {checkoutData.payment.paymentMethod === "credit_card" && (
            <>
              <p>
                <strong>Card Number:</strong> {displayCardNumber}
              </p>
              <p>
                <strong>Expiry Date:</strong> {checkoutData.payment.cardDetails?.expiryDate}
              </p>
            </>
          )}
          <p className="mt-2">
            <strong>Billing Address:</strong>{" "}
            {checkoutData.payment.billingAddressSameAsService
              ? "Same as service address"
              : checkoutData.payment.billingAddress
                ? formatAddress(checkoutData.payment.billingAddress)
                : "N/A"}
          </p>
        </div>

        <Separator />

        {/* Cart Items */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Services</h3>
          <div className="space-y-4">
            {cart.items.length === 0 ? (
              <p className="text-muted-foreground">No services in cart.</p>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Total Price */}
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Total:</span>
          <span>{formatCurrency(cart.totalPrice)}</span>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
            Back to Payment
          </Button>
          <Button type="button" onClick={onSubmit} className="w-full">
            Confirm Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
