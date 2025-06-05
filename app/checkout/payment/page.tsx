"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

type PaymentMethod = "card" | "paypal" | "apple_pay" | "google_pay"

export default function PaymentPage() {
  const router = useRouter()
  const { cart } = useCart()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addressData, setAddressData] = useState<any>(null)

  // Redirect if cart is empty or no address data
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
      return
    }

    // Load address data from localStorage
    const savedAddress = localStorage.getItem("checkout-address")
    if (!savedAddress) {
      router.push("/checkout/address")
      return
    }

    try {
      setAddressData(JSON.parse(savedAddress))
    } catch (e) {
      console.error("Failed to parse saved address data")
      router.push("/checkout/address")
    }
  }, [cart.items.length, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save payment preferences to localStorage
      localStorage.setItem(
        "checkout-payment",
        JSON.stringify({
          paymentMethod,
          allowVideoRecording,
        }),
      )

      // Proceed to review page
      router.push("/checkout/review")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your payment information.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!addressData) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/checkout/address"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Address
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Method</h1>
            <p className="text-xl text-muted-foreground">Choose how you'd like to pay for your cleaning service</p>
          </div>
        </div>

        {/* Payment Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>All transactions are secure and encrypted</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Payment Methods */}
                <div className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="card" id="card" className="h-5 w-5" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-lg">Credit or Debit Card</div>
                              <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                            </div>
                            <div className="flex space-x-2">
                              <Badge variant="outline">Visa</Badge>
                              <Badge variant="outline">Mastercard</Badge>
                              <Badge variant="outline">Amex</Badge>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" className="h-5 w-5" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-lg">PayPal</div>
                              <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50">
                              PayPal
                            </Badge>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-4 p-6 border-2 rounded-xl hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="apple_pay" id="apple_pay" className="h-5 w-5" />
                        <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-lg">Apple Pay</div>
                              <div className="text-sm text-gray-500">Touch ID or Face ID</div>
                            </div>
                            <Badge variant="outline" className="bg-gray-50">
                              Apple Pay
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Stripe Elements Placeholder */}
                  {paymentMethod === "card" && (
                    <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="text-center">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Stripe Payment Elements
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          Secure payment form will be embedded here
                        </p>
                        <div className="space-y-4">
                          <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                            <span className="text-gray-500">Card number placeholder</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                              <span className="text-gray-500">MM/YY</span>
                            </div>
                            <div className="h-12 bg-white dark:bg-gray-700 border rounded-lg flex items-center px-4">
                              <span className="text-gray-500">CVC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Options */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Additional Options</h3>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Checkbox
                      id="videoRecording"
                      checked={allowVideoRecording}
                      onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                    />
                    <Label htmlFor="videoRecording" className="text-base">
                      Allow video recording for quality assurance and social media use
                      <span className="text-green-600 font-medium ml-2">(Save 10% on your order)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-base">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Link href="/checkout/address">
                    <Button variant="outline" size="lg" className="px-8">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Address
                    </Button>
                  </Link>
                  <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Review Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Badges */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
