"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollAwareWrapper } from "@/components/scroll-aware-wrapper"

export function PersistentBookNowButton() {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Hide button on pricing page
  const shouldShow = pathname !== "/pricing" && pathname !== "/calculator"

  if (!shouldShow) return null

  return (
    <ScrollAwareWrapper
      side="right"
      elementHeight={60}
      config={{
        continuousMovement: {
          enabled: true,
          startPosition: 35, // Start higher than cart
          endPosition: 70, // End higher than cart
          minDistanceFromBottom: 100,
        },
      }}
      onVisibilityChange={setIsVisible}
    >
      <AnimatePresence>
        {isVisible && (
          <Link href="/pricing">
            <Button
              size="lg"
              className={cn(
                "rounded-full shadow-lg px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600",
                "hover:from-blue-700 hover:to-indigo-700 transition-all duration-300",
                "group flex items-center gap-2",
              )}
            >
              <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Book Now</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          </Link>
        )}
      </AnimatePresence>
    </ScrollAwareWrapper>
  )
}
