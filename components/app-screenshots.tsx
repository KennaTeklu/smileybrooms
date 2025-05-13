"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Screenshot {
  src: string
  alt: string
  caption: string
}

export default function AppScreenshots() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const screenshots: Screenshot[] = [
    {
      src: "/cleaning-app-home.png",
      alt: "SmileyBrooms app home screen",
      caption: "Browse cleaning services right from the home screen",
    },
    {
      src: "/mobile-booking-calendar.png",
      alt: "SmileyBrooms app booking screen",
      caption: "Easy scheduling with our intuitive booking system",
    },
    {
      src: "/mobile-app-service-details.png",
      alt: "SmileyBrooms app service details",
      caption: "Detailed information about each cleaning service",
    },
    {
      src: "/mobile-app-profile-settings.png",
      alt: "SmileyBrooms app profile screen",
      caption: "Manage your profile and preferences",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 p-4 shadow-lg">
        <div className="relative aspect-[9/16] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src={screenshots[currentIndex].src || "/placeholder.svg"}
                alt={screenshots[currentIndex].alt}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-lg">
                <p className="text-sm">{screenshots[currentIndex].caption}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-700"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-700"
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index ? "bg-primary w-4" : "bg-gray-300 dark:bg-gray-600",
              )}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
