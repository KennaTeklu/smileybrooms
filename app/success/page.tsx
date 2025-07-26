"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Phone, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { getContactInfo } from "@/lib/payment-config" // Ensure this is correctly imported
import { toast } from "@/components/ui/use-toast"

type PaymentStatus = "verifying" | "success" | "failed" | "error"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const paymentType = searchParams.get("payment_type") // 'digital_wallet' or 'contact'
  const [status, setStatus] = useState<PaymentStatus>("verifying")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const { phoneFormatted, website } = getContactInfo()

  const handleDownloadContact = useCallback(() => {
    const contactContent = `Company: ${website}\nPhone: ${phoneFormatted}\n`
    const blob = new Blob([contactContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms_contact.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Contact Info Downloaded!",
      description: "You can find our contact details in your downloads.",
    })
  }, [phoneFormatted, website])

  const handleDownloadReceipt = useCallback(() => {
    // In a real application, you would fetch the receipt from your backend
    // For this example, we'll simulate a simple receipt
    const receiptContent = `
      SmileyBrooms.com - Order Receipt
      ---------------------------------
      Order ID: ${orderId || "N/A"}
      Payment Status: ${status === "success" ? "Paid" : "Pending/Failed"}
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}

      Thank you for your business!
      ---------------------------------
      For support, call us at ${phoneFormatted}
    `
    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `smileybrooms_receipt_${orderId || "unknown"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Receipt Downloaded!",
      description: "Your order receipt is in your downloads.",
    })
  }, [orderId, status, phoneFormatted])

  const verifyPayment = useCallback(async () => {
    if (paymentType === "contact") {
      setStatus("success")
      setOrderId("CONTACT-BOOKING-" + Date.now()) // Simulate an order ID for contact bookings
      toast({
        title: "Booking Received!",
        description: "We've received your booking request. We'll contact you shortly.",
        variant: "success",
      })
      return
    }

    if (!sessionId) {
      setStatus("error")
      setErrorMessage("No payment session ID found.")
      toast({
        title: "Payment Error",
        description: "No payment session ID was provided. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (response.ok && data.status === "paid") {
        setStatus("success")
        setOrderId(data.orderId || "STRIPE-" + sessionId.substring(0, 8))
        toast({
          title: "Payment Successful!",
          description: "Your payment has been confirmed and your booking is complete.",
          variant: "success",
        })

        // Optionally send confirmation email
        await fetch("/api/send-confirmation-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            customerEmail: data.customerEmail,
            amount: data.amount,
          }),
        })
      } else {
        setStatus("failed")
        setErrorMessage(data.message || "Payment could not be verified. Please try again.")
        toast({
          title: "Payment Failed",
          description: data.message || "Your payment could not be verified.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setStatus("error")
      setErrorMessage("An unexpected error occurred during payment verification.")
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
      })
    }
  }, [sessionId, paymentType])

  useEffect(() => {
    verifyPayment()
  }, [verifyPayment])

  const renderContent = () => {
    if (status === "verifying") {
      return (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          <CardTitle className="text-2xl font-bold">Verifying your payment...</CardTitle>
          <CardDescription>Please do not close this page.</CardDescription>
        </div>
      )
    } else if (status === "success") {
      return (
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl font-bold">
            {paymentType === "contact" ? "Booking Confirmed!" : "Payment Successful!"}
          </CardTitle>
          <CardDescription className="text-center">
            {paymentType === "contact"
              ? "Thank you for your booking! We will contact you shortly to confirm details and arrange payment."
              : `Your payment has been successfully processed. Your order ID is: ${orderId}. A confirmation email has been sent.`}
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {paymentType !== "contact" && (
              <Button onClick={handleDownloadReceipt} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </Button>
            )}
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full sm:w-auto">
              Go to Homepage
            </Button>
          </div>
        </div>
      )
    } else if (status === "failed" || status === "error") {
      return (
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <CardTitle className="text-2xl font-bold">Payment Failed</CardTitle>
          <CardDescription className="text-center">
            {errorMessage || "There was an issue processing your payment. Please try again."}
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={() => verifyPayment()} className="w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4" /> Retry Verification
            </Button>
            <Button onClick={() => (window.location.href = "/checkout")} className="w-full sm:w-auto">
              Retry Payment
            </Button>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold">Need assistance?</p>
            <p className="text-muted-foreground">If you continue to experience issues, please contact us directly.</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button variant="outline" onClick={() => window.open(`tel:${phoneFormatted.replace(/\D/g, "")}`)}>
                <Phone className="mr-2 h-4 w-4" /> Call Us: {phoneFormatted}
              </Button>
              <Button variant="outline" onClick={handleDownloadContact}>
                <Download className="mr-2 h-4 w-4" /> Download Contact Info
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">We also accept Zelle or cash payments over the phone.</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl p-6 text-center shadow-lg">
        <CardContent className="flex flex-col items-center justify-center">{renderContent()}</CardContent>
      </Card>
    </div>
  )
}
