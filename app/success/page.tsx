"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Phone, Mail, Home, Loader2 } from "lucide-react"
import { getContactInfo } from "@/lib/payment-config"

interface PaymentVerification {
  success: boolean
  paymentIntentId?: string
  amount?: number
  currency?: string
  customerEmail?: string
  error?: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [verification, setVerification] = useState<PaymentVerification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)

  const paymentIntentId = searchParams.get("payment_intent")
  const contactInfo = getContactInfo()

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntentId) {
        setVerification({
          success: false,
          error: "No payment information found",
        })
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId }),
        })

        const result = await response.json()
        setVerification(result)

        // Send confirmation email if payment was successful
        if (result.success && result.customerEmail) {
          try {
            await fetch("/api/send-confirmation-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: result.customerEmail,
                paymentIntentId: result.paymentIntentId,
                amount: result.amount,
              }),
            })
            setEmailSent(true)
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError)
          }
        }
      } catch (error) {
        console.error("Payment verification failed:", error)
        setVerification({
          success: false,
          error: "Failed to verify payment",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [paymentIntentId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Verifying your payment...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we confirm your booking</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!verification || !verification.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-600">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {verification?.error || "We couldn't verify your payment. Please contact us for assistance."}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Don't worry! If you were charged, we'll help resolve this quickly.
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.open(`tel:${contactInfo.phone}`, "_self")}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call {contactInfo.displayPhone}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${contactInfo.email}`, "_self")}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your payment has been processed successfully and your cleaning service has been booked.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Payment ID:</span> {verification.paymentIntentId}
                </p>
                <p>
                  <span className="text-gray-600">Amount:</span> ${((verification.amount || 0) / 100).toFixed(2)}{" "}
                  {verification.currency?.toUpperCase()}
                </p>
                {verification.customerEmail && (
                  <p>
                    <span className="text-gray-600">Email:</span> {verification.customerEmail}
                  </p>
                )}
              </div>
            </div>

            {emailSent && (
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  A confirmation email has been sent to {verification.customerEmail}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">What's Next?</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• We'll contact you within 24 hours to schedule your service</li>
                <li>• You'll receive a confirmation email with all the details</li>
                <li>• Our team will arrive at your scheduled time</li>
                <li>• Enjoy your sparkling clean space!</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => (window.location.href = "/")} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Questions about your booking?</p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${contactInfo.phone}`, "_self")}
                  className="flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {contactInfo.displayPhone}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${contactInfo.email}`, "_self")}
                  className="flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
