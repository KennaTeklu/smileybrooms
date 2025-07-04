"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { FormProgress } from "@/components/form-progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Banknote, Wallet } from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validateCreditCardNumber, validateCVC, validateExpiryDate } from "@/lib/validation"

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { calculateTotal, clearCart } = useCart()
  const cartTotal = calculateTotal()

  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  })

  const { errors, validateField, validateForm } = useFormValidation(cardDetails, {
    cardNumber: (value) => (validateCreditCardNumber(value) ? null : "Invalid card number."),
    cardName: (value) => (value.trim() ? null : "Name on card is required."),
    expiryDate: (value) => (validateExpiryDate(value) ? null : "Invalid expiry date (MM/YY)."),
    cvc: (value) => (validateCVC(value) ? null : "Invalid CVC."),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardDetails((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "creditCard") {
      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please correct the credit card details.",
          variant: "destructive",
        })
        return
      }
    }

    // Simulate payment processing
    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your order.",
      duration: 3000,
    })

    setTimeout(() => {
      // In a real application, you would integrate with a payment gateway (e.g., Stripe)
      const isPaymentSuccessful = Math.random() > 0.1 // 90% success rate for demo

      if (isPaymentSuccessful) {
        clearCart() // Clear cart on successful payment
        toast({
          title: "Payment Successful!",
          description: "Your order has been placed. Redirecting to confirmation...",
          variant: "success",
        })
        router.push("/success")
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again or use a different method.",
          variant: "destructive",
        })
        router.push("/canceled")
      }
    }, 2000) // Simulate network delay
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>

      <FormProgress currentStep={2} totalSteps={3} />

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        {/* Payment Form */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-4">
                <Label className="text-base">Select Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Label
                    htmlFor="creditCard"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem id="creditCard" value="creditCard" className="sr-only" />
                    <CreditCard className="mb-2 h-6 w-6" />
                    Credit Card
                  </Label>
                  <Label
                    htmlFor="paypal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem id="paypal" value="paypal" className="sr-only" />
                    <Wallet className="mb-2 h-6 w-6" />
                    PayPal
                  </Label>
                  <Label
                    htmlFor="bankTransfer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem id="bankTransfer" value="bankTransfer" className="sr-only" />
                    <Banknote className="mb-2 h-6 w-6" />
                    Bank Transfer
                  </Label>
                </RadioGroup>
              </div>

              {paymentMethod === "creditCard" && (
                <>
                  <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardDetails.cardNumber}
                      onChange={handleChange}
                      onBlur={() => validateField("cardNumber", cardDetails.cardNumber)}
                      maxLength={19} // Max length for formatted card number
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={handleChange}
                      onBlur={() => validateField("cardName", cardDetails.cardName)}
                    />
                    {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleChange}
                        onBlur={() => validateField("expiryDate", cardDetails.expiryDate)}
                        maxLength={5} // MM/YY
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="CVC"
                        value={cardDetails.cvc}
                        onChange={handleChange}
                        onBlur={() => validateField("cvc", cardDetails.cvc)}
                        maxLength={4}
                      />
                      {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  You will be redirected to PayPal to complete your purchase.
                </div>
              )}

              {paymentMethod === "bankTransfer" && (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  Instructions for bank transfer will be provided after order confirmation.
                </div>
              )}

              <Button type="submit" className="w-full mt-4">
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="lg:col-span-1 shadow-lg h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>$0.00</span> {/* Assuming free shipping for simplicity */}
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Taxes:</span>
              <span>Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
