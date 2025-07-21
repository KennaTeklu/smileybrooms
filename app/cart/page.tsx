"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingBag, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"
import { AnimatePresence } from "framer-motion"
import { CartItemDisplay } from "@/components/cart/cart-item-display"
import { useMultiStepForm, type Step } from "@/hooks/use-multi-step-form"
import ContactStep from "@/components/checkout/contact-step"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import ReviewStep from "@/components/checkout/review-step"
import type { CheckoutData } from "@/lib/types"
import { createCheckoutSession } from "@/lib/actions"

// Build an absolute HTTPS/HTTP URL for Stripe (it rejects relative paths).
const makeAbsoluteUrl = (path?: string) =>
  path && /^https?:\/\//i.test(path)
    ? path
    : path
      ? `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
      : undefined

// Simple price formatter – prepend `$` & keep two decimals
const formatPrice = (price: number) => `$${price.toFixed(2)}`

// Empty placeholder for suggested products component
function CartSuggestions({ currentCartItems, id }: { currentCartItems: any[]; id?: string }) {
  return null
}

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [couponInput, setCouponInput] = useState(cart.couponCode || "")

  // State to control whether the multi-step checkout flow is active
  const [isCheckoutFlowActive, setIsCheckoutFlowActive] = useState(false)

  // Define the steps for the multi-step form
  const checkoutSteps: Step[] = [
    {
      id: "contact",
      title: "Contact Information",
      description: "How we can reach you about your service.",
      validate: (data: Record<string, any>) => {
        const errors: Record<string, string> = {}
        if (!data.contact.firstName?.trim()) errors.firstName = "First name is required"
        if (!data.contact.lastName?.trim()) errors.lastName = "Last name is required"
        if (!data.contact.email?.trim()) errors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(data.contact.email)) errors.email = "Email is invalid"
        if (!data.contact.phone?.trim()) errors.phone = "Phone is required"
        return Object.keys(errors).length > 0 ? { contact: errors } : null
      },
    },
    {
      id: "address",
      title: "Service Address",
      description: "Where would you like us to provide your cleaning service?",
      validate: (data: Record<string, any>) => {
        const errors: Record<string, string> = {}
        if (!data.address.address?.trim()) errors.address = "Address is required"
        if (!data.address.city?.trim()) errors.city = "City is required"
        if (!data.address.state) errors.state = "State is required"
        if (!data.address.zipCode?.trim()) errors.zipCode = "ZIP code is required"
        return Object.keys(errors).length > 0 ? { address: errors } : null
      },
      dependencies: ["contact"], // Address step depends on Contact step being completed
    },
    {
      id: "payment",
      title: "Payment Method",
      description: "Choose how you'd like to pay for your cleaning service",
      validate: (data: Record<string, any>) => {
        const errors: Record<string, string> = {}
        if (!data.payment.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions."
        return Object.keys(errors).length > 0 ? { payment: errors } : null
      },
      dependencies: ["address"], // Payment step depends on Address step being completed
    },
    {
      id: "review",
      title: "Review Your Order",
      description: "Please review your order details before completing your purchase",
      dependencies: ["payment"], // Review step depends on Payment step being completed
    },
  ]

  // Initialize useMultiStepForm
  const {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    formData,
    updateFormData,
    errors: formErrors,
    isSubmitting: isFormSubmitting,
    completeForm,
  } = useMultiStepForm({
    steps: checkoutSteps,
    initialData: {
      contact: { firstName: "", lastName: "", email: "", phone: "" },
      address: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        specialInstructions: "",
        addressType: "residential",
      },
      payment: {
        paymentMethod: "card",
        allowVideoRecording: false,
        videoConsentDetails: undefined,
        agreeToTerms: false,
      },
    } as CheckoutData,
    persistKey: "multi-step-checkout", // Persist form data in localStorage
    autosave: true,
    onComplete: async (finalData) => {
      if (cart.items.length === 0) {
        toast({
          title: "Error",
          description: "Your cart is empty. Please add items before checking out.",
          variant: "destructive",
        })
        return false
      }

      setIsCheckoutLoading(true)
      try {
        // Prepare line items for Stripe (only online payment items)
        const onlinePaymentItems = cart.items.filter((item) => item.paymentType !== "in_person")
        const customLineItems = onlinePaymentItems.map((item) => {
          const processedMetadata: Record<string, string> = { itemId: item.id }

          for (const key in item.metadata) {
            if (Object.prototype.hasOwnProperty.call(item.metadata, key)) {
              const value = item.metadata[key]
              processedMetadata[key] =
                typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)
            }
          }

          return {
            name: item.name,
            amount: item.price,
            quantity: item.quantity,
            description: item.description || `Service: ${item.name}`,
            // NOTE: Stripe requires absolute URLs for product images
            images: item.image ? [makeAbsoluteUrl(item.image)!] : [], // Use makeAbsoluteUrl here
            metadata: processedMetadata,
          }
        })

        // Add video discount if applicable
        const subtotalOnline = onlinePaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const videoDiscount = finalData.payment.allowVideoRecording
          ? subtotalOnline >= 250
            ? 25
            : subtotalOnline * 0.1
          : 0
        if (videoDiscount > 0) {
          customLineItems.push({
            name: "Video Recording Discount",
            amount: -videoDiscount,
            quantity: 1,
            description: "Discount for allowing video recording during service",
          })
        }

        // Add coupon discount if applicable (assuming coupon logic is handled elsewhere or passed here)
        // For simplicity, we'll use the cart's current coupon discount.
        if (cart.couponDiscount > 0) {
          customLineItems.push({
            name: `Coupon Discount: ${cart.couponCode}`,
            amount: -cart.couponDiscount,
            quantity: 1,
            description: `Discount applied with coupon code: ${cart.couponCode}`,
          })
        }

        // Pass window.location.origin to the server action
        const origin = window.location.origin

        const stripeSessionUrl = await createCheckoutSession({
          customLineItems,
          successUrl: `${origin}/success`,
          cancelUrl: `${origin}/canceled`,
          customerEmail: finalData.contact.email,
          customerData: {
            name: `${finalData.contact.firstName} ${finalData.contact.lastName}`,
            email: finalData.contact.email,
            phone: finalData.contact.phone,
            address: {
              line1: finalData.address.address,
              city: finalData.address.city,
              state: finalData.address.state,
              postal_code: finalData.address.zipCode,
              country: "US", // Assuming US for now, adjust as needed
            },
            allowVideoRecording: finalData.payment.allowVideoRecording,
            videoConsentDetails: finalData.payment.videoConsentDetails,
          },
          automaticTax: { enabled: true },
          allowPromotions: true,
          paymentMethodTypes: finalData.payment.paymentMethod === "card" ? ["card"] : undefined,
        })

        if (stripeSessionUrl) {
          clearCart() // Clear cart after successful checkout initiation
          window.location.href = stripeSessionUrl
          return true
        } else {
          throw new Error("Failed to get Stripe session URL.")
        }
      } catch (error: any) {
        console.error("Error during checkout:", error)
        toast({
          title: "Checkout Error",
          description: error.message || "An unexpected error occurred during checkout.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsCheckoutLoading(false)
      }
    },
  })

  useEffect(() => {
    setCouponInput(cart.couponCode || "")
  }, [cart.couponCode])

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items?.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = currentItem.quantity + change
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity)
      } else {
        setItemToRemoveId(itemId)
        setItemToRemoveName(currentItem.name)
        setShowRemoveConfirm(true)
      }
    }
  }

  const confirmRemoveItem = () => {
    if (itemToRemoveId) {
      removeItem(itemToRemoveId)
      setShowRemoveConfirm(false)
      setItemToRemoveId(null)
      setItemToRemoveName(null)
    }
  }

  const cancelRemoveItem = () => {
    setShowRemoveConfirm(false)
    setItemToRemoveId(null)
    setItemToRemoveName(null)
  }

  const handleRemoveItemClick = (itemId: string, itemName: string) => {
    setItemToRemoveId(itemId)
    setItemToRemoveName(itemName)
    setShowRemoveConfirm(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const handleClearCartClick = () => {
    setShowClearConfirm(true)
  }

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim())
    } else {
      toast({
        title: "Coupon field is empty",
        description: "Please enter a coupon code.",
        variant: "warning",
      })
    }
  }

  const handleProceedToCheckout = () => {
    if ((cart.items?.length ?? 0) === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "warning",
      })
      return
    }
    setIsCheckoutFlowActive(true)
    // Pre-fill contact and address data from local storage if available
    const savedContact = localStorage.getItem("checkout-contact")
    const savedAddress = localStorage.getItem("checkout-address")
    const savedPayment = localStorage.getItem("checkout-payment")

    let initialContact = formData.contact
    let initialAddress = formData.address
    let initialPayment = formData.payment

    if (savedContact) {
      try {
        initialContact = JSON.parse(savedContact)
      } catch (e) {
        console.error("Failed to parse saved contact data")
      }
    }
    if (savedAddress) {
      try {
        initialAddress = JSON.parse(savedAddress)
      } catch (e) {
        console.error("Failed to parse saved address data")
      }
    }
    if (savedPayment) {
      try {
        initialPayment = JSON.parse(savedPayment)
      } catch (e) {
        console.error("Failed to parse saved payment data")
      }
    }

    updateFormData({
      contact: initialContact,
      address: {
        ...initialAddress,
        fullName: `${initialContact.firstName} ${initialContact.lastName}`,
        email: initialContact.email,
        phone: initialContact.phone,
      },
      payment: initialPayment,
    })
  }

  const renderCurrentStep = useCallback(() => {
    switch (currentStep.id) {
      case "contact":
        return (
          <ContactStep
            data={formData.contact}
            onSave={(data) => updateFormData({ contact: data })}
            onNext={nextStep}
            isSubmitting={isFormSubmitting}
          />
        )
      case "address":
        return (
          <AddressStep
            data={{ ...formData.address, ...formData.contact }} // Pass contact info to address step for pre-fill
            onSave={(data) => updateFormData({ address: data })}
            onNext={nextStep}
            onPrevious={prevStep}
            isSubmitting={isFormSubmitting}
          />
        )
      case "payment":
        return (
          <PaymentStep
            data={formData.payment}
            onSave={(data) => updateFormData({ payment: data })}
            onNext={nextStep}
            onPrevious={prevStep}
            checkoutData={formData as CheckoutData} // Pass full checkoutData for StripePaymentRequestButton
            isSubmitting={isFormSubmitting}
          />
        )
      case "review":
        return (
          <ReviewStep
            checkoutData={formData as CheckoutData}
            onPrevious={prevStep}
            onComplete={completeForm}
            isProcessing={isCheckoutLoading}
          />
        )
      default:
        return <p>Unknown step</p>
    }
  }, [currentStep, formData, updateFormData, nextStep, prevStep, isFormSubmitting, completeForm, isCheckoutLoading])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100 leading-tight">
        Your <span className="text-blue-600 dark:text-blue-400">Shopping Cart</span>
      </h1>

      {!isCheckoutFlowActive && (cart.items?.length ?? 0) === 0 ? (
        <Card
          className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-card rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
          id="empty-cart-message"
        >
          <ShoppingBag className="h-28 w-28 text-muted-foreground mb-6 opacity-70" />
          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Your cart is empty
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md text-base">
            Looks like you haven't added any cleaning services or products yet. Start by exploring our offerings!
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 text-base">
            <Link href="/pricing">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 flex-1">
          {/* Cart Items List */}
          <Card className="lg:col-span-2 shadow-lg border-gray-200 dark:border-gray-700" id="cart-items-list">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Items in Cart ({cart.totalItems})
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleClearCartClick}
                disabled={(cart.items?.length ?? 0) === 0}
                className="rounded-lg bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                <AnimatePresence mode="popLayout">
                  {cart.items?.map((item) => (
                    <CartItemDisplay
                      key={item.id}
                      item={item}
                      onRemoveItem={handleRemoveItemClick}
                      onUpdateQuantity={handleQuantityChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
          {/* Cart Summary & Checkout Flow */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg border-gray-200 dark:border-gray-700" id="order-summary">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal ({cart.totalItems} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice(cart.subtotalPrice)}
                    </span>
                  </div>
                  {cart.couponDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Coupon ({cart.couponCode})</span>
                      <span>-{formatPrice(cart.couponDiscount)}</span>
                    </div>
                  )}
                  {cart.fullHouseDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 dark:text-green-400 font-medium">
                      <span>Full House Discount</span>
                      <span>-{formatPrice(cart.fullHouseDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <Separator className="my-4" />
                {/* Coupon Input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 h-10 rounded-lg"
                    aria-label="Coupon code input"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || cart.couponDiscount > 0}
                    className="rounded-lg"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatPrice(cart.totalPrice)}</span>
                </div>
                {cart.inPersonPaymentTotal > 0 && (
                  <>
                    <div className="flex justify-between text-xl font-bold text-orange-600 mt-4">
                      <span>Custom Services</span>
                      <span>Email for Pricing</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">Payment Notice:</p>
                      <p>{CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
                    </div>
                  </>
                )}
                {/* Checkout focused description */}
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Ready to complete your order? Proceed to checkout to finalize your booking.
                </p>
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full h-12 rounded-lg text-base"
                  size="lg"
                  disabled={(cart.items?.length ?? 0) === 0 || isCheckoutLoading}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-3 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Link href="/pricing">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Multi-step Checkout Dialog */}
      <Dialog open={isCheckoutFlowActive} onOpenChange={setIsCheckoutFlowActive}>
        <DialogContent className="sm:max-w-[900px] w-full h-auto max-h-[90vh] overflow-y-auto rounded-xl p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {checkoutSteps.length}: {currentStep.title}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / checkoutSteps.length) * 100}%` }}
              ></div>
            </div>
            <Card className="shadow-lg border-0">{renderCurrentStep()}</Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Item Confirmation Dialog */}
      <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Removal</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{itemToRemoveName}</span> from your cart?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-2 pt-4">
            <Button variant="destructive" onClick={confirmRemoveItem} className="w-full sm:w-auto rounded-lg">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <Button variant="outline" onClick={cancelRemoveItem} className="w-full sm:w-auto rounded-lg bg-transparent">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Clear Cart Confirmation
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Are you sure you want to clear all items from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-2 pt-4">
            <Button variant="destructive" onClick={confirmClearCart} className="w-full sm:w-auto rounded-lg">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
              className="w-full sm:w-auto rounded-lg"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
