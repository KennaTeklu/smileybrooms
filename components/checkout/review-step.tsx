"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, MapPin, CreditCard, Phone, Apple, Smartphone, CheckCircle } from 'lucide-react'
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { CheckoutData } from "@/lib/types"
import { createCheckoutSession } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { getContactInfo } from "@/lib/payment-config"

interface ReviewStepProps {
  checkoutData: CheckoutData
  onPrevious: () => void
}

export default function ReviewStep({ checkoutData, onPrevious }: ReviewStepProps) {
  const { cart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const contactInfo = getContactInfo()

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = checkoutData.payment.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08
  const total = subtotal - videoDiscount + tax

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)

    try {
      // For contact_for_alternatives, show confirmation and redirect
      if (checkoutData.payment.paymentMethod === 'contact_for_alternatives') {
        // Store order data for confirmation
        const orderData = {
          orderId: `ORDER-${Date.now()}`,
          items: cart.items,
          contact: checkoutData.contact,
          address: checkoutData.address,
          payment: checkoutData.payment,
          pricing: {
            subtotal,
            videoDiscount,
            tax,
            total,
          },
          status: 'pending_contact',
          createdAt: new Date().toISOString(),
        }

        localStorage.setItem('pendingOrder', JSON.stringify(orderData))

        toast({
          title: "Order Submitted! 📞",
          description: `We'll call you at ${checkoutData.contact.phone} to arrange payment and confirm your booking.`,
          variant: "default",
        })

        // Redirect to success page with contact type
        window.location.href = '/success?type=contact'
        return
      }

      // For digital wallet payments, create Stripe checkout session
      const customLineItems = cart.items.map(item => ({
        name: item.name,
        description: item.description || `${item.category} service`,
        amount: item.price,
        quantity: item.quantity,
      }))

      const discount = videoDiscount > 0 ? {
        type: "fixed" as const,
        value: videoDiscount,
        description: "Video recording discount",
      } : undefined

      const sessionData = {
        customLineItems,
        discount,
        customerData: {
          name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
          email: checkoutData.contact.email,
          phone: checkoutData.contact.phone,
          address: {
            line1: checkoutData.address.street,
            line2: checkoutData.address.apartment || undefined,
            city: checkoutData.address.city,
            state: checkoutData.address.state,
            postal_code: checkoutData.address.zipCode,
            country: "US",
          },
        },
        metadata: {
          paymentMethod: checkoutData.payment.paymentMethod,
          deviceType: navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 'ios' : 
                     navigator.userAgent.includes('Android') ? 'android' : 'desktop',
          allowVideoRecording: checkoutData.payment.allowVideoRecording,
          videoConsentDetails: checkoutData.payment.videoConsentDetails,
          orderType: 'cleaning_service',
        },
      }

      // Store order data for success page
      const orderData = {
        orderId: `ORDER-${Date.now()}`,
        items: cart.items,
        contact: checkoutData.contact,
        address: checkoutData.address,
        payment: checkoutData.payment,
        pricing: {
          subtotal,
          videoDiscount,
          tax,
          total,
        },
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem('orderConfirmation', JSON.stringify(orderData))

      // Create checkout session (will redirect to Stripe)
      await createCheckoutSession(sessionData)
    } catch (error: any) {
      console.error('Error placing order:', error)
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPaymentMethodDisplay = () => {
    switch (checkoutData.payment.paymentMethod) {
      case 'apple_pay':
        return (
          <div className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            <span>Apple Pay</span>
          </div>
        )
      case 'google_pay':
        return (
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <span>Google Pay</span>
          </div>
        )
      case 'contact_for_alternatives':
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span>Call for Payment Options</span>
          </div>
        )
      default:
        return <span>Unknown Payment Method</span>
    }
  }

  const getOrderButtonText = () => {
    if (isSubmitting) {
      return checkoutData.payment.paymentMethod === 'contact_for_alternatives' 
        ? 'Submitting Order...' 
        : 'Redirecting to Payment...'
    }
    
    return checkoutData.payment.paymentMethod === 'contact_for_alternatives' 
      ? 'Submit Order (We\'ll Call You)' 
      : `Pay ${formatCurrency(total)} Now`
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review Your Order
        </CardTitle>
        <CardDescription>
          Please review your order details before {checkoutData.payment.paymentMethod === 'contact_for_alternatives' ? 'submitting' : 'payment'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{item.category}</Badge>
                      {item.paymentType === 'pay_in_person' && (
                        <Badge variant="outline">Pay in Person</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.quantity} × {formatCurrency(item.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>{checkoutData.contact.firstName} {checkoutData.contact.lastName}</strong>
              </div>
              <div className="text-muted-foreground">{checkoutData.contact.email}</div>
              <div className="text-muted-foreground">{checkoutData.contact.phone}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                {checkoutData.address.street}
                {checkoutData.address.apartment && (
                  <>, {checkoutData.address.apartment}</>
                )}
                <br />
                {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>{getPaymentMethodDisplay()}</div>
                {checkoutData.payment.paymentMethod === 'contact_for_alternatives' && (
                  <Badge variant="outline">Call {contactInfo.phoneFormatted}</Badge>
                )}
              </div>
              {checkoutData.payment.allowVideoRecording && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ Video recording consent given (10% discount applied)
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {videoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Video Recording Discount</span>
                  <span>-{formatCurrency(videoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Instructions for Contact Payment */}
        {checkoutData.payment.paymentMethod === 'contact_for_alternatives' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      What happens next?
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• We'll call you at {checkoutData.contact.phone} within 24 hours</li>
                      <li>• We'll confirm your booking details and schedule</li>
                      <li>• We'll arrange payment (cash, Zelle, or other options)</li>
                      <li>• Your cleaning service will be confirmed once payment is arranged</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="flex justify-between pt-6"
        >
          <Button variant="outline" size="default" className="px-6 rounded-lg" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>

          <Button
            onClick={handlePlaceOrder}
            size="default"
            className={`px-8 rounded-lg text-lg font-semibold ${
              checkoutData.payment.paymentMethod === 'contact_for_alternatives'
                ? 'bg-green-600 hover:bg-green-700'
                : checkoutData.payment.paymentMethod === 'apple_pay'
                ? 'bg-black hover:bg-gray-800'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {getOrderButtonText()}
              </>
            ) : (
              getOrderButtonText()
            )}
          </Button>
        </motion.div>
      </CardContent>
    </motion.div>
  )
}
