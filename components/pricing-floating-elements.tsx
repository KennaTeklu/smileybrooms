"use client"

import { useEffect, useState } from "react"
import { ScrollAwareWrapper } from "@/components/scroll-aware-wrapper"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

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

      {/* The AddAllToCartModal will handle the dynamic cart button */}
    </>
  )
}
