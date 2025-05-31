"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { UnifiedFloatingWrapper } from "@/components/unified-floating-wrapper"
import { FLOATING_LAYERS } from "@/lib/floating-system"

export function PersistentBookNowButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  // Hide button on pricing page
  const shouldShow = pathname !== "/pricing" && pathname !== "/calculator"

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  if (!shouldShow) return null

  return (
    <UnifiedFloatingWrapper
      id="persistent-book-now-button"
      elementHeight={60}
      config={{
        layer: FLOATING_LAYERS.BOOK_NOW_BUTTON,
        position: "right",
        offset: { bottom: 20, right: 20 },
        behavior: {
          hideOnScroll: true,
          persistAcrossPages: true,
        },
        animation: {
          entrance: "scale",
          exit: "scale",
          duration: 300,
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
    </UnifiedFloatingWrapper>
  )
}
