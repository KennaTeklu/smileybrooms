"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Award, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Features() {
  const features = [
    {
      icon: Shield,
      name: "Professional Staff",
      description: "Background-checked, trained professionals who take pride in their work.",
    },
    {
      icon: Clock,
      name: "Flexible Scheduling",
      description: "Book a time that works for you, including evenings and weekends.",
    },
    {
      icon: Award,
      name: "Satisfaction Guarantee",
      description: "If you're not happy with our service, we'll make it right.",
    },
    {
      icon: Sparkles,
      name: "Premium Cleaning",
      description: "We use high-quality, eco-friendly products for a superior clean.",
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
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            The smileybroom difference
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're committed to providing the best cleaning experience possible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
