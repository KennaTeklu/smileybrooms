"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FixedFooter() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <a
              href="tel:6028000605"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">602-800-0605</span>
            </a>
            <a
              href="mailto:info@smileybrooms.com"
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              <Mail className="h-4 w-4 mr-1" />
              <span>info@smileybrooms.com</span>
            </a>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/contact"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Contact</span>
            </Link>
            <Link
              href="/careers"
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Careers
            </Link>
            <Link
              href="/pricing"
              className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed bottom-20 right-4 rounded-full transition-all duration-300 opacity-0 pointer-events-none",
          showScrollTop && "opacity-100 pointer-events-auto",
        )}
        onClick={scrollToTop}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  )
}
