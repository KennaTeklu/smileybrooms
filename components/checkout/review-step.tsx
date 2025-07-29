"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, MapPin, Send, CheckCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { CheckoutData } from "@/lib/types"
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

  const handleSubmitApplication = async () => {
    setIsSubmitting(true)

    try {
      // Store application data for success page
      const applicationData = {
        applicationId: `APP-${Date.now()}`,
        items: cart.items,
        contact: checkoutData.contact,
        address: checkoutData.address,
        payment: { ...checkoutData.payment, paymentMethod: "service_application" },
        pricing: {
          subtotal,
          videoDiscount,
          tax,
          total,
        },
        status: "application_submitted",
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("serviceApplication", JSON.stringify(applicationData))

      toast({
        title: "Application Submitted! 📋",
        description: "We'll review your request and contact you within 24 hours.",
        variant: "default",
      })

      // Redirect to success page with application type
      window.location.href = "/success?type=application"
    } catch (error: any) {
      console.error("Error submitting application:", error)
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review Your Service Application
        </CardTitle>
        <CardDescription>Please review your service request before submitting your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Service Request Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Requested Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">Service Request</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.quantity} × {formatCurrency(item.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Est. {formatCurrency(item.price * item.quantity)}
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
                <strong>
                  {checkoutData.contact.firstName} {checkoutData.contact.lastName}
                </strong>
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
                Service Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                {checkoutData.address.street}
                {checkoutData.address.apartment && <>, {checkoutData.address.apartment}</>}
                <br />
                {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}
              </div>
              {checkoutData.address.specialInstructions && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Special Instructions:</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{checkoutData.address.specialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Estimated Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estimated Pricing</CardTitle>
              <CardDescription>Final pricing will be confirmed in your personalized quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Estimated Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {videoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Video Recording Discount</span>
                  <span>-{formatCurrency(videoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Estimated Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                * This is an estimate. Final pricing will be provided in your personalized quote.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Process Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">What happens after you apply?</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• We'll review your service request within 24 hours</li>
                    <li>• You'll receive a personalized quote via email, text, or phone call</li>
                    <li>• We'll schedule a convenient time for your cleaning service</li>
                    <li>• Payment will be processed after service confirmation</li>
                    <li>• You'll receive an invoice with final pricing and payment options</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Video Recording Consent */}
        {checkoutData.payment.allowVideoRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Video Recording Consent</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      You've agreed to video recording during service (10% discount applied to estimate)
                    </p>
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
          <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Address
          </Button>

          <Button
            onClick={handleSubmitApplication}
            size="default"
            className="px-8 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Service Application
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </motion.div>
  )
}
