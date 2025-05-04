"use client"

import { useState, useEffect } from "react"
import { motion, useSpring, AnimatePresence } from "framer-motion"
import { CalendarCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function BookNowButton() {
  const [scrollY, setScrollY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Smooth scroll position with spring physics
  const smoothScrollY = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  // Track scroll position with smooth animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      smoothScrollY.set(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [smoothScrollY])

  return (
    <motion.div
      className="fixed right-4 z-40"
      style={{
        bottom: 20,
        opacity: scrollY > 100 ? 1 : 0.8,
        scale: scrollY > 100 ? 1 : 0.95,
        transition: "opacity 0.3s ease, scale 0.3s ease",
      }}
    >
      <Link href="/pricing">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          {/* Pulsing background effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-md"
              />
            )}
          </AnimatePresence>

          <Button
            size="lg"
            className={cn(
              "rounded-full shadow-lg relative z-10",
              "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-6",
              "border-2 border-white/20",
              "transition-all duration-300",
            )}
          >
            <CalendarCheck
              className={cn("mr-2 h-5 w-5", "transition-transform duration-300", isHovered ? "scale-110" : "scale-100")}
            />
            <span>Book Now</span>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  )
}
