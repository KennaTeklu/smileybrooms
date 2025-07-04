"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold">Order Placed Successfully!</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            A confirmation email with your order details has been sent to your inbox.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">View My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
