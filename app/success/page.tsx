"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Phone, Download, RefreshCw, Loader2 } from "lucide-react"
import { CONTACT_INFO } from "@/lib/location-data"

type PaymentStatus = "loading" | "success" | "failed" | "contact_payment"

interface OrderData {
  orderId: string
  amount: number
  customerEmail: string
  customerName: string
  paymentMethod: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>("loading")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  const sessionId = searchParams.get("session_id")
  const paymentMethod = searchParams.get("payment_method")
  const isContactPayment = paymentMethod === "contact_payment"

  useEffect(() => {
    if (isContactPayment) {
      handleContactPayment()
    } else if (sessionId) {
      verifyPayment()
    } else {
      setStatus("failed")
      setError("No payment information found")
    }
  }, [sessionId, isContactPayment])

  const handleContactPayment = () => {
    try {
      const savedOrderData = localStorage.getItem("pendingOrder")
      if (savedOrderData) {
        const orderInfo = JSON.parse(savedOrderData)
        setOrderData({
          orderId: `CONTACT-${Date.now()}`,
          amount: orderInfo.total || 0,
          customerEmail: orderInfo.email || "",
          customerName: `${orderInfo.firstName || ""} ${orderInfo.lastName || ""}`.trim(),
          paymentMethod: "Contact Payment",
        })
        setStatus("contact_payment")

        // Send confirmation email for contact payment
        sendConfirmationEmail({
          orderId: `CONTACT-${Date.now()}`,
          customerEmail: orderInfo.email || "",
          customerName: `${orderInfo.firstName || ""} ${orderInfo.lastName || ""}`.trim(),
          paymentMethod: "Contact Payment",
          amount: orderInfo.total || 0,
        })
      } else {
        setStatus("contact_payment")
        setOrderData({
          orderId: `CONTACT-${Date.now()}`,
          amount: 0,
          customerEmail: "",
          customerName: "Customer",
          paymentMethod: "Contact Payment",
        })
      }
    } catch (error) {
      console.error("Error handling contact payment:", error)
      setStatus("contact_payment")
    }
  }

  const verifyPayment = async () => {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.success && data.session) {
        setOrderData({
          orderId: data.session.id,
          amount: data.session.amount_total / 100,
          customerEmail: data.session.customer_details?.email || "",
          customerName: data.session.customer_details?.name || "",
          paymentMethod: data.session.payment_method_types?.[0] || "card",
        })
        setStatus("success")

        // Send confirmation email
        await sendConfirmationEmail({
          orderId: data.session.id,
          customerEmail: data.session.customer_details?.email || "",
          customerName: data.session.customer_details?.name || "",
          paymentMethod: data.session.payment_method_types?.[0] || "card",
          amount: data.session.amount_total / 100,
        })

        // Clear any pending order data
        localStorage.removeItem("pendingOrder")
      } else {
        setStatus("failed")
        setError(data.error || "Payment verification failed")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setStatus("failed")
      setError("Unable to verify payment. Please contact support.")
    }
  }

  const sendConfirmationEmail = async (emailData: any) => {
    try {
      await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })
    } catch (error) {
      console.error("Error sending confirmation email:", error)
    }
  }

  const handleRetryVerification = () => {
    setRetryCount((prev) => prev + 1)
    setStatus("loading")
    setError("")
    verifyPayment()
  }

  const downloadContactInfo = () => {
    const contactData = `
SmileyBrooms Contact Information
Website: ${CONTACT_INFO.website}
Phone: ${CONTACT_INFO.displayPhone}

Order ID: ${orderData?.orderId || "N/A"}
Customer: ${orderData?.customerName || "N/A"}
Email: ${orderData?.customerEmail || "N/A"}

Please call us to complete your payment using:
- Cash
- Zelle
- Other payment methods

Thank you for choosing SmileyBrooms!
    `.trim()

    const blob = new Blob([contactData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-contact-info.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </AlertDescription>
            </Alert>

            {orderData && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Order ID:</strong> {orderData.orderId}
                </p>
                <p>
                  <strong>Amount:</strong> ${orderData.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Payment Method:</strong> {orderData.paymentMethod}
                </p>
                <p>
                  <strong>Customer:</strong> {orderData.customerName}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button className="w-full" onClick={() => (window.location.href = "/")}>
                Return to Home
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "contact_payment") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Phone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-blue-600">Contact Payment Selected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Phone className="h-4 w-4" />
              <AlertDescription>
                Your booking request has been received. Please call us to complete payment.
              </AlertDescription>
            </Alert>

            {orderData && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Order ID:</strong> {orderData.orderId}
                </p>
                <p>
                  <strong>Customer:</strong> {orderData.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {orderData.customerEmail}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full flex items-center gap-2"
                onClick={() => window.open(`tel:${CONTACT_INFO.phone}`, "_self")}
              >
                <Phone className="h-4 w-4" />
                Call {CONTACT_INFO.displayPhone}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
                onClick={downloadContactInfo}
              >
                <Download className="h-4 w-4" />
                Download Contact Info
              </Button>
            </div>

            <div className="text-sm text-gray-600 text-center">
              <p>Available payment methods over the phone:</p>
              <p>• Cash • Zelle • Other options</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Failed status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-600">Payment Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Payment verification failed. Please try again or contact support."}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {sessionId && retryCount < 3 && (
              <Button className="w-full flex items-center gap-2" onClick={handleRetryVerification}>
                <RefreshCw className="h-4 w-4" />
                Retry Verification
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full flex items-center gap-2 bg-transparent"
              onClick={() => window.open(`tel:${CONTACT_INFO.phone}`, "_self")}
            >
              <Phone className="h-4 w-4" />
              Call Support {CONTACT_INFO.displayPhone}
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2 bg-transparent"
              onClick={downloadContactInfo}
            >
              <Download className="h-4 w-4" />
              Download Contact Info
            </Button>
          </div>

          <div className="text-sm text-gray-600 text-center">
            <p>Need help? Call us for assistance with:</p>
            <p>• Payment issues • Booking questions • Alternative payment methods</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
