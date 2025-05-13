"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { SERVICES } from "@/lib/constants"

export function SalesPricing() {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly")
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const handleFrequencyChange = () => {
    setFrequency(frequency === "monthly" ? "yearly" : "monthly")
  }

  // Use the original service prices from constants
  const standardService = SERVICES.find((s) => s.id === "standard-cleaning")
  const deepService = SERVICES.find((s) => s.id === "deep-cleaning")
  const moveService = SERVICES.find((s) => s.id === "move-in-out")

  const plans = [
    {
      id: "standard-cleaning",
      name: standardService?.name || "Standard Cleaning",
      description: standardService?.description || "Regular cleaning service for maintained homes",
      price: {
        monthly: standardService?.price || 120,
        yearly: (standardService?.price || 120) * 12 * 0.9, // 10% discount for yearly
      },
      features: standardService?.features.map((feature) => ({ text: feature, included: true })) || [],
      cta: "Book Standard",
    },
    {
      id: "deep-cleaning",
      name: deepService?.name || "Deep Cleaning",
      description: deepService?.description || "Thorough cleaning for homes needing extra attention",
      price: {
        monthly: deepService?.price || 220,
        yearly: (deepService?.price || 220) * 12 * 0.85, // 15% discount for yearly
      },
      features: deepService?.features.map((feature) => ({ text: feature, included: true })) || [],
      popular: true,
      badge: "Most Popular",
      cta: "Book Deep Cleaning",
    },
    {
      id: "move-in-out",
      name: moveService?.name || "Move In/Out Cleaning",
      description: moveService?.description || "Comprehensive cleaning for moving transitions",
      price: {
        monthly: moveService?.price || 320,
        yearly: (moveService?.price || 320) * 12 * 0.8, // 20% discount for yearly
      },
      features: moveService?.features.map((feature) => ({ text: feature, included: true })) || [],
      cta: "Book Move In/Out",
    },
  ]

  // Calculate savings
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12
    const yearlyCost = yearly
    const savings = monthlyCost - yearlyCost
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { savings, percentage }
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400"
          >
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect cleaning plan for your home
          </p>

          {/* Billing frequency toggle */}
          <div className="flex items-center justify-center mt-8">
            <span
              className={`text-sm ${frequency === "monthly" ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}
            >
              One-time
            </span>
            <div className="mx-4">
              <Switch
                checked={frequency === "yearly"}
                onCheckedChange={handleFrequencyChange}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <span
              className={`text-sm ${frequency === "yearly" ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}
            >
              Recurring
            </span>
            {frequency === "yearly" && (
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const { savings, percentage } = calculateSavings(plan.price.monthly, plan.price.yearly)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <Card
                  className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
                    plan.popular
                      ? "border-indigo-400 dark:border-indigo-600 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 shadow-md"
                  } ${hoveredPlan === plan.id ? "transform -translate-y-1 shadow-xl" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-indigo-500 text-white py-1 px-10 text-xs font-semibold">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className={`pb-4 ${plan.popular ? "bg-indigo-50 dark:bg-indigo-900/20" : ""}`}>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="mt-2 mb-6">
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${frequency === "monthly" ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                        <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                          {frequency === "monthly" ? "/service" : "/month"}
                        </span>
                      </p>

                      {frequency === "yearly" && (
                        <div className="mt-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                            Save ${savings} ({percentage}%) per year
                          </Badge>
                        </div>
                      )}

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {frequency === "monthly" ? "One-time service" : "Recurring service with discount"}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      className={`w-full group ${
                        plan.popular
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-indigo-400 dark:border-indigo-800"
                      }`}
                    >
                      <Link href={`/pricing?plan=${plan.id}&billing=${frequency}`}>
                        {plan.cta}
                        <ArrowRight
                          className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                            hoveredPlan === plan.id ? "group-hover:translate-x-1" : ""
                          }`}
                        />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Have questions about our pricing or services?</p>
          <Button
            variant="outline"
            asChild
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-gray-800"
          >
            <Link href="/faq">View Frequently Asked Questions</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
