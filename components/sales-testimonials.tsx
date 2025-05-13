"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Define the testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    location: "Phoenix, AZ",
    rating: 5,
    content:
      "The cleaning team was professional, thorough, and friendly. My home has never looked better! I've tried other services before, but SmileyBrooms is in a league of its own.",
    image: "/woman-portrait.png",
    service: "Regular Cleaning",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    location: "Seattle, WA",
    rating: 5,
    content:
      "We've been using their services for our office for over a year now. Always reliable and excellent quality. Our employees love coming to a clean workspace every day.",
    image: "/thoughtful-man-portrait.png",
    service: "Office Cleaning",
  },
  {
    id: 3,
    name: "Robert Williams",
    role: "Property Manager",
    location: "Chicago, IL",
    rating: 4,
    content:
      "Great service for our rental properties. Tenants are always happy with the move-in condition. The attention to detail makes a huge difference in tenant satisfaction.",
    image: "/confident-businessman.png",
    service: "Move In/Out Cleaning",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Working Professional",
    location: "Miami, FL",
    rating: 5,
    content:
      "As a busy professional, having a clean home without the stress is priceless. Highly recommend! The booking process is so easy, and the results are consistently excellent.",
    image: "/professional-woman.png",
    service: "Deep Cleaning",
  },
]

export function SalesTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-primary-200 text-primary-700 dark:border-primary-800 dark:text-primary-400"
          >
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Testimonial carousel */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Testimonial image */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={TESTIMONIALS[activeIndex].image || "/placeholder.svg"}
                      alt={TESTIMONIALS[activeIndex].name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < TESTIMONIALS[activeIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-lg font-semibold">{TESTIMONIALS[activeIndex].name}</p>
                      <p className="text-sm opacity-90">
                        {TESTIMONIALS[activeIndex].role} • {TESTIMONIALS[activeIndex].location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial content */}
                <Card className="w-full md:w-2/3 border-0 shadow-lg relative">
                  <CardContent className="p-8">
                    <Quote className="absolute top-6 left-6 h-12 w-12 text-primary-100 dark:text-primary-900/30" />
                    <div className="relative">
                      <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50">
                        {TESTIMONIALS[activeIndex].service}
                      </Badge>
                      <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 relative z-10">
                        "{TESTIMONIALS[activeIndex].content}"
                      </p>
                      <div className="flex items-center">
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {TESTIMONIALS[activeIndex].name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {TESTIMONIALS[activeIndex].role}, {TESTIMONIALS[activeIndex].location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            className="rounded-full h-10 w-10 border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400 dark:hover:border-primary-800"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            className="rounded-full h-10 w-10 border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400 dark:hover:border-primary-800"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-primary-500"
                    : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-primary-300 dark:hover:bg-primary-800"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust metrics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">4.9/5</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Average Rating</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">1,200+</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Happy Customers</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">15,000+</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Cleanings Completed</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">98%</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
