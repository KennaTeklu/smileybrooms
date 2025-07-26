"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Phone, Mail, Home, Download, ExternalLink, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { sendOrderConfirmationEmail } from "@/lib/actions"
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

type PaymentStatus = "checking" | "success" | "failed" | "contact"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("checking")
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const contactInfo = getContactInfo()

  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("type") // 'contact' or null (digital wallet)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // If it's a contact payment, handle immediately
        if (paymentType === "contact") {
          setPaymentStatus("contact")
          await loadContactOrderData()
          return
        }

        // For digital wallet payments, check Stripe session
        if (sessionId) {
          // Wait for payment confirmation from Stripe
          const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
          const result = await response.json()

          if (result.success && result.payment_status === "paid") {
            setPaymentStatus("success")
            await loadDigitalWalletOrderData(result)
          } else {
            setPaymentStatus("failed")
            setErrorMessage(result.error || "Payment verification failed")
          }
        } else {
          // No session ID means payment didn't complete properly
          setPaymentStatus("failed")
          setErrorMessage("Payment session not found. The payment may not have completed successfully.")
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
        setPaymentStatus("failed")
        setErrorMessage("Unable to verify payment status. Please contact support.")
      } finally {
        setIsLoading(false)
      }
    }

    // Add a delay to ensure payment processing is complete
    const timer = setTimeout(() => {
      checkPaymentStatus()
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId, paymentType])

  const loadContactOrderData = async () => {
    try {
      const pendingOrderData = localStorage.getItem("pendingOrder")
      if (pendingOrderData) {
        const orderData = JSON.parse(pendingOrderData)
        setOrderData(orderData)

        // Send confirmation email for contact orders
        try {
          await sendOrderConfirmationEmail(orderData)
          setEmailSent(true)
        } catch (error) {
          console.error("Failed to send confirmation email:", error)
        }

        clearCart()
        localStorage.removeItem("pendingOrder")
      }
    } catch (error) {
      console.error("Error loading contact order data:", error)
    }
  }

  const loadDigitalWalletOrderData = async (paymentResult: any) => {
    try {
      const orderConfirmationData = localStorage.getItem("orderConfirmation")
      if (orderConfirmationData) {
        const orderData = JSON.parse(orderConfirmationData)

        // Update order data with payment information
        orderData.payment.stripeSessionId = sessionId
        orderData.payment.paymentStatus = "completed"
        orderData.status = "completed"

        setOrderData(orderData)

        // Send confirmation email
        try {
          await sendOrderConfirmationEmail(orderData)
          setEmailSent(true)
        } catch (error) {
          console.error("Failed to send confirmation email:", error)
        }

        clearCart()
        localStorage.removeItem("orderConfirmation")
      }
    } catch (error) {
      console.error("Error loading digital wallet order data:", error)
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
${orderData.address.street}
${orderData.address.city}, ${orderData.address.state} ${orderData.address.zipCode}

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
  paymentStatus === "contact"
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
Status: Payment Failed
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
    a.download = `smileybrooms-order-${orderData?.orderId || "failed"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Order Summary Downloaded! 📄",
      description: "Your order details have been saved to your device.",
      variant: "default",
    })
  }

  const downloadContactInfo = () => {
    const contactSummary = `SmileyBrooms Contact Information

Website: ${contactInfo.website}
Phone: ${contactInfo.phoneFormatted}

Payment Options Available:
- Cash payment when we arrive
- Zelle payment (we'll provide instructions)
- Other payment arrangements

How to Book:
1. Call us at ${contactInfo.phoneFormatted}
2. We'll discuss your cleaning needs
3. We'll schedule your service
4. We'll arrange payment method

Business Hours:
Monday - Friday: 8:00 AM - 6:00 PM
Saturday: 9:00 AM - 4:00 PM
Sunday: Closed

Thank you for choosing SmileyBrooms!
We look forward to serving you.`

    const blob = new Blob([contactSummary], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-contact-info.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Contact Info Downloaded! 📞",
      description: "Our contact information has been saved to your device.",
      variant: "default",
    })
  }

  const callNow = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Verifying Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment status</p>
        </motion.div>
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
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Issue Detected</h1>
            <p className="text-lg text-muted-foreground mb-4">We encountered a problem processing your payment</p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">What happened?</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {errorMessage ||
                      "Your payment did not complete successfully. This could be due to insufficient funds, network issues, or payment method restrictions."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Let's Get You Booked!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Don't worry - we can help you complete your booking!
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Call us and we'll book your service over the phone</li>
                    <li>• We accept cash payment when we arrive</li>
                    <li>• We can provide Zelle payment instructions</li>
                    <li>• Same great service, just a different payment method</li>
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button onClick={callNow} className="bg-green-600 hover:bg-green-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Call {contactInfo.phoneFormatted}
                  </Button>
                  <Button onClick={downloadContactInfo} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Contact Info
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Or try booking online again</p>
                  <Link href="/checkout">
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Return to Checkout
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Questions? Call us at {contactInfo.phoneFormatted} or visit {contactInfo.website}
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Success states (contact or completed payment)
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
            {paymentStatus === "contact" ? "Order Submitted Successfully!" : "Payment Successful!"}
          </h1>
          <p className="text-lg text-muted-foreground">Order #{orderData?.orderId || "PENDING"}</p>
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
                  {paymentStatus === "contact" ? <Phone className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                  {paymentStatus === "contact" ? "Next Steps" : "Order Status"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentStatus === "contact" ? (
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
                        {orderData.address.street}
                        {orderData.address.apartment && `, ${orderData.address.apartment}`}
                        <br />
                        {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}
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
