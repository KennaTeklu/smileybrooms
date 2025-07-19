"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Home, Mail, ReceiptText } from "lucide-react" // Added ReceiptText
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { sendOrderConfirmationEmail } from "@/lib/email-actions"
import { useSearchParams } from "next/navigation" // Import useSearchParams
import Loader2 from "@/components/ui/loader2" // Assuming Loader2 is imported from a UI component library
import Card from "@/components/ui/card" // Assuming Card is imported from a UI component library
import CardHeader from "@/components/ui/card-header" // Assuming CardHeader is imported from a UI component library
import CardTitle from "@/components/ui/card-title" // Assuming CardTitle is imported from a UI component library
import CardDescription from "@/components/ui/card-description" // Assuming CardDescription is imported from a UI component library
import CardContent from "@/components/ui/card-content" // Assuming CardContent is imported from a UI component library
import CardFooter from "@/components/ui/card-footer" // Assuming CardFooter is imported from a UI component library
import Button from "@/components/ui/button" // Assuming Button is imported from a UI component library
import ArrowLeft from "@/components/ui/arrow-left" // Assuming ArrowLeft is imported from a UI component library
import XCircle from "@/components/ui/x-circle" // Assuming XCircle is imported from a UI component library

// Define a type for the fetched order details (mocked for now)
interface FetchedOrderDetails {
  orderId: string
  customerEmail: string
  customerName: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number }>
  serviceAddress: string
  paymentMethod: string
  wantsLiveVideo: boolean
  status: "completed" | "pending" | "failed"
  paymentIntentId?: string
  checkoutSessionId?: string
}

export default function SuccessPage() {
  const { clearCart } = useCart()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderFetched, setOrderFetched] = useState(false)
  const [orderDetails, setOrderDetails] = useState<FetchedOrderDetails | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError("No Stripe session ID found. Cannot confirm order details.")
        setIsLoading(false)
        toast({
          title: "Order Not Found",
          description: "Could not retrieve order details. Please contact support if you believe your order was placed.",
          variant: "destructive",
        })
        return
      }

      try {
        // In a real application, you would make an API call to your backend
        // to fetch the order details using the sessionId.
        // Your backend would then verify the session with Stripe and retrieve
        // the actual order data from your database.

        // For this example, we'll simulate fetching and use local storage data
        // as a fallback, but emphasize that this should be server-side.
        const contactData = JSON.parse(localStorage.getItem("checkout-contact") || "{}")
        const addressData = JSON.parse(localStorage.getItem("checkout-address") || "{}")
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

        // Simulate a backend call to get confirmed order details
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

        const mockOrder: FetchedOrderDetails = {
          orderId: `ORD-${sessionId.substring(0, 8).toUpperCase()}`, // Mock ID from session
          customerEmail: contactData.email || "customer@example.com",
          customerName: `${contactData.firstName || ""} ${contactData.lastName || ""}`.trim() || "Valued Customer",
          totalAmount: 0, // Will be calculated below
          items: cartItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.unitPrice || item.price,
          })),
          serviceAddress:
            `${addressData.address || ""}, ${addressData.city || ""}, ${addressData.state || ""} ${addressData.zipCode || ""}`.trim(),
          paymentMethod: "Card (Stripe)", // Assuming card via Stripe Checkout
          wantsLiveVideo: !!addressData.allowVideoRecording,
          status: "completed",
          checkoutSessionId: sessionId,
        }

        // Recalculate total based on cart items and potential discounts from addressData
        const subtotal = mockOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        let totalBeforeTax = subtotal

        // Apply mock video discount if opted in (should be handled by backend pricing)
        if (mockOrder.wantsLiveVideo) {
          const videoDiscount = subtotal * 0.1 // 10% discount
          totalBeforeTax -= videoDiscount
          mockOrder.items.push({ name: "Video Recording Discount", quantity: 1, price: -videoDiscount }) // Add as a negative item for display
        }

        const tax = totalBeforeTax * 0.05 // Example 5% tax
        mockOrder.totalAmount = totalBeforeTax + tax

        setOrderDetails(mockOrder)
        setOrderFetched(true)
        setIsLoading(false)

        // Clear cart and local storage data after successful checkout and order details are fetched
        clearCart()
        localStorage.removeItem("checkout-contact")
        localStorage.removeItem("checkout-address")
        localStorage.removeItem("checkout-payment")
        localStorage.removeItem("stripe-session") // Clear Stripe session info
        localStorage.removeItem("cartItems") // Ensure cart items are cleared
      } catch (err) {
        console.error("Failed to fetch order details:", err)
        setError("Failed to load order details. Please contact support.")
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load order details. Please contact support.",
          variant: "destructive",
        })
      }
    }

    if (!orderFetched) {
      fetchOrderDetails()
    }
  }, [sessionId, clearCart, toast, orderFetched])

  useEffect(() => {
    // Send email only once after order details are fetched and not already sent
    if (orderDetails && !emailSent) {
      const sendEmail = async () => {
        try {
          await sendOrderConfirmationEmail(orderDetails)
          setEmailSent(true)
          toast({
            title: "Email Sent!",
            description: "Your order confirmation has been sent to your email.",
            variant: "success",
          })
        } catch (error) {
          console.error("Failed to send order confirmation email:", error)
          toast({
            title: "Email Failed",
            description: "Could not send order confirmation email. Please check your spam folder.",
            variant: "destructive",
          })
        }
      }
      sendEmail()
    }
  }, [orderDetails, emailSent, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center text-gray-700 dark:text-gray-300">
          <Loader2 className="h-16 w-16 animate-spin text-green-600 dark:text-green-400" />
          <p className="mt-4 text-lg font-medium">Confirming your order...</p>
          <p className="text-sm text-muted-foreground">Please do not close this page.</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle>Order Confirmation Failed</CardTitle>
            <CardDescription>{error || "An unexpected error occurred."}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mt-2">We were unable to confirm your order. Please try again or contact support.</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-8">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Summary Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ReceiptText className="mr-2 h-5 w-5" /> Order Summary
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              <strong>Order ID:</strong> {orderDetails.orderId}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              <strong>Customer:</strong> {orderDetails.customerName} ({orderDetails.customerEmail})
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              <strong>Service Address:</strong> {orderDetails.serviceAddress}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              <strong>Payment Method:</strong> {orderDetails.paymentMethod}
            </p>
            <div className="border-t border-gray-200 dark:border-gray-600 my-3 pt-3">
              <p className="text-base font-bold text-gray-900 dark:text-white flex justify-between">
                <span>Total Paid:</span> <span>${orderDetails.totalAmount.toFixed(2)}</span>
              </p>
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">Items:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              {orderDetails.items.map((item, index) => (
                <li key={index}>
                  {item.name} (x{item.quantity}) - ${item.price.toFixed(2)} each
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center text-gray-700 dark:text-gray-200">
              <Mail className="mr-2 h-5 w-5" />
              <p>A detailed confirmation email has been sent to your inbox.</p>
            </div>
            {orderDetails.wantsLiveVideo && (
              <div className="flex items-center justify-center text-gray-700 dark:text-gray-200">
                <p>You’ll receive a private YouTube Live link to watch your cleaning.</p>
              </div>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
