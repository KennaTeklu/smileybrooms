"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function SuccessPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  // Get order details from URL params
  const orderDetails = {
    id: Math.random().toString(36).substring(2, 10).toUpperCase(),
    date: new Date().toLocaleDateString(),
    total: cart.totalPrice + cart.totalPrice * 0.0825,
  }

  // Clear cart on successful checkout
  useEffect(() => {
    // Small delay to ensure the cart is displayed before clearing
    const timer = setTimeout(() => {
      clearCart()
    }, 1000)

    return () => clearTimeout(timer)
  }, [clearCart])

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Order #{orderDetails.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Order Date</span>
            <span>{orderDetails.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-bold">{formatCurrency(orderDetails.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Paid
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Our team will contact you within 24 hours to confirm your preferred cleaning date and time.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Preparation</h3>
              <p className="text-sm text-muted-foreground">
                We'll send you a preparation checklist to ensure the best cleaning experience.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/")}>
            Return Home
          </Button>
          <Button onClick={() => router.push("/account/bookings")}>View My Bookings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
