"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  ArrowLeft,
  Eye,
  CheckCircle,
  Home,
  Building,
  Navigation,
  MessageCircle,
  Package,
  ExternalLink,
} from "lucide-react"
import type { CheckoutData } from "@/lib/types"
import { motion } from "framer-motion"

interface ReviewStepProps {
  checkoutData: CheckoutData
  onPrevious: () => void
}

export default function ReviewStep({ checkoutData, onPrevious }: ReviewStepProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { items } = useCart()
  const [isNavigating, setIsNavigating] = useState(false)

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }

  const calculateVideoDiscount = () => {
    if (!checkoutData.payment.allowVideoRecording) return 0
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

  const handleViewFullSummary = async () => {
    setIsNavigating(true)

    try {
      // Ensure all data is saved to localStorage
      localStorage.setItem("checkout-contact", JSON.stringify(checkoutData.contact))
      localStorage.setItem("checkout-address", JSON.stringify(checkoutData.address))
      localStorage.setItem("checkout-payment", JSON.stringify(checkoutData.payment))

      // Navigate to the full-page order summary
      router.push("/order-summary")

      toast({
        title: "Opening order summary",
        description: "Review your complete order details",
      })
    } catch (error) {
      console.error("Failed to navigate to order summary:", error)
      toast({
        title: "Navigation failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
      setIsNavigating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Almost Ready! 🎉</h2>
          <p className="text-lg text-muted-foreground">Review your information and proceed to complete your booking</p>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Summary */}
          <Card className="border-2 border-blue-100 dark:border-blue-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Contact Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {checkoutData.contact.firstName} {checkoutData.contact.lastName}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {checkoutData.contact.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {checkoutData.contact.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Address Summary */}
          <Card className="border-2 border-green-100 dark:border-green-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Service Address</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  {getAddressTypeIcon(checkoutData.address.addressType)}
                  <Badge variant="secondary" className="text-xs">
                    {getAddressTypeLabel(checkoutData.address.addressType)}
                  </Badge>
                </div>
                <p className="font-medium">{checkoutData.address.address}</p>
                {checkoutData.address.address2 && (
                  <p className="text-muted-foreground">{checkoutData.address.address2}</p>
                )}
                <p className="text-muted-foreground">
                  {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Summary */}
        <Card className="mb-8 border-2 border-purple-100 dark:border-purple-900/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Selected Services ({items.length})</h3>
            </div>
            <div className="space-y-3">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ... and {items.length - 3} more service{items.length - 3 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="mb-8 border-2 border-yellow-100 dark:border-yellow-900/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg">Order Total</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              {checkoutData.payment.allowVideoRecording && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Live Video Discount
                  </span>
                  <span className="font-medium">-${calculateVideoDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        {checkoutData.payment.allowVideoRecording && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🎥 Live Video Service Included
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                    You'll receive a private YouTube Live link to watch your cleaning service in real-time. This feature
                    includes a discount and helps ensure quality service.
                  </p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Discount Applied: ${calculateVideoDiscount().toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Special Instructions */}
        {checkoutData.address.specialInstructions && (
          <Card className="mb-8 border-2 border-orange-100 dark:border-orange-900/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Special Instructions</h4>
                  <p className="text-sm text-muted-foreground bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    {checkoutData.address.specialInstructions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 px-8 py-3 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Payment
          </Button>

          <Button
            onClick={handleViewFullSummary}
            disabled={isNavigating}
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isNavigating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="h-5 w-5 mr-2" />
                Review My Order
              </>
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8 pt-6 border-t">
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Professional Service</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
