"use client"

import { Suspense } from "react"
import AdvancedCartSystem from "@/components/advanced-cart-system"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import ErrorBoundary from "@/components/error-boundary"
import LoadingAnimation from "@/components/loading-animation"

export default function AdvancedCartPage() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Shopping Cart System</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience our next-generation cart with advanced features, seamless checkout, and intelligent
                  recommendations powered by modern web technologies.
                </p>
              </div>

              <div className="flex justify-center">
                <Suspense fallback={<LoadingAnimation />}>
                  <AdvancedCartSystem />
                </Suspense>
              </div>

              {/* Feature highlights */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Optimized performance with advanced caching and virtualization</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Secure Checkout</h3>
                  <p className="text-gray-600">Bank-grade security with biometric authentication support</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Features</h3>
                  <p className="text-gray-600">AI-powered recommendations and intelligent pricing</p>
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </ErrorBoundary>
  )
}
