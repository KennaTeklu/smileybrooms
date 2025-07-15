"use client"

import { useState, useMemo, useCallback } from "react"
import { ContactStep } from "@/components/checkout/contact-step"
import { AddressStep } from "@/components/checkout/address-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ReviewStep } from "@/components/checkout/review-step"
import { Progress } from "@/components/ui/progress"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CheckoutData {
  contact: {
    fullName: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  payment: {
    paymentMethod: string
    cardDetails?: {
      cardNumber: string
      expiryDate: string
      cvc: string
    }
    billingAddressSameAsService: boolean
    billingAddress?: {
      street: string
      city: string
      state: string
      zip: string
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { fullName: "", email: "", phone: "" },
    address: { street: "", city: "", state: "", zip: "" },
    payment: { paymentMethod: "credit_card", billingAddressSameAsService: true },
  })

  const steps = useMemo(
    () => [
      { name: "Contact Information", component: ContactStep },
      { name: "Service Address", component: AddressStep },
      { name: "Payment Details", component: PaymentStep },
      { name: "Review Order", component: ReviewStep },
    ],
    [],
  )

  const handleNext = useCallback(
    (data: any) => {
      setCheckoutData((prev) => {
        const updatedData = { ...prev }
        if (currentStep === 0) {
          // From ContactStep
          updatedData.contact = data
          // Also update address fields that come from contact for consistency
          updatedData.address = {
            ...updatedData.address,
            fullName: data.fullName, // Add fullName to address for review step display
            email: data.email, // Add email to address for review step display
            phone: data.phone, // Add phone to address for review step display
          }
        } else if (currentStep === 1) {
          // From AddressStep
          updatedData.address = data
          // Ensure contact details are preserved if they were passed from previous step
          updatedData.contact = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          }
        } else if (currentStep === 2) {
          // From PaymentStep
          updatedData.payment = data
        }
        return updatedData
      })
      setCurrentStep((prev) => prev + 1)
    },
    [currentStep],
  )

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => prev - 1)
  }, [])

  const handleSubmitOrder = useCallback(() => {
    // Simulate order submission
    console.log("Submitting order:", checkoutData)
    console.log("Cart items:", cart.items)

    // In a real application, you would send checkoutData and cart.items to your backend
    // and handle payment processing, order creation, etc.

    // For demonstration, clear cart and redirect to success page
    clearCart()
    toast({
      title: "Order Confirmed!",
      description: "Your cleaning service has been successfully booked.",
      duration: 5000,
    })
    router.push("/success")
  }, [checkoutData, cart.items, clearCart, router, toast])

  const progress = ((currentStep + 1) / steps.length) * 100

  if (cart.totalItems === 0 && currentStep === 0) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Please add some cleaning services to your cart before proceeding to checkout.
        </p>
        <Button asChild size="lg">
          <Link href="/pricing">Browse Services</Link>
        </Button>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Checkout</h1>
        <Progress value={progress} className="w-full max-w-2xl mx-auto" />
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
        </p>
      </div>

      {currentStep === 0 && <ContactStep initialData={checkoutData.contact} onNext={handleNext} />}
      {currentStep === 1 && <AddressStep initialData={checkoutData.address} onNext={handleNext} onBack={handleBack} />}
      {currentStep === 2 && (
        <PaymentStep
          initialData={checkoutData.payment}
          serviceAddress={checkoutData.address} // Pass service address for billing address comparison
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && <ReviewStep checkoutData={checkoutData} onBack={handleBack} onSubmit={handleSubmitOrder} />}
    </div>
  )
}
