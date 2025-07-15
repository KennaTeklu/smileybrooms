"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, DollarSign, Home } from "lucide-react"
import { motion } from "framer-motion"

interface TimelineStep {
  icon: React.ElementType
  title: string
  description: string
}

const timelineSteps: TimelineStep[] = [
  {
    icon: Calendar,
    title: "Book Your Service",
    description: "Select your desired cleaning service, date, and time through our easy-to-use online platform.",
  },
  {
    icon: Home,
    title: "We Arrive & Clean",
    description:
      "Our professional, vetted cleaners arrive on schedule with all necessary supplies to transform your space.",
  },
  {
    icon: DollarSign,
    title: "Secure Payment",
    description: "Complete your payment securely online or in person after the service is rendered.",
  },
  {
    icon: CheckCircle,
    title: "Enjoy Your Clean Home",
    description: "Relax and enjoy your sparkling clean, fresh-smelling home or office!",
  },
]

export default function BookingTimeline() {
  const [activeStep, setActiveStep] = useState(0) // For potential future interactive features

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="relative flex flex-col items-center">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-800 hidden md:block"></div>

          {timelineSteps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            const isLast = index === timelineSteps.length - 1

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center w-full md:w-3/4 lg:w-2/3 mb-12 md:mb-16 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0 p-4 rounded-full bg-blue-600 text-white z-10 shadow-lg">
                  <Icon className="h-8 w-8" />
                </div>

                {/* Card Content */}
                <Card
                  className={`w-full md:w-[calc(50%-30px)] shadow-lg ${
                    isEven ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"
                  } mt-8 md:mt-0`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
