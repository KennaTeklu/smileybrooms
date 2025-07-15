"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ContactStep from "@/components/checkout/contact-step"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"
import type { CheckoutData } from "@/lib/types" // Assuming you have a types.ts defining CheckoutData

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    address: {
      fullName: "", // Will be populated from contact step
      email: "", // Will be populated from contact step
      phone: "", // Will be populated from contact step
      addressType: "residential",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      specialInstructions: "",
    },
    payment: {
      method: "credit_card",
      cardDetails: {
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardholderName: "",
      },
      billingAddressSameAsService: true,
      billingAddress: {
        address: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    review: {
      agreedToTerms: false,
    },
  })

  const totalSteps = 4 // Contact, Address, Payment, Review

  const handleSaveData = (step: number, data: any) => {
    setCheckoutData((prevData) => {
      const newData = { ...prevData }
      if (step === 0) {
        newData.contact = data
        // Also populate address fields from contact for convenience
        newData.address = {
          ...newData.address,
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
        }
      } else if (step === 1) {
        newData.address = data
      } else if (step === 2) {
        newData.payment = data
      } else if (step === 3) {
        newData.review = data
      }
      return newData
    })
  }

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1))
  }

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactStep data={checkoutData.contact} onSave={(data) => handleSaveData(0, data)} onNext={handleNextStep} />
        )
      case 1:
        return (
          <AddressStep
            data={checkoutData.address}
            onSave={(data) => handleSaveData(1, data)}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )
      case 2:
        return (
          <PaymentStep
            data={checkoutData.payment}
            onSave={(data) => handleSaveData(2, data)}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )
      case 3:
        return (
          <ReviewStep
            data={checkoutData.review}
            checkoutData={checkoutData} // Pass full checkout data for review
            onSave={(data) => handleSaveData(3, data)}
            onPrevious={handlePreviousStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-3xl p-6 md:p-8 lg:p-10 shadow-lg">
        <div className="mb-8">
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="w-full" />
          <p className="text-center text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
        {renderStep()}
      </Card>
    </div>
  )
}
