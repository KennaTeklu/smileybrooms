"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MinimalHero() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-light dark:bg-grid-pattern-dark" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            <span className="block">Professional Cleaning</span>
            <span className="block text-blue-600 dark:text-blue-400">That Makes You Smile</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            Experience the joy of coming home to a perfectly clean space. Our professional cleaning services are
            designed to exceed your expectations and brighten your day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => router.push("/calculator")}
            >
              Get Started
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-6 text-lg rounded-full"
              onClick={() => router.push("/pricing")}
            >
              View Pricing
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex -space-x-1 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span>
              <span className="font-medium">4.9/5</span> from over <span className="font-medium">2,000+</span> happy
              customers
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
