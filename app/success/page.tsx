"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Download, Copy, Home } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"

export default function SuccessPage() {
  const { clearCart, cart } = useCart()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState({
    id: "",
    date: new Date().toLocaleDateString(),
    total: 0,
    email: "",
  })

  // Get the session_id from URL if available
  const sessionId = searchParams.get("session_id")

  // Clear the cart and show confetti when the success page loads
  useEffect(() => {
    clearCart()

    // Trigger confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
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

    // Simulate loading order details
    const timer = setTimeout(() => {
      setOrderDetails({
        id: sessionId || `order_${Math.random().toString(36).substring(2, 10)}`,
        date: new Date().toLocaleDateString(),
        total: cart.totalPrice || Math.floor(Math.random() * 10000) / 100,
        email: "customer@example.com",
      })
      setIsLoading(false)
    }, 1500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [clearCart, cart.totalPrice, sessionId])

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.id)
    toast({
      title: "Copied to clipboard",
      description: "Order ID has been copied to your clipboard",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 dark:from-green-950/20 dark:to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-base">Thank you for your purchase</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order ID</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-28" />
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{orderDetails.id.substring(0, 14)}...</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyOrderId}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <span className="text-sm font-medium">{orderDetails.date}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  <span className="text-sm font-medium">{orderDetails.email}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <span className="text-sm font-medium">{formatCurrency(orderDetails.total)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm">A confirmation email has been sent to your email address.</p>
            <p className="text-sm text-muted-foreground">If you have any questions, please contact our support team.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>

          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Receipt
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/orders">
                View Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
