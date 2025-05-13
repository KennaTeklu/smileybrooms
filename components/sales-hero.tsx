"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Star, Calendar, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const trustBadges = [
  { icon: Star, text: "4.9/5 Rating" },
  { icon: Calendar, text: "Easy Scheduling" },
  { icon: Clock, text: "On-Time Service" },
  { icon: Shield, text: "100% Satisfaction" },
]

const benefits = [
  "Professional, background-checked cleaners",
  "Eco-friendly cleaning products",
  "Flexible scheduling options",
  "Satisfaction guarantee",
  "No contracts required",
]

export function SalesHero() {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = ["/sparkling-clean-home.png", "/sparkling-home-service.png", "/professional-cleaning-service.png"]

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 pt-24 pb-16">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-pattern" />
      </div>

      {/* Animated background shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-100 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
              Limited Time Offer: 20% Off First Cleaning
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400">smileybroom</span> makes your home sparkle
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              Professional cleaning services tailored to your needs, schedule, and budget. Book in 60 seconds.
            </p>

            {/* Benefits list - Simplified */}
            <div className="space-y-3">
              {benefits.slice(0, 3).map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="ml-3 text-base text-gray-600 dark:text-gray-300">{benefit}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons - Primary focus on pricing */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link href="/pricing">
                  See Pricing
                  <motion.span animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="border-indigo-200 dark:border-indigo-800">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center">
                  <badge.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-1.5" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[currentImageIndex] || "/placeholder.svg"}
                    alt="Professional cleaning service"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Testimonial card - Social proof */}
              <Card className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        "smileybroom cleaners were professional, thorough, and friendly. My home has never looked
                        better!"
                      </p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white mt-2">
                        — Sarah J., Happy Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="currentColor"
            fillOpacity="1"
            className="text-white dark:text-gray-950"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}
