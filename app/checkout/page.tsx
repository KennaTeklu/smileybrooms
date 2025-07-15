"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ContactStep } from "@/components/checkout/contact-step"
import { AddressStep } from "@/components/checkout/address-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ReviewStep } from "@/components/checkout/review-step"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import type { CheckoutData } from "@/lib/types" // Assuming CheckoutData type is defined here

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()

  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: {
      fullName: "",
      email: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      unit: "",
    },
    billingAddressSameAsService: true,
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      unit: "",
    },
    paymentMethod: "credit_card",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardholderName: "",
    },
    notes: "",
  })

  const steps = useMemo(
    () => [
      {
        title: "Contact Information",
        component: ContactStep,
        description: "Please provide your contact details for the service.",
      },
      {
        title: "Service Address",
        component: AddressStep,
        description: "Where would you like us to clean?",
      },
      {
        title: "Payment Details",
        component: PaymentStep,
        description: "Select your payment method and enter details.",
      },
      {
        title: "Review & Confirm",
        component: ReviewStep,
        description: "Please review your order before confirming.",
      },
    ],
    [],
  )

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = useCallback(
    (data: any) => {
      setCheckoutData((prevData) => {
        const newData = { ...prevData }
        if (currentStep === 0) {
          // Contact Step
          newData.contact = data
          // Also populate address fields for convenience if they are empty
          newData.address.fullName = data.fullName
          newData.address.email = data.email
          newData.address.phone = data.phone
        } else if (currentStep === 1) {
          // Address Step
          newData.address = { ...newData.address, ...data } // Merge with existing contact info
        } else if (currentStep === 2) {
          // Payment Step
          newData.paymentMethod = data.paymentMethod
          newData.cardDetails = data.cardDetails
          newData.billingAddressSameAsService = data.billingAddressSameAsService
          newData.billingAddress = data.billingAddress
        }
        return newData
      })

      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        // Last step, finalize order
        console.log("Finalizing order with data:", checkoutData, "and cart:", cart)
        // In a real application, you would send this data to your backend
        // and handle payment processing.
        clearCart() // Clear cart after successful order
        router.push("/success") // Redirect to a success page
      }
    },
    [currentStep, totalSteps, checkoutData, cart, clearCart, router],
  )

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    } else {
      router.push("/cart") // Go back to cart if on the first step
    }
  }, [currentStep, router])

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-center">{steps[currentStep].description}</CardDescription>
          <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
        <CardContent className="p-6">
          <CurrentStepComponent
            data={
              currentStep === 0
                ? checkoutData.contact
                : currentStep === 1
                  ? checkoutData.address
                  : {
                      paymentMethod: checkoutData.paymentMethod,
                      cardDetails: checkoutData.cardDetails,
                      billingAddressSameAsService: checkoutData.billingAddressSameAsService,
                      billingAddress: checkoutData.billingAddress,
                      serviceAddress: checkoutData.address, // Pass service address for billing comparison
                    }
            }
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={currentStep === totalSteps - 1}
            cart={cart} // Pass cart data to review step
          />
        </CardContent>
      </Card>
    </div>
  )
}
