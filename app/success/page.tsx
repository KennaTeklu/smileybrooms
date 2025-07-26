"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Phone, Download, RefreshCw, AlertCircle } from "lucide-react"
import { getContactInfo } from "@/lib/payment-config"

interface PaymentStatus {
  status: "loading" | "success" | "failed" | "contact_payment"
  sessionId?: string
  error?: string
  orderData?: any
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: "loading" })
  const [retryCount, setRetryCount] = useState(0)
  const contactInfo = getContactInfo()

  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("payment_type")

  useEffect(() => {
    if (paymentType === "contact") {
      setPaymentStatus({ status: "contact_payment" })
      return
    }

    if (!sessionId) {
      setPaymentStatus({
        status: "failed",
        error: "No payment session found. Please try again.",
      })
      return
    }

    verifyPayment()
  }, [sessionId, paymentType, retryCount])

  const verifyPayment = async () => {
    try {
      setPaymentStatus({ status: "loading" })

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.success && data.status === "complete") {
        setPaymentStatus({
          status: "success",
          sessionId,
          orderData: data.orderData,
        })

        // Send confirmation email
        try {
          await fetch("/api/send-confirmation-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              orderData: data.orderData,
            }),
          })
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError)
        }

        // Clear any stored cart data
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart")
          localStorage.removeItem("checkout-data")
        }
      } else {
        setPaymentStatus({
          status: "failed",
          error: data.error || "Payment verification failed. Please contact support.",
        })
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setPaymentStatus({
        status: "failed",
        error: "Unable to verify payment. Please check your connection and try again.",
      })
    }
  }

  const handleRetryVerification = () => {
    setRetryCount((prev) => prev + 1)
  }

  const handleContactDownload = () => {
    const contactData = `
SmileyBrooms Cleaning Service
Website: ${contactInfo.website}
Phone: ${contactInfo.phone}
Email: ${contactInfo.email}

Your booking is being processed. We'll contact you within 24 hours to confirm your appointment and payment details.

Available Payment Methods:
- Cash (in person)
- Zelle
- Phone payment
- Credit/Debit card over phone

Thank you for choosing SmileyBrooms!
    `.trim()

    const blob = new Blob([contactData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-booking-confirmation.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReturnHome = () => {
    window.location.href = "/"
  }

  if (paymentStatus.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <RefreshCw className="h-12 w-12 mx-auto animate-spin text-blue-500" />
              <h2 className="text-xl font-semibold">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus.status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription>Your booking has been confirmed and payment processed successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Confirmation email has been sent to your email address. We'll contact you within 24 hours to schedule
                your cleaning service.
              </AlertDescription>
            </Alert>

            {paymentStatus.orderData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Order ID:</strong> {paymentStatus.sessionId}
                  </p>
                  <p>
                    <strong>Service:</strong> House Cleaning
                  </p>
                  <p>
                    <strong>Status:</strong> Confirmed
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleReturnHome} className="flex-1">
                Return to Home
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="flex-1">
                Print Receipt
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Questions? Call us at {contactInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus.status === "contact_payment") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Phone className="h-16 w-16 mx-auto text-blue-500 mb-4" />
            <CardTitle className="text-2xl text-blue-700">Booking Received!</CardTitle>
            <CardDescription>We've received your booking request. Please call us to complete payment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Phone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Your booking is being processed. We'll contact you within 24 hours to confirm your appointment and
                arrange payment.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-lg font-medium">{contactInfo.phone}</p>
              <p className="text-sm text-gray-600">{contactInfo.website}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Available Payment Methods:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Cash (in person)</li>
                <li>• Zelle</li>
                <li>• Credit/Debit card over phone</li>
                <li>• Phone payment</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.open(`tel:${contactInfo.phone}`, "_self")}
                className="flex-1 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
              <Button
                variant="outline"
                onClick={handleContactDownload}
                className="flex-1 flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download Info
              </Button>
            </div>

            <div className="text-center">
              <Button variant="link" onClick={handleReturnHome}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Failed payment state
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <CardTitle className="text-2xl text-red-700">Payment Issue</CardTitle>
          <CardDescription>We encountered an issue processing your payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {paymentStatus.error || "Payment could not be verified. Please try again or contact support."}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold">What you can do:</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Try verifying your payment again</li>
              <li>• Check your bank account or card statement</li>
              <li>• Call us to complete payment over the phone</li>
              <li>• Return home and try booking again</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRetryVerification} className="flex-1 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Verification
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`tel:${contactInfo.phone}`, "_self")}
              className="flex-1 flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Support
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Call us for immediate assistance or to complete payment over the phone
              </p>
              <p className="font-medium">{contactInfo.phone}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleContactDownload}
                className="mt-2 flex items-center gap-2 mx-auto bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download Contact Info
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button variant="link" onClick={handleReturnHome}>
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
