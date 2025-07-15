"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Truck, CreditCard, ClipboardCheck } from "lucide-react"
import { ContactStep } from "@/components/checkout/contact-step"
import { AddressStep } from "@/components/checkout/address-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ReviewStep } from "@/components/checkout/review-step"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { generateOrderConfirmationEmailBody } from "@/lib/email-utils"

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
    fullName: string // Added to ensure consistency with contact info
    email: string // Added to ensure consistency with contact info
    phone: string // Added to ensure consistency with contact info
  }
  payment: {
    method: "card" | "in_person" | ""
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
  termsAgreed: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { fullName: "", email: "", phone: "" },
    address: { street: "", city: "", state: "", zip: "", fullName: "", email: "", phone: "" },
    payment: { method: "", billingAddressSameAsService: true },
    termsAgreed: false,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalAmount = useMemo(() => cart.totalPrice, [cart.totalPrice])

  const steps = [
    { id: 1, name: "Contact Information", icon: <CheckCircle className="h-5 w-5" /> },
    { id: 2, name: "Service Address", icon: <Truck className="h-5 w-5" /> },
    { id: 3, name: "Payment Method", icon: <CreditCard className="h-5 w-5" /> },
    { id: 4, name: "Review & Confirm", icon: <ClipboardCheck className="h-5 w-5" /> },
  ]

  const handleNext = (data: any) => {
    let updatedData = { ...checkoutData }

    if (currentStep === 1) {
      updatedData = {
        ...updatedData,
        contact: data,
        // Also update address with contact info for validation in AddressStep
        address: {
          ...updatedData.address,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        },
      }
    } else if (currentStep === 2) {
      updatedData = { ...updatedData, address: { ...updatedData.address, ...data } }
    } else if (currentStep === 3) {
      updatedData = { ...updatedData, payment: data }
    } else if (currentStep === 4) {
      updatedData = { ...updatedData, termsAgreed: data.termsAgreed }
    }

    setCheckoutData(updatedData)
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmitOrder = () => {
    // Simulate order submission
    console.log("Submitting order:", { checkoutData, cartItems: cart.items })

    // Generate a dummy order ID
    const orderId = `ORDER-${Date.now()}`

    // Construct order details for email
    const orderDetails = {
      orderId: orderId,
      customerName: checkoutData.contact.fullName,
      items: cart.items,
      totalPrice: totalAmount,
      address: checkoutData.address,
      contact: checkoutData.contact,
      paymentType: checkoutData.payment.method,
    }

    // Clear cart after successful submission
    clearCart()

    // Redirect to success page with order details
    router.push(`/success?orderId=${orderId}&emailBody=${generateOrderConfirmationEmailBody(orderDetails)}`)
  }

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Checkout</CardTitle>
          <div className="flex justify-between items-center mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm mt-2 text-center ${
                    currentStep >= step.id ? "font-medium text-blue-600" : "text-gray-500"
                  } hidden sm:block`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
        </CardHeader>
        <CardContent className="p-6">
          {currentStep === 1 && <ContactStep initialData={checkoutData.contact} onNext={handleNext} />}
          {currentStep === 2 && (
            <AddressStep initialData={checkoutData.address} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <PaymentStep initialData={checkoutData.payment} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 4 && (
            <ReviewStep
              checkoutData={checkoutData}
              cartItems={cart.items}
              totalAmount={totalAmount}
              onBack={handleBack}
              onSubmitOrder={handleSubmitOrder}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
