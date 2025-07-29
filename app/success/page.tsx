"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Phone,
  Mail,
  Home,
  Download,
  ExternalLink,
  Clock,
  FileText,
  Send,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { sendOrderConfirmationEmail } from "@/lib/actions"
import { getContactInfo } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast" // Import useToast

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

interface ApplicationData {
  applicationId: string
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
type PageType = "order" | "application"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { toast } = useToast() // Declare useToast
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const contactInfo = getContactInfo()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("checking")

  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("type") // 'contact' or null (digital wallet)
  const applicationType = searchParams.get("type") // 'application'
  const pageType: PageType = paymentType === "contact" || paymentType === null ? "order" : "application"

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

    const loadApplicationData = async () => {
      try {
        const serviceApplicationData = localStorage.getItem("serviceApplication")
        if (serviceApplicationData) {
          const applicationData = JSON.parse(serviceApplicationData)
          setApplicationData(applicationData)

          // Send confirmation email for service applications
          try {
            await sendOrderConfirmationEmail(applicationData)
            setEmailSent(true)
          } catch (error) {
            console.error("Failed to send confirmation email:", error)
          }

          clearCart()
          localStorage.removeItem("serviceApplication")
        }
      } catch (error) {
        console.error("Error loading application data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Add a delay to ensure processing is complete
    const timer = setTimeout(
      () => {
        if (pageType === "order") {
          checkPaymentStatus()
        } else if (pageType === "application") {
          loadApplicationData()
        }
      },
      paymentType === "contact" ? 2000 : 1000,
    )

    return () => clearTimeout(timer)
  }, [sessionId, paymentType, clearCart])

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
  paymentType === "contact"
    ? `
Next Steps:
- We will call you at ${orderData.contact.phone} within 24 hours
- We'll confirm your booking and arrange payment
- Payment options: Cash, Zelle, or other arrangements

Contact Us:
Phone: ${contactInfo.phoneFormatted}
Website: ${contactInfo.website}
`
    : `
Status: Payment Completed
Your cleaning service has been booked!
`
}`

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

  const downloadApplicationSummary = () => {
    if (!applicationData) return

    const applicationSummary = `SmileyBrooms Service Application Confirmation
Application ID: ${applicationData.applicationId}
Date: ${new Date(applicationData.createdAt).toLocaleDateString()}

Customer Information:
${applicationData.contact.firstName} ${applicationData.contact.lastName}
${applicationData.contact.email}
${applicationData.contact.phone}

Service Location:
${applicationData.address.street}
${applicationData.address.apartment ? applicationData.address.apartment + "\n" : ""}${applicationData.address.city}, ${applicationData.address.state} ${applicationData.address.zipCode}

Requested Services:
${applicationData.items.map((item) => `- ${item.name} (${item.quantity}x) - Est. ${formatCurrency(item.price * item.quantity)}`).join("\n")}

Estimated Pricing:
Subtotal: ${formatCurrency(applicationData.pricing.subtotal)}
${applicationData.pricing.videoDiscount > 0 ? `Video Discount: -${formatCurrency(applicationData.pricing.videoDiscount)}\n` : ""}Tax: ${formatCurrency(applicationData.pricing.tax)}
Estimated Total: ${formatCurrency(applicationData.pricing.total)}

* This is an estimate. Final pricing will be provided in your personalized quote.

Application Status: Submitted - Under Review

Next Steps:
- We will review your application within 24 hours
- You'll receive a personalized quote via email, text, or phone call
- We'll schedule a convenient time for your service
- Payment will be processed after service confirmation
- You'll receive an invoice with final pricing and payment options

Contact Us:
Phone: ${contactInfo.phoneFormatted}
Website: ${contactInfo.website}

Thank you for choosing SmileyBrooms!
We look forward to serving you.`

    const blob = new Blob([applicationSummary], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `smileybrooms-application-${applicationData?.applicationId || "submitted"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Application Summary Downloaded! 📄",
      description: "Your application details have been saved to your device.",
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
  if (
    pageType === "order" &&
    paymentType !== "contact" &&
    paymentType !== null &&
    (!orderData || paymentStatus === "failed")
  ) {
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
                  <Button onClick={() => {}} variant="outline">
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
        {pageType === "order" && (
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
              {paymentType === "contact" ? "Order Submitted Successfully!" : "Payment Successful!"}
            </h1>
            <p className="text-lg text-muted-foreground">Order #{orderData?.orderId || "PENDING"}</p>
            {emailSent && <p className="text-sm text-green-600 mt-2">✓ Confirmation email sent</p>}
          </motion.div>
        )}

        {pageType === "application" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-muted-foreground">Application #{applicationData?.applicationId || "PENDING"}</p>
            {emailSent && <p className="text-sm text-green-600 mt-2">✓ Confirmation email sent</p>}
          </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Status */}
          {pageType === "order" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {paymentType === "contact" ? <Phone className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    {paymentType === "contact" ? "Next Steps" : "Order Status"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentType === "contact" ? (
                    <>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">We'll contact you soon!</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• We will call you at {orderData?.contact.phone} within 24 hours</li>
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
          )}

          {/* Application Status */}
          {pageType === "application" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    What Happens Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      We're reviewing your request!
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• We'll review your application within 24 hours</li>
                      <li>• You'll receive a personalized quote via email, text, or phone</li>
                      <li>• We'll schedule a convenient time for your service</li>
                      <li>• Payment will be processed after service confirmation</li>
                      <li>• You'll receive an invoice with final pricing</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={callNow} className="flex-1 bg-green-600 hover:bg-green-700">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Us Now
                    </Button>
                    <Button onClick={downloadApplicationSummary} variant="outline" className="flex-1 bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Download Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

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
                  {pageType === "order" ? "Your Information" : "Contact Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pageType === "order" && orderData && (
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

                {pageType === "application" && applicationData && (
                  <>
                    <div>
                      <p className="font-medium">
                        {applicationData.contact.firstName} {applicationData.contact.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{applicationData.contact.email}</p>
                      <p className="text-sm text-muted-foreground">{applicationData.contact.phone}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Service Location
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {applicationData.address.street}
                        {applicationData.address.apartment && `, ${applicationData.address.apartment}`}
                        <br />
                        {applicationData.address.city}, {applicationData.address.state}{" "}
                        {applicationData.address.zipCode}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary */}
        {pageType === "order" && orderData && orderData.items.length > 0 && (
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

        {/* Application Summary */}
        {pageType === "application" && applicationData && applicationData.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requested Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicationData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">Service Request</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.quantity} × {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Est. {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Estimated Subtotal</span>
                    <span>{formatCurrency(applicationData.pricing.subtotal)}</span>
                  </div>
                  {applicationData.pricing.videoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Video Recording Discount</span>
                      <span>-{formatCurrency(applicationData.pricing.videoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>{formatCurrency(applicationData.pricing.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Estimated Total</span>
                    <span>{formatCurrency(applicationData.pricing.total)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    * This is an estimate. Final pricing will be provided in your personalized quote.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Important Notice */}
        {pageType === "application" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Important: This is a Service Application
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• No payment has been processed yet</li>
                      <li>• We'll provide a personalized quote based on your specific needs</li>
                      <li>• Payment will be arranged after we confirm your service details</li>
                      <li>• You can modify or cancel your request at any time before confirmation</li>
                    </ul>
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
          transition={{ duration: 0.5, delay: 0.5 }}
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
