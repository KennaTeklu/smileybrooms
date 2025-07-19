"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import ContactStep from "@/components/checkout/contact-step"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"
import { Progress } from "@/components/ui/progress"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"

export default function CheckoutPage() {
  const { cart } = useCart()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { firstName: "", lastName: "", email: "", phone: "" },
    address: {
      fullName: "",
      email: "",
      phone: "",
      addressType: "residential",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
      allowVideoRecording: false, // Initial state for new field
      videoConsentDetails: undefined, // Initial state for new field
      agreeToTerms: false, // Initial state for new field
    },
    payment: { paymentMethod: "card" },
  })

  useEffect(() => {
    if (cart.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      // Optionally redirect to cart or calculator page
      // router.push('/cart');
    }
  }, [cart.items.length, toast])

  const steps = ["Contact Information", "Service Address", "Payment Method", "Review Order"]

  const handleSaveStepData = (step: number, data: any) => {
    setCheckoutData((prevData) => {
      if (step === 0) {
        return { ...prevData, contact: data }
      } else if (step === 1) {
        // Merge contact info into address data for pre-filling
        const updatedAddressData = {
          ...data,
          fullName: prevData.contact.firstName + " " + prevData.contact.lastName,
          email: prevData.contact.email,
          phone: prevData.contact.phone,
        }
        return { ...prevData, address: updatedAddressData }
      } else if (step === 2) {
        return { ...prevData, payment: data }
      }
      return prevData
    })
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactStep data={checkoutData.contact} onSave={(data) => handleSaveStepData(0, data)} onNext={handleNext} />
        )
      case 1:
        return (
          <AddressStep
            data={checkoutData.address}
            onSave={(data) => handleSaveStepData(1, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            checkoutData={checkoutData} // Pass full checkoutData for contact info
          />
        )
      case 2:
        return (
          <PaymentStep
            data={checkoutData.payment}
            onSave={(data) => handleSaveStepData(2, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            checkoutData={checkoutData} // Pass full checkoutData for contact/address info
          />
        )
      case 3:
        return (
          <ReviewStep
            checkoutData={checkoutData}
            onPrevious={handlePrevious}
            // onConfirm will handle final order submission
          />
        )
      default:
        return null
    }
  }

  const progressValue = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
          <div className="mb-8">
            <Progress value={progressValue} className="w-full h-2" />
            <div className="flex justify-between text-sm mt-2 text-muted-foreground">
              {steps.map((step, index) => (
                <span key={step} className={index <= currentStep ? "font-medium text-primary" : ""}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
