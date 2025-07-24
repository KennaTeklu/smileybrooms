"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Phone, Mail, Home, Download, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { getContactInfo } from "@/lib/payment-config"

interface OrderData {
  orderId: string
  items: any[]
  contact: any
  address: any
  payment: any
  pricing: {
    subtotal: number
    videoDiscount: number
    tax: number
    total: number
  }
  status: string
  createdAt: string
}

type PaymentStatus = "loading" | "success" | "failed" | "contact_pending"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [emailSent, setEmailSent] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const contactInfo = getContactInfo()

  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("type") // 'contact' or null (digital wallet)

  useEffect(() => {
    const verifyPaymentAndLoadOrder = async () => {
      try {
        // Handle contact payments (no Stripe verification needed)
        if (paymentType === "contact") {
          const pendingOrderData = localStorage.getItem("pendingOrder")
          if (pendingOrderData) {
            const parsedData = JSON.parse(pendingOrderData)
            setOrderData(parsedData)
            setPaymentStatus("contact_pending")
            clearCart()
            localStorage.removeItem("pendingOrder")
          } else {
            setPaymentStatus("failed")
            setErrorMessage("Order information not found. Please try booking again.")
          }
          return
        }

        // Handle digital wallet payments - verify with Stripe
        if (sessionId) {
          try {
            // Verify payment with Stripe
            const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
            const result = await response.json()

            if (result.success && result.payment_status === "paid") {
              // Payment successful
              const orderConfirmationData = localStorage.getItem("orderConfirmation")
              if (orderConfirmationData) {
                const parsedData = JSON.parse(orderConfirmationData)
                setOrderData(parsedData)
                setPaymentStatus("success")

                // Send confirmation email
                try {
                  await sendOrderConfirmationEmail(parsedData)
                  setEmailSent(true)
                } catch (emailError) {
                  console.error("Failed to send confirmation email:", emailError)
                }

                clearCart()
                localStorage.removeItem("orderConfirmation")
              } else {
                // Create fallback order data from Stripe session
                const fallbackData: OrderData = {
                  orderId: result.session_id || `ORDER-${Date.now()}`,
                  items: result.line_items || [],
                  contact: {
                    firstName: result.customer_details?.name?.split(" ")[0] || "Customer",
                    lastName: result.customer_details?.name?.split(" ").slice(1).join(" ") || "",
                    email: result.customer_details?.email || "",
                    phone: result.customer_details?.phone || "",
                  },
                  address: result.customer_details?.address || {},
                  payment: {
                    paymentMethod: result.payment_method_types?.[0] || "card",
                    allowVideoRecording: result.metadata?.wants_live_video === "true",
                  },
                  pricing: {
                    subtotal: (result.amount_total || 0) / 100,
                    videoDiscount: 0,
                    tax: (result.amount_tax || 0) / 100,
                    total: (result.amount_total || 0) / 100,
                  },
                  status: "completed",
                  createdAt: new Date().toISOString(),
                }
                setOrderData(fallbackData)
                setPaymentStatus("success")
                clearCart()
              }
            } else {
              // Payment failed or incomplete
              setPaymentStatus("failed")
              setErrorMessage(
                result.payment_status === "unpaid"
                  ? "Payment was not completed. Your card may have been declined or the payment was cancelled."
                  : result.error || "Payment verification failed. Please check your payment method and try again.",
              )
            }
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError)
            setPaymentStatus("failed")
            setErrorMessage("Unable to verify payment status. This may be a temporary issue.")
          }
        } else {
          // No session ID provided
          setPaymentStatus("failed")
          setErrorMessage("No payment session found. The payment may not have been initiated properly.")
        }
      } catch (error) {
        console.error("Error loading order:", error)
        setPaymentStatus("failed")
        setErrorMessage("An unexpected error occurred while processing your order.")
      }
    }

    verifyPaymentAndLoadOrder()
  }, [sessionId, paymentType, clearCart, retryCount])

  const sendOrderConfirmationEmail = async (orderData: OrderData) => {
    const response = await fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error("Failed to send confirmation email")
    }
  }

  const downloadOrderSummary = () => {
    if (!orderData) return

    const orderSummary = `SmileyBrooms Order Confirmation
Order ID: ${orderData.orderId}
Date: ${new Date(orderData.createdAt).toLocaleDateString()}

Customer Information:
${orderData.contact.firstName} ${orderData.contact.lastName}
${orderData.contact.email}
${orderData.contact.phone}

Service Address:
${orderData.address.street || orderData.address.line1 || ""}
${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode || orderData.address.postal_code || ""}

Order Items:
${orderData.items.map((item) => `- ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}`).join("\n")}

Pricing:
Subtotal: ${formatCurrency(orderData.pricing.subtotal)}
${orderData.pricing.videoDiscount > 0 ? `Video Discount: -${formatCurrency(orderData.pricing.videoDiscount)}\n` : ""}Tax: ${formatCurrency(orderData.pricing.tax)}
Total: ${formatCurrency(orderData.pricing.total)}

Payment Method: ${
      orderData.payment.paymentMethod === "contact_for_alternatives"
        ? "Call for Payment Options"
        : orderData.payment.paymentMethod === "apple_pay"
          ? "Apple Pay"
          : "Google Pay"
    }

${
  paymentStatus === "contact_pending"
    ? `
