"use client"

import { useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"
import { CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BookNowButton() {
  const [scrollY, setScrollY] = useState(0)

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
      className="fixed right-4 z-40 rounded-full"
      style={{
        bottom: 20,
        opacity: scrollY > 100 ? 1 : 0.8,
        scale: scrollY > 100 ? 1 : 0.95,
        transition: "opacity 0.3s ease, scale 0.3s ease",
      }}
      // Add pulsating border animation
      animate={{
        boxShadow: [
          "0 0 0px 0px rgba(59, 130, 246, 0)", // Start: no shadow, transparent blue
          "0 0 0px 6px rgba(59, 130, 246, 0.7)", // Pulse out: blue-600 with opacity
          "0 0 0px 0px rgba(59, 130, 246, 0)", // End: no shadow, transparent blue
        ],
      }}
      transition={{
        duration: 1.5, // Duration of one pulse cycle
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY, // Repeat indefinitely
        repeatType: "loop",
      }}
    >
      <Link href="/pricing">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-6"
        >
          <CalendarCheck className="mr-2 h-5 w-5" />
          Book Now
        </Button>
      </Link>
    </motion.div>
  )
}
