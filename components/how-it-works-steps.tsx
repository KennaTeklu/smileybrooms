"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, Calendar, UserCheck, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

export default function HowItWorksSteps() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const steps: Step[] = [
    {
      number: "01",
      title: "Calculate Your Price",
      description: "Use our easy price calculator to get an instant quote based on your specific cleaning needs.",
      icon: <Calculator className="h-8 w-8" />,
    },
    {
      number: "02",
      title: "Book Your Service",
      description: "Select a date and time that works for you and provide your address and access details.",
      icon: <Calendar className="h-8 w-8" />,
    },
    {
      number: "03",
      title: "Get Matched",
      description: "We'll match you with a professional cleaner who specializes in your requested services.",
      icon: <UserCheck className="h-8 w-8" />,
    },
    {
      number: "04",
      title: "Enjoy a Clean Space",
      description: "Relax while our professionals clean your space to perfection, with a 100% satisfaction guarantee.",
      icon: <Home className="h-8 w-8" />,
    },
  ]

  // Auto-play through steps
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, steps.length])

  // Pause auto-play when user interacts
  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsAutoPlaying(false)
  }

  // Resume auto-play after 10 seconds of inactivity
  useEffect(() => {
    if (isAutoPlaying) return

    const timeout = setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)

    return () => clearTimeout(timeout)
  }, [isAutoPlaying])

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our simple 4-step process makes it easy to get your space cleaned by professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Step Visualization */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {steps[activeStep].icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-primary">{steps[activeStep].number}</span>
                          <h3 className="text-xl font-semibold">{steps[activeStep].title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{steps[activeStep].description}</p>

                        {activeStep === 0 && (
                          <Button asChild className="mt-4" size="sm">
                            <a href="/pricing">Calculate Price Now</a>
                          </Button>
                        )}

                        {activeStep === 1 && (
                          <Button asChild className="mt-4" size="sm">
                            <a href="/services">View Services</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Navigation */}
          <div className="order-1 lg:order-2">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4",
                    activeStep === index
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      activeStep === index ? "bg-primary text-white" : "bg-gray-300 dark:bg-gray-600",
                    )}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                  </div>
                  {activeStep === index && (
                    <ArrowRight className="ml-auto flex-shrink-0 h-5 w-5 text-primary self-center" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