Next Steps:
- We will call you at ${orderData.contact.phone} within 24 hours
- We'll confirm your booking and arrange payment
- Payment options: Cash, Zelle, or other arrangements

Contact Us:
Phone: ${contactInfo.phoneFormatted}
Website: ${contactInfo.website}
`
    : paymentStatus === "success"
      ? `
Status: Payment Completed
Your cleaning service has been booked!
`
      : `
Status: Payment Issue
Please contact us to complete your booking.

Contact Us:
Phone: ${contactInfo.phoneFormatted}
Website: ${contactInfo.website}
`
}

Thank you for choosing SmileyBrooms!`

    const blob = new Blob([orderSummary], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `smileybrooms-${paymentStatus === "failed" ? "booking-issue" : "order"}-${orderData.orderId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Contact Info Downloaded! 📄",
      description: "Your booking details and our contact information have been saved to your device.",
      variant: "default",
    })
  }

  const callNow = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  const retryPaymentVerification = () => {
    setPaymentStatus("loading")
    setRetryCount((prev) => prev + 1)
  }

  // Loading state
  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment with {sessionId ? "your payment provider" : "our system"}.
            </p>
            <p className="text-sm text-muted-foreground mt-2">This usually takes just a few seconds.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment failed state
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Issue</h1>
            <p className="text-lg text-muted-foreground mb-4">We encountered a problem processing your payment</p>
          </motion.div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                What happened?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Don't worry - we're here to help!</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your booking information is safe. We can complete your booking over the phone with alternative payment
                  options.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call Us Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Speak with our team to complete your booking with:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Cash payment when we arrive</li>
                  <li>• Zelle payment instructions</li>
                  <li>• Credit card over the phone</li>
                  <li>• Other payment arrangements</li>
                </ul>
                <Button onClick={callNow} className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Call {contactInfo.phoneFormatted}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Get Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Download our contact information and booking details:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Phone: {contactInfo.phoneFormatted}</li>
                  <li>• Website: {contactInfo.website}</li>
                  <li>• Your booking details</li>
                  <li>• Available payment options</li>
                </ul>
                <Button onClick={downloadOrderSummary} variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Contact Info
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={retryPaymentVerification} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Payment Again
              </Button>
              <Link href="/checkout">
                <Button variant="outline">Try Payment Again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Need immediate help? Call us at {contactInfo.phoneFormatted}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success states (both contact_pending and success)
  const isContactPayment = paymentStatus === "contact_pending"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isContactPayment ? "Booking Submitted Successfully!" : "Payment Successful!"}
          </h1>
          <p className="text-lg text-muted-foreground">Order #{orderData?.orderId}</p>
          {emailSent && <p className="text-sm text-green-600 mt-2">✓ Confirmation email sent</p>}
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isContactPayment ? <Phone className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                  {isContactPayment ? "Next Steps" : "Order Status"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isContactPayment ? (
                  <>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">We'll contact you soon!</h4>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• We'll call you at {orderData?.contact.phone} within 24 hours</li>
                        <li>• We'll confirm your booking details and schedule</li>
                        <li>• We'll arrange payment (cash, Zelle, or other options)</li>
                        <li>• Your service will be confirmed once payment is arranged</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={callNow} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us Now
                      </Button>
                      <Button onClick={downloadOrderSummary} variant="outline" className="flex-1 bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Download Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        Payment Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your cleaning service has been booked and payment has been processed successfully.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={downloadOrderSummary} className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                      <Button onClick={callNow} variant="outline" className="flex-1 bg-transparent">
                        <Phone className="mr-2 h-4 w-4" />
                        Contact Us
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderData && (
                  <>
                    <div>
                      <p className="font-medium">
                        {orderData.contact.firstName} {orderData.contact.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{orderData.contact.email}</p>
                      <p className="text-sm text-muted-foreground">{orderData.contact.phone}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Service Address
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {orderData.address.street || orderData.address.line1}
                        {orderData.address.apartment && `, ${orderData.address.apartment}`}
                        <br />
                        {orderData.address.city}, {orderData.address.state}{" "}
                        {orderData.address.zipCode || orderData.address.postal_code}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary */}
        {orderData && orderData.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{item.category}</Badge>
                        {item.paymentType === "pay_in_person" && <Badge variant="outline">Pay in Person</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.quantity} × {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderData.pricing.subtotal)}</span>
                  </div>
                  {orderData.pricing.videoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Video Recording Discount</span>
                      <span>-{formatCurrency(orderData.pricing.videoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(orderData.pricing.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(orderData.pricing.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg">
                <ExternalLink className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Questions? Call us at {contactInfo.phoneFormatted} or visit {contactInfo.website}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
