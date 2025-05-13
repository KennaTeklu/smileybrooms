"use client"

import { motion } from "framer-motion"
import { Calendar, Sparkles, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: "Book Online",
      description: "Select your service and schedule in just 60 seconds",
      color: "bg-blue-500",
    },
    {
      icon: Home,
      title: "We Clean",
      description: "Our professional team arrives and transforms your space",
      color: "bg-indigo-500",
    },
    {
      icon: Sparkles,
      title: "Enjoy",
      description: "Relax in your fresh, spotless home - satisfaction guaranteed",
      color: "bg-purple-500",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400"
          >
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How smileybroom works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Getting your home cleaned has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4`}
                >
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-800 transform -translate-x-1/2">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-t-2 border-r-2 border-gray-200 dark:border-gray-800"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
