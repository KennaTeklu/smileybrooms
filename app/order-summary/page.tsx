"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
  Building,
  Navigation,
  CreditCard,
  Package,
  FileText,
  Download,
  Share2,
  ArrowLeft,
  Video,
  Shield,
  Star,
  MessageCircle,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData, CartItem } from "@/lib/types"
import { motion } from "framer-motion"

interface OrderSummaryData {
  orderId: string
  orderDate: string
  customerData: CheckoutData
  items: CartItem[]
  pricing: {
    subtotal: number
    videoDiscount: number
    tax: number
    total: number
  }
  estimatedDuration: string
  scheduledDate?: string
}

export default function OrderSummaryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { items: cartItems, clearCart } = useCart()

  const [orderData, setOrderData] = useState<OrderSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    const loadOrderData = () => {
      try {
        // Get data from localStorage (saved during checkout)
        const savedContact = JSON.parse(localStorage.getItem("checkout-contact") || "{}")
        const savedAddress = JSON.parse(localStorage.getItem("checkout-address") || "{}")
        const savedPayment = JSON.parse(localStorage.getItem("checkout-payment") || "{}")
        const savedItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

        if (!savedContact.firstName || !savedAddress.address || savedItems.length === 0) {
          toast({
            title: "Order data not found",
            description: "Redirecting to home page...",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        // Calculate pricing
        const subtotal = savedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
        const videoDiscount = savedPayment.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
        const totalBeforeTax = subtotal - videoDiscount
        const tax = totalBeforeTax * 0.08
        const total = totalBeforeTax + tax

        // Estimate duration based on items
        const totalRooms = savedItems.filter((item: CartItem) => item.type === "service").length
        const estimatedHours = Math.max(2, totalRooms * 0.75)
        const estimatedDuration = `${Math.floor(estimatedHours)}h ${Math.round((estimatedHours % 1) * 60)}m`

        const orderSummary: OrderSummaryData = {
          orderId: `SB-${Date.now().toString().slice(-8)}`,
          orderDate: new Date().toISOString(),
          customerData: {
            contact: savedContact,
            address: savedAddress,
            payment: savedPayment,
          },
          items: savedItems,
          pricing: {
            subtotal,
            videoDiscount,
            tax,
            total,
          },
          estimatedDuration,
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        }

        setOrderData(orderSummary)

        // Clear cart after successful order
        clearCart()

        toast({
          title: "Order confirmed!",
          description: "Your cleaning service has been scheduled.",
        })
      } catch (error) {
        console.error("Error loading order data:", error)
        toast({
          title: "Error loading order",
          description: "Please contact support if this issue persists.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderData()
  }, [router, toast, clearCart])

  const handleShare = async () => {
    if (!orderData) return

    const shareData = {
      title: `Order Confirmation - ${orderData.orderId}`,
      text: `My cleaning service is scheduled! Order ${orderData.orderId}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Order summary link copied to clipboard.",
      })
    }
  }

  const handleDownloadReceipt = () => {
    if (!orderData) return

    // Create a simple text receipt
    const receiptContent = `
SMILEY BROOMS - ORDER RECEIPT
==============================

Order ID: ${orderData.orderId}
Date: ${new Date(orderData.orderDate).toLocaleDateString()}

CUSTOMER INFORMATION:
Name: ${orderData.customerData.contact.firstName} ${orderData.customerData.contact.lastName}
Email: ${orderData.customerData.contact.email}
Phone: ${orderData.customerData.contact.phone}

SERVICE ADDRESS:
${orderData.customerData.address.address}
${orderData.customerData.address.address2 ? orderData.customerData.address.address2 + "\n" : ""}${orderData.customerData.address.city}, ${orderData.customerData.address.state} ${orderData.customerData.address.zipCode}

SERVICES ORDERED:
${orderData.items.map((item) => `- ${item.name} (${item.quantity}x) - $${item.price.toFixed(2)}`).join("\n")}

PRICING:
Subtotal: $${orderData.pricing.subtotal.toFixed(2)}
${orderData.pricing.videoDiscount > 0 ? `Video Discount: -$${orderData.pricing.videoDiscount.toFixed(2)}\n` : ""}Tax: $${orderData.pricing.tax.toFixed(2)}
Total: $${orderData.pricing.total.toFixed(2)}

Estimated Duration: ${orderData.estimatedDuration}
${orderData.customerData.address.specialInstructions ? `\nSpecial Instructions:\n${orderData.customerData.address.specialInstructions}` : ""}

Thank you for choosing Smiley Brooms!
    `.trim()

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SmileyBrooms-Receipt-${orderData.orderId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Receipt downloaded!",
      description: "Your order receipt has been saved.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your order summary...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Order data not found.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const { customerData, items, pricing } = orderData

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-xl text-muted-foreground mb-4">Your cleaning service has been successfully scheduled</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Order #{orderData.orderId}</span>
            <span>•</span>
            <span>{new Date(orderData.orderDate).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <Button onClick={handleDownloadReceipt} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Order
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Full Name</span>
                      </div>
                      <p className="font-medium">
                        {customerData.contact.firstName} {customerData.contact.lastName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                      <p className="font-medium">{customerData.contact.email}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>Phone</span>
                      </div>
                      <p className="font-medium">{customerData.contact.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>Payment Method</span>
                      </div>
                      <p className="font-medium capitalize">{customerData.payment.paymentMethod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Address */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Service Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      {customerData.address.addressType === "residential" ? (
                        <Home className="h-4 w-4 text-blue-600" />
                      ) : customerData.address.addressType === "commercial" ? (
                        <Building className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Navigation className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {customerData.address.addressType}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{customerData.address.address}</p>
                        {customerData.address.address2 && (
                          <p className="text-muted-foreground">{customerData.address.address2}</p>
                        )}
                        <p className="text-muted-foreground">
                          {customerData.address.city}, {customerData.address.state} {customerData.address.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  {customerData.address.specialInstructions && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                            Special Instructions
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            {customerData.address.specialInstructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Services Ordered */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Services Ordered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            {item.meta?.description && (
                              <p className="text-xs text-muted-foreground mt-1">{item.meta.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.videoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Video Discount
                        </span>
                        <span>-${pricing.videoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${pricing.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Duration</span>
                      <span className="font-medium">{orderData.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scheduled Date</span>
                      <span className="font-medium">
                        {orderData.scheduledDate
                          ? new Date(orderData.scheduledDate).toLocaleDateString()
                          : "To be scheduled"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Confirmed
                      </Badge>
                    </div>
                  </div>

                  {customerData.payment.allowVideoRecording && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Live Video Included
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        You'll receive a private YouTube Live link to watch your cleaning service.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Confirmation Email</p>
                        <p className="text-xs text-muted-foreground">
                          Check your inbox for order details and scheduling information.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Team Assignment</p>
                        <p className="text-xs text-muted-foreground">
                          We'll assign your dedicated cleaning team within 24 hours.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Service Day</p>
                        <p className="text-xs text-muted-foreground">
                          Our team will arrive on time and make your space sparkle!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        100% Satisfaction Guarantee
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Not happy? We'll make it right or refund your money.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Our customer support team is here to assist you with any questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => window.open("tel:+1234567890")}>
                <Phone className="mr-2 h-4 w-4" />
                Call Support
              </Button>
              <Button variant="outline" onClick={() => window.open("mailto:support@smileybrooms.com")}>
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
              <Button variant="outline" onClick={() => router.push("/contact")}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
