"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ContactStep } from "@/components/checkout/contact-step"
import { AddressStep } from "@/components/checkout/address-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ReviewStep } from "@/components/checkout/review-step"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { generateCheckoutConfirmationMailtoLink } from "@/lib/email-utils"

// Define types for checkout data
export interface ContactData {
  fullName: string
  email: string
  phone: string
}

export interface AddressData {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface PaymentData {
  method: "card" | "in_person"
  cardType?: string
  last4?: string
  expiryMonth?: string
  expiryYear?: string
  cvc?: string
  billingAddressSameAsService: boolean
  billingAddress?: AddressData
}

export interface CheckoutData {
  contact: ContactData
  address: AddressData
  payment: PaymentData
}

const STEPS = ["Contact Information", "Service Address", "Payment Method", "Review & Confirm"]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { fullName: "", email: "", phone: "" },
    address: { street: "", city: "", state: "", zipCode: "" },
    payment: { method: "card", billingAddressSameAsService: true },
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      router.push("/pricing")
    }
  }, [cart.items.length, router, toast])

  const handleNext = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => {
      const updatedData = {
        ...prev,
        ...data,
      }

      // Special handling for contact data to also populate address fields if they are empty
      if (data.contact) {
        updatedData.address = {
          ...updatedData.address,
          fullName: data.contact.fullName || updatedData.address.fullName,
          email: data.contact.email || updatedData.address.email,
          phone: data.contact.phone || updatedData.address.phone,
        } as AddressData // Cast to AddressData to allow these properties
      }

      return updatedData
    })
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmitOrder = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call for order submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mailto link for confirmation
      const mailtoLink = generateCheckoutConfirmationMailtoLink(checkoutData)

      // Open email client (optional, can be removed if backend sends email)
      window.open(mailtoLink, "_blank")

      toast({
        title: "Order Placed!",
        description: "Your cleaning service has been booked. Check your email for confirmation.",
        variant: "success",
      })
      clearCart() // Clear cart after successful order
      router.push("/success") // Redirect to a success page
    } catch (error) {
      console.error("Order submission failed:", error)
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ContactStep data={checkoutData.contact} onNext={handleNext} />
      case 1:
        return <AddressStep data={checkoutData.address} onNext={handleNext} onBack={handleBack} />
      case 2:
        return <PaymentStep data={checkoutData.payment} onNext={handleNext} onBack={handleBack} />
      case 3:
        return <ReviewStep checkoutData={checkoutData} />
      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Checkout</CardTitle>
          <CardDescription>Complete your booking in a few simple steps.</CardDescription>
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepContent()}
          {currentStep === STEPS.length - 1 && (
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                Back
              </Button>
              <Button onClick={handleSubmitOrder} disabled={isProcessing}>
                {isProcessing ? "Placing Order..." : `Place Order (${formatCurrency(cart.totalPrice)})`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
