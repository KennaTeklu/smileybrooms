"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CartSummary } from "@/components/cart-summary"
import { CheckoutForm } from "@/components/checkout-form"
import Image from "next/image"

export default function CheckoutPage() {
  const { cart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay">("card")
  const [step, setStep] = useState<"information" | "payment">("information")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    saveInformation: false,
  })

  // Calculate tax and total
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  const handleCustomerInfoSubmit = (values: any) => {
    setCustomerInfo(values)
    setStep("payment")
  }

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add services to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Prepare line items for Stripe
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        metadata: item.metadata || {},
      }))

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            postal_code: customerInfo.zipCode,
            country: "US",
          },
        },
      })

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Customer Information */}
        <div className="space-y-6">
          {step === "information" ? (
            <CheckoutForm onSubmit={handleCustomerInfoSubmit} isLoading={isProcessing} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment Method</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep("information")}>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="text-sm">Card</span>
                      {paymentMethod === "card" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600 font-bold">Pay</span>
                      <span className="text-blue-800 font-bold -mt-1">Pal</span>
                      {paymentMethod === "paypal" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 flex justify-center items-center cursor-pointer transition-colors ${
                      paymentMethod === "applepay" ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setPaymentMethod("applepay")}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">Apple</span>
                      <span className="font-medium -mt-1">Pay</span>
                      {paymentMethod === "applepay" && <Check className="h-4 w-4 text-blue-500 mt-1" />}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your payment will be securely processed by Stripe. We do not store your payment details.
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-8 w-12 relative">
                      <Image
                        src="/visa-logo-generic.png"
                        alt="Visa"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="h-8 w-12 relative">
                      <Image
                        src="/mastercard-logo-abstract.png"
                        alt="Mastercard"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="h-8 w-12 relative">
                      <Image
                        src="/abstract-credit-card-design.png"
                        alt="American Express"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 py-6 text-lg"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.items.length === 0}
                >
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "information" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Secure Checkout</h3>
              <p className="text-sm text-blue-700">
                Your information is secure and encrypted. We never store your payment details.
              </p>
            </div>
          )}
        </div>

        {/* Right side - Order Summary */}
        <div className="space-y-6">
          <CartSummary showControls={false} />

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="font-medium">Name:</div>
                  <div>{customerInfo.name}</div>
                  <div className="font-medium">Email:</div>
                  <div>{customerInfo.email}</div>
                  <div className="font-medium">Phone:</div>
                  <div>{customerInfo.phone}</div>
                  <div className="font-medium">Address:</div>
                  <div>{customerInfo.address}</div>
                  <div className="font-medium">City, State ZIP:</div>
                  <div>
                    {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
