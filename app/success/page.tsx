/* Don't modify beyond what is requested ever. */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, ExternalLink, Calendar, CreditCard, ArrowRight, Home, Plus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import confetti from "canvas-confetti"
import { incrementServiceCount, addServiceRecord } from "@/lib/service-cookies"

type CustomerData = {
  name: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  specialInstructions?: string
  allowVideoRecording?: boolean
}

type OrderItem = {
  name: string
  price: number
  quantity: number
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
  const [isClient, setIsClient] = useState(false)

  // Store cart items before clearing and clear the cart when the success page loads
  useEffect(() => {
    setIsClient(true)

    // Save the cart items before clearing
    setOrderItems([...cart.items])
    clearCart()

    // Increment service count and add service records
    if (cart.items.length > 0) {
      incrementServiceCount()

      // Add each item as a service record
      cart.items.forEach((item) => {
        const scheduledDate = new Date()
        scheduledDate.setDate(scheduledDate.getDate() + 7) // Default to 7 days from now

        addServiceRecord({
          id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          date: new Date().toLocaleDateString(),
          completed: false,
          scheduledDate: scheduledDate.toLocaleDateString(),
        })
      })
    }

    // Trigger confetti effect
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [clearCart, cart.items])

  // Function to create Google Maps link
  const createGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  // Get the first customer data from the order items
  const getCustomerData = () => {
    for (const item of orderItems) {
      if (item.metadata?.customer) {
        return item.metadata.customer
      }
    }
    return null
  }

  const customerData = getCustomerData()
  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground mt-2">Thank you for your order. Your transaction has been completed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" /> Order Summary
                </CardTitle>
                <CardDescription>Order placed on {orderDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.metadata?.frequency && (
                            <p className="text-sm text-muted-foreground">
                              Frequency:{" "}
                              {item.metadata.frequency.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                          )}
                          {item.metadata?.rooms && (
                            <p className="text-sm text-muted-foreground">Rooms: {item.metadata.rooms}</p>
                          )}
                          {item.quantity > 1 && (
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          )}
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No items in this order</p>
                )}

                <div className="flex justify-between pt-4 font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {customerData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" /> Service Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{customerData.name}</p>
                    <p>{customerData.address}</p>
                    {customerData.city && customerData.state && customerData.zipCode && (
                      <p>
                        {customerData.city}, {customerData.state} {customerData.zipCode}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">{customerData.phone}</p>
                    <p className="text-sm text-muted-foreground">{customerData.email}</p>

                    {customerData.address && (
                      <a
                        href={createGoogleMapsLink(customerData.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline mt-2"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        View on Google Maps
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}

                    {customerData.specialInstructions && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-1">Special Instructions</h4>
                        <p className="text-sm">{customerData.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to {customerData?.email || "your email address"} with all the
                    details of your order.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Service Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team will contact you within 24 hours to confirm your cleaning appointment.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Return to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/services">
                    <ArrowRight className="mr-2 h-4 w-4" /> Browse More Services
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/pricing" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Book a New Service
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
