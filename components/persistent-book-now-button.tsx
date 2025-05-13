"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar } from "lucide-react"

export function PersistentBookNowButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <Button asChild size="lg" className="shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/pricing" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              See Pricing
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
