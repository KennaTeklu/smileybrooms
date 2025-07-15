"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatUSPhone, formatAddress } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useRoomContext } from "@/lib/room-context"
import { ROOM_TIERS, ROOM_TYPES, requiresEmailPricing } from "@/lib/room-tiers"
import type { CheckoutData } from "@/app/checkout/page"
import Image from "next/image"

interface ReviewStepProps {
  checkoutData: CheckoutData
}

export function ReviewStep({ checkoutData }: ReviewStepProps) {
  const { cart } = useCart()
  const { calculateRoomPrice } = useRoomContext()

  const { contact, address, payment } = checkoutData

  const totalOnlinePrice = cart.items
    .filter((item) => item.paymentType !== "in_person")
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const totalInPersonPrice = cart.items
    .filter((item) => item.paymentType === "in_person")
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Review the cleaning services you've selected.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.length === 0 ? (
            <p className="text-gray-500">No services selected.</p>
          ) : (
            cart.items.map((item) => {
              const roomTypeLabel =
                ROOM_TYPES.find((r) => r.value === item.metadata?.roomType)?.label || item.metadata?.roomType || "N/A"
              const tierLabel =
                ROOM_TIERS.find((t) => t.value === item.metadata?.selectedTier)?.label ||
                item.metadata?.selectedTier ||
                "N/A"
              const pricePerUnit = item.price
              const totalPriceForItem = item.price * item.quantity

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {roomTypeLabel} ({tierLabel})
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.metadata?.selectedReductions && item.metadata.selectedReductions.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Reductions: {item.metadata.selectedReductions.map((r) => r.replace(/-/g, " ")).join(", ")}
                        </p>
                      )}
                      {requiresEmailPricing(item.metadata?.roomType || "") && (
                        <p className="text-sm text-orange-500">Pricing via email consultation</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(totalPriceForItem)}</p>
                    {!requiresEmailPricing(item.metadata?.roomType || "") && (
                      <p className="text-sm text-gray-500">{formatCurrency(pricePerUnit)} / unit</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Online Payment:</span>
            <span>{formatCurrency(totalOnlinePrice)}</span>
          </div>
          {totalInPersonPrice > 0 && (
            <div className="flex justify-between font-bold text-lg text-orange-600">
              <span>Total In-Person Payment:</span>
              <span>{formatCurrency(totalInPersonPrice)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Full Name:</span> {contact.fullName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {contact.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {formatUSPhone(contact.phone)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{formatAddress(address)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {payment.method === "card" ? (
            <>
              <p>
                <span className="font-medium">Card Type:</span> {payment.cardType}
              </p>
              <p>
                <span className="font-medium">Last 4 Digits:</span> **** **** **** {payment.last4}
              </p>
              <p>
                <span className="font-medium">Expiry:</span> {payment.expiryMonth}/{payment.expiryYear}
              </p>
              {payment.billingAddressSameAsService ? (
                <p className="text-sm text-gray-500">Billing address same as service address.</p>
              ) : (
                <>
                  <p className="font-medium mt-4">Billing Address:</p>
                  <p>{formatAddress(payment.billingAddress)}</p>
                </>
              )}
            </>
          ) : (
            <p>Payment will be collected in-person.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
