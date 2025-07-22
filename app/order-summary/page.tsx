"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckoutButton } from "@/components/checkout-button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import {
  ShoppingCart,
  User,
  MapPin,
  Mail,
  Package,
  CreditCard,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Home,
  Building,
  Navigation,
  Phone,
  MessageCircle,
  Shield,
  Star,
  Calendar,
  Sparkles,
} from "lucide-react"
import type { CheckoutData } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function OrderSummaryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Load checkout data from localStorage
  useEffect(() => {
    try {
      const savedContact = localStorage.getItem("checkout-contact")
      const savedAddress = localStorage.getItem("checkout-address")
      const savedPayment = localStorage.getItem("checkout-payment")

      if (savedContact && savedAddress) {
        const contact = JSON.parse(savedContact)
        const address = JSON.parse(savedAddress)
        const payment = savedPayment
          ? JSON.parse(savedPayment)
          : {
              paymentMethod: "card",
              allowVideoRecording: false,
              agreeToTerms: false,
            }

        setCheckoutData({ contact, address, payment })
      } else {
        // Redirect to checkout if no checkout data found
        toast({
          title: "Missing order information",
          description: "Please complete the checkout process first.",
          variant: "destructive",
        })
        router.push("/checkout")
        return
      }
    } catch (error) {
      console.error("Failed to load checkout data:", error)
      toast({
        title: "Error loading order data",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
      router.push("/checkout")
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleEditInfo = () => {
    router.push("/checkout?step=contact")
  }

  const handleEditAddress = () => {
    router.push("/checkout?step=address")
  }

  const handleBackToServices = () => {
    router.push("/pricing")
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }

  const calculateVideoDiscount = () => {
    if (!checkoutData?.payment.allowVideoRecording) return 0
    const subtotal = calculateSubtotal()
    return subtotal >= 250 ? 25 : subtotal * 0.1
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateVideoDiscount()
    return (subtotal - discount) * 0.08
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateVideoDiscount()
    const tax = calculateTax()
    return subtotal - discount + tax
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Home className="h-4 w-4" />
      case "commercial":
        return <Building className="h-4 w-4" />
      default:
        return <Navigation className="h-4 w-4" />
    }
  }

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case "residential":
        return "Residential"
      case "commercial":
        return "Commercial"
      default:
        return "Other"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your order summary...</p>
        </div>
      </div>
    )
  }

  if (!checkoutData || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Order Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find any order information. Please start by selecting your cleaning services.
          </p>
          <Button onClick={() => router.push("/pricing")} className="w-full">
            Browse Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToServices}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Package className="h-3 w-3 mr-1" />
                {items.length} {items.length === 1 ? "service" : "services"}
              </Badge>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Order Summary</h1>
            <p className="text-xl text-white/90 mb-8">Review your cleaning services and complete your booking</p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>5-Star Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Customer Info */}
          <div className="xl:col-span-2 space-y-8">
            {/* Items List */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    Your Cleaning Services ({items.length})
                  </CardTitle>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Edit className="h-4 w-4" />
                      Add More Services
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id} className="group">
                      <div className="flex items-start gap-6 p-6 border-2 border-gray-100 dark:border-gray-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 hover:shadow-md">
                        {item.image && (
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.name}</h3>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${item.unitPrice.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          {item.meta && Object.keys(item.meta).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {Object.entries(item.meta).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {String(value)}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 bg-transparent"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 bg-transparent"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Contact Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Details
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditInfo}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-semibold text-lg">
                          {checkoutData.contact.firstName} {checkoutData.contact.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                        <p className="font-semibold">{checkoutData.contact.email}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {checkoutData.contact.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Address */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Service Address
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditAddress}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      {getAddressTypeIcon(checkoutData.address.addressType)}
                      <Badge variant="secondary" className="text-sm">
                        {getAddressTypeLabel(checkoutData.address.addressType)} Property
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{checkoutData.address.address}</p>
                      {checkoutData.address.address2 && (
                        <p className="text-muted-foreground">{checkoutData.address.address2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}
                      </p>
                    </div>
                    {checkoutData.address.specialInstructions && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Special Instructions
                        </p>
                        <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          {checkoutData.address.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <Card className="shadow-lg border-0 sticky top-4">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {checkoutData.payment.allowVideoRecording && (
                    <div className="flex justify-between text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Live Video Discount
                      </span>
                      <span className="font-semibold">-${calculateVideoDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Live Video Feature */}
                {checkoutData.payment.allowVideoRecording && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          🎥 Live Video Service Included
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          Watch your cleaning service live via private YouTube stream. You'll receive the link before we
                          start.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <div className="space-y-4">
                  <CheckoutButton
                    cartItems={items}
                    customerEmail={checkoutData.contact.email}
                    customerData={{
                      name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
                      email: checkoutData.contact.email,
                      phone: checkoutData.contact.phone,
                      address: {
                        line1: checkoutData.address.address,
                        city: checkoutData.address.city,
                        state: checkoutData.address.state,
                        postal_code: checkoutData.address.zipCode,
                        country: "US",
                      },
                      allowVideoRecording: checkoutData.payment.allowVideoRecording,
                      videoConsentDetails: checkoutData.payment.videoConsentDetails,
                    }}
                    discount={
                      checkoutData.payment.allowVideoRecording
                        ? {
                            amount: calculateVideoDiscount(),
                            reason: "Live Video Discount",
                          }
                        : undefined
                    }
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    🚀 Complete Booking - ${calculateTotal().toFixed(2)}
                  </CheckoutButton>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>256-bit SSL encryption • Powered by Stripe</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your payment information is completely secure and encrypted
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Next Timeline */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">Complete your booking with our secure checkout</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">Instant Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        Confirmation email sent to {checkoutData.contact.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Service Coordination</p>
                      <p className="text-sm text-muted-foreground">We'll contact you within 2 hours to schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-yellow-600">4</span>
                    </div>
                    <div>
                      <p className="font-semibold">Sparkling Results</p>
                      <p className="text-sm text-muted-foreground">Professional cleaning at your scheduled time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
