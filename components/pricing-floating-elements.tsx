"use client"

import { useEffect, useState } from "react"
import { ScrollAwareWrapper } from "@/components/scroll-aware-wrapper"
import { Button } from "@/components/ui/button"
import { ShoppingCart, HelpCircle } from "lucide-react"
import Link from "next/link"

export function PricingFloatingElements() {
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Help Button */}
      <ScrollAwareWrapper
        side="right"
        elementHeight={60}
        config={{
          continuousMovement: {
            enabled: true,
            startPosition: 30,
            endPosition: 60,
            minDistanceFromBottom: 100,
          },
        }}
      >
        <Button
          size="lg"
          variant="outline"
          className="rounded-full shadow-md bg-white hover:bg-gray-50 border-gray-200"
        >
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <span className="ml-2 text-gray-800">Need Help?</span>
        </Button>
      </ScrollAwareWrapper>

      {/* Cart Button */}
      <ScrollAwareWrapper
        side="right"
        elementHeight={60}
        config={{
          continuousMovement: {
            enabled: true,
            startPosition: 45,
            endPosition: 75,
            minDistanceFromBottom: 160,
          },
          offset: {
            right: 20,
            bottom: 80,
          },
        }}
      >
        <Link href="/cart">
          <Button
            size="lg"
            className="rounded-full shadow-lg px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="font-medium">View Cart</span>
          </Button>
        </Link>
      </ScrollAwareWrapper>
    </>
  )
}
