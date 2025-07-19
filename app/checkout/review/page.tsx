"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import type { CheckoutData } from "@/lib/types"
import { createCheckoutSession } from "@/lib/actions"
import { saveBookingToSupabase } from "@/lib/supabase-actions" // Import the new action
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function ReviewPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    const storedContact = localStorage.getItem("checkout-contact")
    const storedAddress = localStorage.getItem("checkout-address")
    const storedPayment = localStorage.getItem("checkout-payment")

    if (storedContact && storedAddress && storedPayment) {
      setCheckoutData({
        contact: JSON.parse(storedContact),
        address: JSON.parse(storedAddress),
        payment: JSON.parse(storedPayment),
      })
    } else {
      // Redirect if data is missing
      toast({
        title: "Missing Checkout Data",
        description: "Please complete the previous checkout steps.",
        variant: "destructive",
      })
      router.push("/checkout")
    }
  }, [router, toast])

  const handlePlaceOrder = async () => {
    if (!checkoutData || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Missing checkout data or empty cart.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // 1. Save booking data to Supabase
      const savedBookingId = await saveBookingToSupabase({
        checkoutData,
        cartItems: cart.items,
        totalAmount: cart.totalPrice, // Use the calculated total price from cart context
      })
      setBookingId(savedBookingId)
      toast({
        title: "Booking Saved",
        description: `Your booking (ID: ${savedBookingId}) has been saved. Redirecting to payment...`,
        variant: "success",
      })

      // 2. Create Stripe Checkout Session
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.description || "",
        images: item.image ? [item.image] : [],
        metadata: item.metadata ? JSON.stringify(item.metadata) : "{}", // Ensure metadata is stringified
      }))

      const customerData = {
        name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
        email: checkoutData.contact.email,
        phone: checkoutData.contact.phone,
        address: {
          line1: checkoutData.address.address,
          city: checkoutData.address.city,
          state: checkoutData.address.state,
          postal_code: checkoutData.address.zipCode,
          country: "US", // Assuming US for now, adjust as needed
        },
        allowVideoRecording: checkoutData.payment.allowVideoRecording,
        videoConsentDetails: checkoutData.payment.videoConsentDetails,
      }

      const stripeSessionUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success?bookingId=${savedBookingId}`, // Pass booking ID to success page
        cancelUrl: `${window.location.origin}/canceled?bookingId=${savedBookingId}`, // Pass booking ID to canceled page
        customerEmail: checkoutData.contact.email,
        customerData: customerData,
        automaticTax: { enabled: true },
        allowPromotions: true,
      })

      if (stripeSessionUrl) {
        window.location.href = stripeSessionUrl
      } else {
        throw new Error("Failed to get Stripe session URL.")
      }
    } catch (error: any) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Error",
        description: error.message || "An unexpected error occurred during checkout.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading checkout data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Review Your Order</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How we'll reach you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {checkoutData.contact.firstName} {checkoutData.contact.lastName}
            </p>
            <p>
              <strong>Email:</strong> {checkoutData.contact.email}
            </p>
            <p>
              <strong>Phone:</strong> {checkoutData.contact.phone}
            </p>
          </CardContent>
        </Card>

        {/* Service Address */}
        <Card>
          <CardHeader>
            <CardTitle>Service Address</CardTitle>
            <CardDescription>Where we'll provide the service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Address:</strong> {checkoutData.address.address}
            </p>
            {checkoutData.address.address2 && <p>{checkoutData.address.address2}</p>}
            <p>
              <strong>City, State Zip:</strong> {checkoutData.address.city}, {checkoutData.address.state}{" "}
              {checkoutData.address.zipCode}
            </p>
            <p>
              <strong>Type:</strong> {checkoutData.address.addressType}
            </p>
            {checkoutData.address.specialInstructions && (
              <p>
                <strong>Instructions:</strong> {checkoutData.address.specialInstructions}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Preferences</CardTitle>
            <CardDescription>Your selected payment method and options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Payment Method:</strong> {checkoutData.payment.paymentMethod}
            </p>
            <p>
              <strong>Allow Live Video Recording:</strong> {checkoutData.payment.allowVideoRecording ? "Yes" : "No"}
            </p>
            {checkoutData.payment.allowVideoRecording && checkoutData.payment.videoConsentDetails && (
              <p className="text-sm text-gray-500">
                Consent recorded at: {new Date(checkoutData.payment.videoConsentDetails).toLocaleString()}
              </p>
            )}
            <p>
              <strong>Agree to Terms:</strong> {checkoutData.payment.agreeToTerms ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>

        {/* Cart Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Details of your selected services.</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cart.subtotalPrice.toFixed(2)}</span>
              </div>
              {cart.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({cart.couponCode}):</span>
                  <span>-${cart.couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {cart.fullHouseDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Full House Discount:</span>
                  <span>-${cart.fullHouseDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total (Online Payment):</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              {cart.inPersonPaymentTotal > 0 && (
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>In-Person Payment Total:</span>
                  <span>${cart.inPersonPaymentTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handlePlaceOrder} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order & Pay Securely"
          )}
        </Button>
      </div>
    </div>
  )
}
