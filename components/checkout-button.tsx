"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { ApplicationSidepanel } from "@/components/cart/application-sidepanel"
import type { CheckoutData } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { processContactOrder } from "@/lib/actions"

export default function CheckoutButton() {
  const { cart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApplicationComplete = async (checkoutData: CheckoutData) => {
    setIsSubmitting(true)

    try {
      // Calculate pricing
      const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const videoDiscount = checkoutData.payment.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
      const tax = (subtotal - videoDiscount) * 0.08
      const total = subtotal - videoDiscount + tax

      // Prepare line items for the application
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        description: item.description || `${item.category} service`,
        amount: item.price,
        quantity: item.quantity,
      }))

      const applicationData = {
        customLineItems,
        discount:
          videoDiscount > 0
            ? {
                type: "fixed" as const,
                value: videoDiscount,
                description: "Video recording discount",
              }
            : undefined,
        customerData: {
          name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
          email: checkoutData.contact.email,
          phone: checkoutData.contact.phone,
          address: {
            line1: checkoutData.address.street,
            line2: checkoutData.address.apartment || undefined,
            city: checkoutData.address.city,
            state: checkoutData.address.state,
            postal_code: checkoutData.address.zipCode,
            country: "US",
          },
        },
        metadata: {
          paymentMethod: "service_application",
          deviceType:
            navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")
              ? "ios"
              : navigator.userAgent.includes("Android")
                ? "android"
                : "desktop",
          allowVideoRecording: checkoutData.payment.allowVideoRecording,
          videoConsentDetails: checkoutData.payment.videoConsentDetails,
          orderType: "cleaning_service_application",
          specialInstructions: checkoutData.address.specialInstructions,
        },
      }

      // Store application data for success page
      const applicationRecord = {
        applicationId: `APP-${Date.now()}`,
        items: cart.items,
        contact: checkoutData.contact,
        address: checkoutData.address,
        payment: { ...checkoutData.payment, paymentMethod: "service_application" },
        pricing: {
          subtotal,
          videoDiscount,
          tax,
          total,
        },
        status: "application_submitted",
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("serviceApplication", JSON.stringify(applicationRecord))

      // Process the application (this will log to Google Sheets and send notifications)
      const result = await processContactOrder(applicationData)

      if (result.success) {
        toast({
          title: "Application Submitted! 📋",
          description: "We'll review your request and contact you within 24 hours.",
          variant: "default",
        })

        // Redirect to success page with application type
        router.push("/success?type=application")
      } else {
        throw new Error(result.error || "Failed to submit application")
      }
    } catch (error: any) {
      console.error("Error submitting application:", error)
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = cart.items.length === 0 || isSubmitting

  return (
    <>
      <motion.div whileHover={{ scale: isDisabled ? 1 : 1.02 }} whileTap={{ scale: isDisabled ? 1 : 0.98 }}>
        <Button
          onClick={() => setIsApplicationOpen(true)}
          disabled={isDisabled}
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Apply for Service
            </>
          )}
        </Button>
      </motion.div>

      <ApplicationSidepanel
        isOpen={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
        onCheckoutComplete={handleApplicationComplete}
      />
    </>
  )
}
