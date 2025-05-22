"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, CheckCircle } from "lucide-react"

interface SavedAddress {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface SavedPaymentMethod {
  id: string
  type: "visa" | "mastercard" | "amex" | "discover"
  last4: string
  expiry: string
  isDefault: boolean
}

interface CustomerProfile {
  name: string
  email: string
  phone: string
  addresses: SavedAddress[]
  paymentMethods: SavedPaymentMethod[]
}

interface OneClickBookingProps {
  serviceTotal: number
  serviceName: string
  customerProfile: CustomerProfile
  onSuccess: () => void
  onCancel: () => void
}

export function OneClickBooking({
  serviceTotal,
  serviceName,
  customerProfile,
  onSuccess,
  onCancel,
}: OneClickBookingProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customerProfile.addresses.find((a) => a.isDefault)?.id || customerProfile.addresses[0]?.id || "",
  )
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    customerProfile.paymentMethods.find((p) => p.isDefault)?.id || customerProfile.paymentMethods[0]?.id || "",
  )

  // Calculate tax and total
  const tax = serviceTotal * 0.0825 // 8.25% tax rate
  const total = serviceTotal + tax

  const selectedAddress = customerProfile.addresses.find((a) => a.id === selectedAddressId)
  const selectedPayment = customerProfile.paymentMethods.find((p) => p.id === selectedPaymentId)

  const handleBookNow = async () => {
    if (!selectedAddress || !selectedPayment) {
      toast({
        title: "Missing information",
        description: "Please select an address and payment method",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Create checkout session with selected address and payment method
      const checkoutUrl = await createCheckoutSession({
        customLineItems: [
          {
            name: serviceName,
            amount: serviceTotal,
            quantity: 1,
          },
        ],
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: {
          name: customerProfile.name,
          email: customerProfile.email,
          phone: customerProfile.phone,
          address: {
            line1: selectedAddress.address,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postal_code: selectedAddress.zipCode,
            country: "US",
          },
        },
      })

      // In a real implementation, you would handle saved payment methods differently
      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        setIsProcessing(false)
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      case "discover":
        return "💳"
      default:
        return "💳"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Checkout</CardTitle>
        <CardDescription>Book your service with one click using your saved information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service summary */}
        <div className="space-y-2">
          <h3 className="font-medium">Service</h3>
          <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-md">
            <span>{serviceName}</span>
            <span className="font-medium">{formatCurrency(serviceTotal)}</span>
          </div>
        </div>

        {/* Address selection */}
        <div className="space-y-2">
          <h3 className="font-medium">Service Address</h3>
          <div className="grid gap-2">
            {customerProfile.addresses.map((address) => (
              <div
                key={address.id}
                className={`flex items-start p-3 border rounded-md cursor-pointer ${
                  selectedAddressId === address.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <div className="flex-1">
                  <div className="font-medium">{address.name}</div>
                  <div className="text-sm text-gray-500">{address.address}</div>
                  <div className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.zipCode}
                  </div>
                </div>
                {selectedAddressId === address.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Payment method selection */}
        <div className="space-y-2">
          <h3 className="font-medium">Payment Method</h3>
          <div className="grid gap-2">
            {customerProfile.paymentMethods.map((payment) => (
              <div
                key={payment.id}
                className={`flex items-center p-3 border rounded-md cursor-pointer ${
                  selectedPaymentId === payment.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedPaymentId(payment.id)}
              >
                <div className="mr-3 text-xl">{getCardIcon(payment.type)}</div>
                <div className="flex-1">
                  <div className="font-medium capitalize">
                    {payment.type} •••• {payment.last4}
                  </div>
                  <div className="text-sm text-gray-500">Expires {payment.expiry}</div>
                </div>
                {selectedPaymentId === payment.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-2 pt-4">
          <Separator />
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>{formatCurrency(serviceTotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax (8.25%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full py-6 text-lg"
          size="lg"
          onClick={handleBookNow}
          disabled={isProcessing || !selectedAddressId || !selectedPaymentId}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" /> Book Now • {formatCurrency(total)}
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Edit Booking Details
        </Button>
      </CardFooter>
    </Card>
  )
}
