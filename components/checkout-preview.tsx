"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, MapPin, CreditCard, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { CheckoutData } from "@/lib/types"
import { requiresEmailPricing } from "@/lib/room-tiers"

interface CheckoutPreviewProps {
  checkoutData: CheckoutData
}

export default function CheckoutPreview({ checkoutData }: CheckoutPreviewProps) {
  const { cart } = useCart()
  const { contact, address, payment } = checkoutData

  const onlinePaymentItems = cart.items.filter((item) => item.paymentType !== "in_person")
  const inPersonPaymentItems = cart.items.filter((item) => item.paymentType === "in_person")

  const subtotalOnline = onlinePaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = payment?.allowVideoRecording ? (subtotalOnline >= 250 ? 25 : subtotalOnline * 0.1) : 0
  const totalBeforeTaxOnline = subtotalOnline - videoDiscount
  const tax = totalBeforeTaxOnline * 0.08 // 8% tax
  const totalOnline = totalBeforeTaxOnline + tax

  const totalInPerson = inPersonPaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
        <CardDescription>A quick overview of your order details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Your Items</h3>
          {cart.items.length === 0 ? (
            <p className="text-muted-foreground">No items in cart.</p>
          ) : (
            cart.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                {item.paymentType === "in_person" || requiresEmailPricing(item.metadata?.roomType) ? (
                  <span className="text-orange-600">Email for Pricing</span>
                ) : (
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                )}
              </div>
            ))
          )}
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Subtotal (Online)</span>
            <span>{formatCurrency(subtotalOnline)}</span>
          </div>
          {videoDiscount > 0 && (
            <div className="flex justify-between text-base text-green-600">
              <span>Video Discount</span>
              <span>-{formatCurrency(videoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total (Online)</span>
            <span>{formatCurrency(totalOnline)}</span>
          </div>
          {totalInPerson > 0 && (
            <div className="flex justify-between text-lg font-bold text-orange-600 mt-4">
              <span>Custom Services</span>
              <span>Email for Pricing</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Address
          </h3>
          <p className="text-sm">{address.fullName}</p>
          <p className="text-sm">{address.email}</p>
          <p className="text-sm">{address.phone}</p>
          <p className="text-sm">
            {address.address}
            {address.address2 && `, ${address.address2}`}
          </p>
          <p className="text-sm">
            {address.city}, {address.state} {address.zipCode}
          </p>
          {address.specialInstructions && (
            <p className="text-sm text-muted-foreground">Instructions: {address.specialInstructions}</p>
          )}
        </div>

        <Separator />

        {/* Payment Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </h3>
          <p className="text-sm font-medium">
            {payment.paymentMethod === "card"
              ? "Credit/Debit Card"
              : payment.paymentMethod === "paypal"
                ? "PayPal"
                : payment.paymentMethod === "apple"
                  ? "Apple Pay"
                  : "Google Pay"}
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-600" />
              <span>Billing address same as service address</span>
            </div>
            {payment.allowVideoRecording && (
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>Video recording discount applied</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
