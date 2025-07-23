"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Home, Mail } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { sendOrderConfirmationEmail } from "@/lib/email-actions" // Import the new server action

export default function SuccessPage() {
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [emailSent, setEmailSent] = useState(false)
  const [wantsLiveVideo, setWantsLiveVideo] = useState(false)

  useEffect(() => {
    // Clear cart and local storage data after successful checkout
    clearCart()
    localStorage.removeItem("checkout-contact")
    localStorage.removeItem("checkout-address")
    localStorage.removeItem("checkout-payment")

    // Attempt to send order confirmation email
    const sendEmail = async () => {
      // Retrieve order details from a more persistent source if available,
      // or reconstruct from local storage if it hasn't been cleared yet.
      // For this example, we'll use placeholder data or assume it's passed via query params
      // in a real scenario, you'd fetch this from your backend after Stripe webhook.
      const contactData = JSON.parse(localStorage.getItem("checkout-contact") || "{}")
      const addressData = JSON.parse(localStorage.getItem("checkout-address") || "{}")
      const paymentData = JSON.parse(localStorage.getItem("checkout-payment") || "{}")
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]") // Assuming cart items might still be in local storage before clearCart()

      // Set wantsLiveVideo state based on paymentData
      setWantsLiveVideo(!!paymentData.allowVideoRecording)

      const orderDetails = {
        orderId: `ORD-${Date.now()}`, // Placeholder ID
        customerEmail: contactData.email || "customer@example.com",
        customerName: `${contactData.firstName || ""} ${contactData.lastName || ""}`.trim() || "Valued Customer",
        totalAmount: 0, // This should come from Stripe webhook or a confirmed order object
        items: cartItems.map((item: any) => ({ name: item.name, quantity: item.quantity, price: item.price })),
        serviceAddress:
          `${addressData.address || ""}, ${addressData.city || ""}, ${addressData.state || ""} ${addressData.zipCode || ""}`.trim(),
        paymentMethod: paymentData.paymentMethod || "Card",
      }

      // Calculate total amount for email (this should ideally come from the backend after payment confirmation)
      const subtotal = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const videoDiscount = paymentData?.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
      const totalBeforeTax = subtotal - videoDiscount
      const tax = totalBeforeTax * 0.08
      orderDetails.totalAmount = totalBeforeTax + tax

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

    if (!emailSent) {
      // Only attempt to send email once
      sendEmail()
    }
  }, [clearCart, toast, emailSent])

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
          <div className="space-y-4">
            <div className="flex items-center justify-center text-gray-700 dark:text-gray-200">
              <Mail className="mr-2 h-5 w-5" />
              <p>A confirmation email has been sent to your inbox.</p>
            </div>
            {wantsLiveVideo && (
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
