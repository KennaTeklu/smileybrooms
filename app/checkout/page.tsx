import { Cart } from "@/components/cart"
import { SalesCheckoutButton } from "@/components/sales-checkout-button"
import { AddressCollectionModal } from "@/components/address-collection-modal"
import { StripeIntegration } from "@/components/stripe-integration"
import { PageViewTracker } from "@/components/page-view-tracker"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <PageViewTracker pageName="checkout" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 border-primary-200 text-primary-700 dark:border-primary-800 dark:text-primary-400"
            >
              Checkout
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Complete Your Booking</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              You're just a few steps away from a cleaner, happier home
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8 border-0 shadow-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-primary-500" />
                    Your Cart
                  </CardTitle>
                  <CardDescription>Review your selected services</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Cart />
                </CardContent>
              </Card>

              <Card className="mb-8 border-0 shadow-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary-500" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription>Where should we provide our services?</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <AddressCollectionModal />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-primary-500" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Secure payment processing by Stripe</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <StripeIntegration />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Complete your purchase</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <SalesCheckoutButton />
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Why Choose SmileyBrooms?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">100% Satisfaction Guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Secure Payment Processing</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Professional, Background-Checked Cleaners
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Easy Rescheduling & Cancellation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
