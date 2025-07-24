"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Phone, Download, RefreshCw, Loader2 } from "lucide-react"
import { getContactInfo } from "@/lib/payment-config"

type PaymentStatus = "verifying" | "success" | "failed" | "error"

interface PaymentVerificationResult {
  success: boolean
  status?: string
  error?: string
  sessionId?: string
  customerEmail?: string
  amount?: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("verifying")
  const [paymentData, setPaymentData] = useState<PaymentVerificationResult | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const contactInfo = getContactInfo()

  const verifyPayment = async () => {
    if (!sessionId) {
      setPaymentStatus("error")
      setPaymentData({ success: false, error: "No payment session found" })
      return
    }

    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      const result: PaymentVerificationResult = await response.json()
      setPaymentData(result)

      if (result.success && result.status === "complete") {
        setPaymentStatus("success")
        // Send confirmation email
        if (result.customerEmail && !emailSent) {
          sendConfirmationEmail(result)
        }
      } else if (result.status === "open" || result.status === "expired") {
        setPaymentStatus("failed")
      } else {
        setPaymentStatus("error")
      }
    } catch (error) {
      console.error("Payment verification failed:", error)
      setPaymentStatus("error")
      setPaymentData({ success: false, error: "Failed to verify payment" })
    }
  }

  const sendConfirmationEmail = async (data: PaymentVerificationResult) => {
    try {
      await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.customerEmail,
          sessionId: data.sessionId,
          amount: data.amount,
        }),
      })
      setEmailSent(true)
    } catch (error) {
      console.error("Failed to send confirmation email:", error)
    }
  }

  const handleRetryVerification = async () => {
    setIsRetrying(true)
    setPaymentStatus("verifying")
    await verifyPayment()
    setIsRetrying(false)
  }

  const downloadContactInfo = () => {
    const contactData = `
SmileyBrooms Contact Information
Website: ${contactInfo.website}
Phone: ${contactInfo.phoneFormatted}

For assistance with:
- Cash payments
- Zelle transfers
- Payment issues
- Booking questions

Call us during business hours for immediate assistance.
    `.trim()

    const blob = new Blob([contactData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-contact.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const callNow = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  useEffect(() => {
    verifyPayment()
  }, [sessionId])

  if (paymentStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <h2 className="text-xl font-semibold">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <CardDescription>Your cleaning service has been booked successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Confirmation email sent to your inbox</li>
                <li>• We'll contact you to schedule your service</li>
                <li>• Expect a call within 24 hours</li>
              </ul>
            </div>

            {paymentData?.amount && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600">
                  Amount paid: <span className="font-semibold">${(paymentData.amount / 100).toFixed(2)}</span>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={downloadContactInfo} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={callNow} className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "failed" || paymentStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-red-800">Payment Issue</CardTitle>
            <CardDescription>
              {paymentStatus === "failed"
                ? "Your payment was not completed successfully."
                : "We encountered an issue verifying your payment."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">What happened?</h3>
              <p className="text-sm text-red-700">
                {paymentData?.error || "The payment process was interrupted or failed to complete."}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">No worries! We can help:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Call us to complete your booking over the phone</li>
                <li>• Pay with cash, Zelle, or card over the phone</li>
                <li>• Get immediate assistance with your order</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleRetryVerification}
                variant="outline"
                className="w-full bg-transparent"
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Payment Again
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button onClick={callNow} className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {contactInfo.phoneFormatted}
                </Button>
                <Button onClick={downloadContactInfo} variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Get Contact Info
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Available for cash, Zelle, and phone payments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
