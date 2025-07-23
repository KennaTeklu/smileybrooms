"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  ArrowLeft,
} from "lucide-react"
import { CartItemDisplay } from "@/components/cart/cart-item-display"
import { CheckoutSidepanel } from "@/components/cart/checkout-sidepanel"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
  description?: string
}

interface CheckoutData {
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    apartmentUnit?: string
  }
  serviceDate: string
  serviceTime: string
  paymentMethod: string
  specialInstructions?: string
  liveVideo?: boolean
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [completedCheckoutData, setCompletedCheckoutData] = useState<CheckoutData | null>(null)
  const [isItemsExpanded, setIsItemsExpanded] = useState(false)
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false)

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Load completed checkout data
    const savedCheckoutData = localStorage.getItem("completedCheckoutData")
    if (savedCheckoutData) {
      setCompletedCheckoutData(JSON.parse(savedCheckoutData))
    }
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }

    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedItems)
    localStorage.setItem("cart", JSON.stringify(updatedItems))
  }

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)
    localStorage.setItem("cart", JSON.stringify(updatedItems))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    return subtotal + tax
  }

  const handleCheckoutComplete = (checkoutData: CheckoutData) => {
    setCompletedCheckoutData(checkoutData)
    setIsCheckoutOpen(false)
    localStorage.setItem("completedCheckoutData", JSON.stringify(checkoutData))
  }

  const handleProceedToCheckout = () => {
    if (completedCheckoutData) {
      // Process payment with Stripe or redirect to payment
      console.log("Processing payment...", { cartItems, checkoutData: completedCheckoutData })
      // Here you would integrate with Stripe or your payment processor
      router.push("/success")
    } else {
      setIsCheckoutOpen(true)
    }
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const total = calculateTotal()

  if (cartItems.length === 0 && !completedCheckoutData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some services to get started with your cleaning booking.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header - Hidden when checkout is completed */}
      {!completedCheckoutData && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">Review your selected services and proceed to checkout</p>
        </div>
      )}

      {/* Review Header - Shown when checkout is completed */}
      {completedCheckoutData && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review Your Order</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please review your order details before completing your payment
          </p>
        </div>
      )}

      <div className={`grid gap-8 ${completedCheckoutData ? "grid-cols-1" : "lg:grid-cols-3"}`}>
        {/* Left Column: Cart Items - Hidden when checkout is completed */}
        {!completedCheckoutData && (
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemDisplay key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Column: CTA or Order Summary */}
        <div className={`${completedCheckoutData ? "w-full max-w-4xl mx-auto" : "lg:col-span-1"} flex flex-col gap-8`}>
          {!completedCheckoutData ? (
            <Card className="shadow-lg border-gray-200 dark:border-gray-700 p-6 text-center flex flex-col items-center justify-center min-h-[200px]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Ready to book your cleaning?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Complete your booking in just a few simple steps
              </p>
              <Button onClick={handleProceedToCheckout} className="w-full mb-4" size="lg">
                Proceed to Checkout
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Collapsed Purchased Items Section */}
              <Card className="shadow-lg border-gray-200 dark:border-gray-700">
                <Collapsible open={isItemsExpanded} onOpenChange={setIsItemsExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          Purchased Items ({cartItems.length})
                        </div>
                        {isItemsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      {cartItems.map((item) => (
                        <CartItemDisplay
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeItem}
                        />
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Collapsed Customer Information Section */}
              <Card className="shadow-lg border-gray-200 dark:border-gray-700">
                <Collapsible open={isCustomerExpanded} onOpenChange={setIsCustomerExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Customer Information
                        </div>
                        {isCustomerExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      {/* Contact Information */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Contact Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <p className="font-medium">
                              {completedCheckoutData.contact.firstName} {completedCheckoutData.contact.lastName}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {completedCheckoutData.contact.email}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {completedCheckoutData.contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Service Address */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Service Address
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">{completedCheckoutData.address.street}</p>
                          {completedCheckoutData.address.apartmentUnit && (
                            <p className="text-gray-600 dark:text-gray-400">
                              Unit: {completedCheckoutData.address.apartmentUnit}
                            </p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400">
                            {completedCheckoutData.address.city}, {completedCheckoutData.address.state}{" "}
                            {completedCheckoutData.address.zipCode}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Service Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Service Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {completedCheckoutData.serviceDate}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Time:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {completedCheckoutData.serviceTime}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                            <p className="font-medium flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {completedCheckoutData.paymentMethod}
                            </p>
                          </div>
                          {completedCheckoutData.liveVideo && (
                            <div>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Live Video Included
                              </Badge>
                            </div>
                          )}
                        </div>
                        {completedCheckoutData.specialInstructions && (
                          <div className="mt-4">
                            <span className="text-gray-600 dark:text-gray-400">Special Instructions:</span>
                            <p className="font-medium mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                              {completedCheckoutData.specialInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Continue Shopping Link */}
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button onClick={handleProceedToCheckout} className="w-full mt-6" size="lg">
                {completedCheckoutData ? "Pay Now" : "Proceed to Checkout"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
                <Shield className="h-4 w-4" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Sidepanel */}
      <CheckoutSidepanel
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </div>
  )
}
