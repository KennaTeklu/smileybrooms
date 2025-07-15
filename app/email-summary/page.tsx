"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Share2, Printer, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { generateEmailSummary } from "@/lib/email-actions" // Assuming this is a server action
import { motion } from "framer-motion"
import Loader2 from "@/components/ui/loader2" // Declaring Loader2 variable

interface OrderSummary {
  orderId: string
  customerName: string
  customerEmail: string
  serviceAddress: string
  serviceDate: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number; metadata?: Record<string, any> }>
  paymentMethod: string
  specialInstructions?: string
}

export default function EmailSummaryPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { toast } = useToast()

  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  useEffect(() => {
    // Simulate fetching order summary based on orderId
    // In a real application, this would be an API call to your backend
    const fetchOrderSummary = async () => {
      setIsLoading(true)
      try {
        // Placeholder data - replace with actual fetch logic
        const dummySummary: OrderSummary = {
          orderId: orderId || "ORD123456",
          customerName: "John Doe",
          customerEmail: "john.doe@example.com",
          serviceAddress: "123 Main St, New York, NY 10001",
          serviceDate: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          totalAmount: 250.75,
          items: [
            { name: "Standard Cleaning", quantity: 1, price: 150, metadata: { rooms: "2 Bed, 2 Bath" } },
            { name: "Deep Cleaning Add-on", quantity: 1, price: 75 },
            { name: "Window Cleaning", quantity: 1, price: 25 },
          ],
          paymentMethod: "Credit/Debit Card",
          specialInstructions: "Please pay attention to the kitchen floor.",
        }
        setSummary(dummySummary)
      } catch (error) {
        console.error("Failed to fetch order summary:", error)
        toast({
          title: "Error",
          description: "Failed to load order summary. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderSummary()
  }, [orderId, toast])

  const handleSendEmail = async () => {
    if (!summary) return

    setIsSendingEmail(true)
    try {
      // Call the server action to send the email
      const result = await generateEmailSummary({
        to: summary.customerEmail,
        subject: `Your Smiley Brooms Order Confirmation - #${summary.orderId}`,
        htmlContent: `
          <h1>Thank you for your order, ${summary.customerName}!</h1>
          <p>Your order #${summary.orderId} has been confirmed.</p>
          <p><strong>Service Address:</strong> ${summary.serviceAddress}</p>
          <p><strong>Service Date:</strong> ${summary.serviceDate}</p>
          <h2>Order Details:</h2>
          <ul>
            ${summary.items
              .map(
                (item) => `<li>${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}</li>`,
              )
              .join("")}
          </ul>
          <p><strong>Total Amount:</strong> ${formatCurrency(summary.totalAmount)}</p>
          <p><strong>Payment Method:</strong> ${summary.paymentMethod}</p>
          ${
            summary.specialInstructions
              ? `<p><strong>Special Instructions:</strong> ${summary.specialInstructions}</p>`
              : ""
          }
          <p>We look forward to providing you with a sparkling clean home!</p>
          <p>The Smiley Brooms Team</p>
        `,
      })

      if (result.success) {
        toast({
          title: "Email Sent!",
          description: `A summary has been sent to ${summary.customerEmail}.`,
          variant: "success",
        })
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email summary. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Email Failed",
        description: "An unexpected error occurred while sending the email.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleShare = () => {
    if (navigator.share && summary) {
      navigator
        .share({
          title: `Smiley Brooms Order #${summary.orderId}`,
          text: `Your cleaning service order #${summary.orderId} has been confirmed! Total: ${formatCurrency(
            summary.totalAmount,
          )}. Details: ${window.location.href}`,
          url: window.location.href,
        })
        .then(() => toast({ title: "Order Shared!", description: "The order summary has been shared." }))
        .catch((error) => console.error("Error sharing:", error))
    } else {
      toast({
        title: "Share Not Supported",
        description: "Your browser does not support the Web Share API.",
        variant: "info",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading order summary...</p>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Order Not Found</CardTitle>
            <CardDescription>We could not find details for this order.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/pricing">Back to Services</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <CardTitle className="mt-4 text-3xl font-bold text-green-700 dark:text-green-300">
              Order Confirmed!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              Thank you for your purchase. Your order #{summary.orderId} has been successfully placed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Customer & Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Customer Details</h3>
                <p>
                  <strong>Name:</strong> {summary.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {summary.customerEmail}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Service Details</h3>
                <p>
                  <strong>Address:</strong> {summary.serviceAddress}
                </p>
                <p>
                  <strong>Date:</strong> {summary.serviceDate}
                </p>
                <p>
                  <strong>Payment Method:</strong> {summary.paymentMethod}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Order Summary</h3>
              {summary.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.metadata?.rooms && <p className="text-sm text-gray-500">Rooms: {item.metadata.rooms}</p>}
                  </div>
                  <p>
                    {item.quantity} x {formatCurrency(item.price)} ={" "}
                    <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 text-xl font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(summary.totalAmount)}</span>
              </div>
            </div>

            {summary.specialInstructions && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Special Instructions</h3>
                  <p className="text-gray-700 dark:text-gray-300">{summary.specialInstructions}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={handleSendEmail} disabled={isSendingEmail} size="lg">
                {isSendingEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" /> Email My Summary
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleShare} size="lg">
                <Share2 className="h-4 w-4 mr-2" /> Share Order
              </Button>
              <Button variant="outline" onClick={handlePrint} size="lg">
                <Printer className="h-4 w-4 mr-2" /> Print Summary
              </Button>
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" /> Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
