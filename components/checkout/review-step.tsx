"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { formatAddress } from "@/lib/validation/address-validation"
import { formatUSPhone } from "@/lib/validation/phone-validation"

interface ReviewStepProps {
  data: CheckoutData["review"]
  checkoutData: CheckoutData // Full checkout data for review
  onSave: (data: CheckoutData["review"]) => void
  onPrevious: () => void
}

export default function ReviewStep({ data, checkoutData, onSave, onPrevious }: ReviewStepProps) {
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [reviewData, setReviewData] = useState(data)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setReviewData(data)
  }, [data])

  const handleAgreeToTermsChange = (checked: boolean) => {
    setReviewData((prev) => ({ ...prev, agreedToTerms: checked }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewData.agreedToTerms) {
      toast({
        title: "Terms and Conditions Required",
        description: "Please agree to the terms and conditions to place your order.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    onSave(reviewData) // Save the agreement status

    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    toast({
      title: "Order Placed!",
      description: "Your cleaning service has been booked successfully.",
      variant: "success",
    })
    router.push("/success")
    setIsSubmitting(false)
  }

  const { contact, address, payment } = checkoutData

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review Your Order
        </CardTitle>
        <CardDescription>Please review all details before placing your order.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Cart Items</h3>
            {cart.items.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {item.quantity} x {item.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(cart.totalPrice)}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p>
              <strong>Name:</strong> {contact.firstName} {contact.lastName}
            </p>
            <p>
              <strong>Email:</strong> {contact.email}
            </p>
            <p>
              <strong>Phone:</strong> {formatUSPhone(contact.phone)}
            </p>
          </div>

          <Separator />

          {/* Service Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Address</h3>
            <p>
              <strong>Type:</strong> {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {formatAddress({
                street: address.address,
                street2: address.address2,
                city: address.city,
                state: address.state,
                postalCode: address.zipCode,
                country: "US", // Assuming US for now based on US_STATES
              })}
            </p>
            {address.specialInstructions && (
              <p>
                <strong>Instructions:</strong> {address.specialInstructions}
              </p>
            )}
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <p>
              <strong>Method:</strong> {payment.method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            {payment.method === "credit_card" && (
              <>
                <p>
                  <strong>Cardholder:</strong> {payment.cardDetails.cardholderName}
                </p>
                <p>
                  <strong>Card Number:</strong> **** **** **** {payment.cardDetails.cardNumber.slice(-4)}
                </p>
                {!payment.billingAddressSameAsService && (
                  <div className="mt-4">
                    <p className="font-medium">Billing Address:</p>
                    <p>
                      {formatAddress({
                        street: payment.billingAddress.address,
                        street2: payment.billingAddress.address2,
                        city: payment.billingAddress.city,
                        state: payment.billingAddress.state,
                        postalCode: payment.billingAddress.zipCode,
                        country: "US", // Assuming US for now
                      })}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={reviewData.agreedToTerms}
              onCheckedChange={handleAgreeToTermsChange}
              aria-label="Agree to terms and conditions"
            />
            <Label htmlFor="terms" className="text-base font-medium">
              I agree to the{" "}
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>
            </Label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payment
            </Button>
            <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
