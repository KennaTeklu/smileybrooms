"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"

export default function Hero() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const scrollToSelections = () => {
    const selectionsElement = document.getElementById("service-selections")
    if (selectionsElement) {
      selectionsElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 800 800">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col justify-center">
            <motion.div
              className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              variants={itemVariants}
            >
              <span className="mr-2 rounded-full bg-primary h-2 w-2" />
              Professional Cleaning Services
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              You rest, we take care of the rest!
            </motion.h1>

            <motion.p className="mb-8 text-lg text-gray-600 dark:text-gray-400" variants={itemVariants}>
              Experience the joy of coming home to a perfectly clean space. Our professional cleaning services are
              tailored to your needs, schedule, and budget.
            </motion.p>

            <motion.div
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              variants={itemVariants}
            >
              <Button size="lg" className="text-base group" onClick={scrollToSelections}>
                Book New Services
                <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
              <Button variant="outline" size="lg" className="text-base" onClick={() => setShowWaitlist(true)}>
                Join Waitlist
              </Button>
            </motion.div>

            <motion.div ref={statsRef} className="mt-12 grid grid-cols-3 gap-4 text-center" variants={itemVariants}>
              {statsInView && (
                <>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">
                      <CountUp end={500} suffix="+" duration={2.5} />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Happy Clients</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">
                      <CountUp end={98} suffix="%" duration={2.5} />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">
                      <CountUp end={24} suffix="/7" duration={2.5} />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Support</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <motion.div className="flex items-center justify-center lg:justify-end" variants={itemVariants}>
            <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/placeholder.svg?key=wsf59"
                alt="Professional cleaning service"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <div className="mb-2 text-sm font-medium">Featured Service</div>
                <h3 className="mb-1 text-xl font-bold">Deep Home Cleaning</h3>
                <p className="mb-3 text-sm opacity-90">
                  A thorough cleaning of your entire home, from ceiling to floor.
                </p>
                <Button size="sm" variant="secondary" onClick={scrollToSelections}>
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
