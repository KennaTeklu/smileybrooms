"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import AccessibilityToolbar from "@/components/accessibility-toolbar"

type CustomerData = {
  name: string
  email: string
  phone: string
  address: string
  specialInstructions?: string
  allowVideoRecording?: boolean
}

type OrderItem = {
  name: string
  price: number
  metadata?: {
    rooms?: string
    frequency?: string
    serviceType?: string
    customer?: CustomerData
  }
}

export default function SuccessPage() {
  const { clearCart, cart } = useCart()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  // Store cart items before clearing and clear the cart when the success page loads
  useEffect(() => {
    // Save the cart items before clearing
    setOrderItems([...cart.items])
    clearCart()
  }, [clearCart, cart.items])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your purchase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <p>Your transaction has been completed successfully.</p>
            <p className="mt-2">A confirmation email has been sent to your email address.</p>
          </div>

          {orderItems.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Order Summary</h3>

              {orderItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.metadata?.frequency && (
                      <CardDescription>
                        Frequency:{" "}
                        {item.metadata.frequency.replace(/_/g, " ").charAt(0).toUpperCase() +
                          item.metadata.frequency.replace(/_/g, " ").slice(1)}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pb-4">
                    {item.metadata?.rooms && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Rooms:</strong> {item.metadata.rooms}
                      </p>
                    )}

                    {item.metadata?.customer && (
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <h4 className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> Location Details
                        </h4>
                        <p className="text-sm">
                          <strong>Customer:</strong> {item.metadata.customer.name}
                        </p>
                        <p className="text-sm">
                          <strong>Contact:</strong> {item.metadata.customer.email} | {item.metadata.customer.phone}
                        </p>
                        <p className="text-sm">
                          <strong>Address:</strong> {item.metadata.customer.address}
                        </p>
                        {item.metadata.customer.specialInstructions && (
                          <p className="text-sm">
                            <strong>Special Instructions:</strong> {item.metadata.customer.specialInstructions}
                          </p>
                        )}
                        {item.metadata.customer.allowVideoRecording && (
                          <p className="text-sm text-green-600">Video recording discount applied</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-right">
                    <p className="font-bold">{formatCurrency(item.price)}</p>
                  </div>
                </Card>
              ))}

              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold">Total Paid:</h3>
                <p className="font-bold text-xl">
                  {formatCurrency(orderItems.reduce((sum, item) => sum + item.price, 0))}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
