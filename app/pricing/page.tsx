"use client"

import { useState } from "react"
import { PricingContent } from "@/components/pricing-content"
import { PriceCalculator } from "@/components/price-calculator"
import { FloatingCartSummary } from "@/components/floating-cart-summary" // Import the new component

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("tiers")
  const [initialSelectedRooms, setInitialSelectedRooms] = useState<Record<string, number>>({})
  const [initialServiceType, setInitialServiceType] = useState<"essential" | "premium" | "luxury">("essential") // Updated type

  // This function is passed to PricingContent and then to PriceCalculator.
  // The PriceCalculator component handles adding items to the cart internally
  // using the useCart hook, so we don't need to explicitly handle onSelectTier here
  // for cart updates.
  const handleSelectTier = (roomType: string, tierId: string) => {
    // This function is primarily for passing down to PriceCalculator
    // PriceCalculator will handle the actual state updates and cart additions
    console.log(`Selected tier ${tierId} for room ${roomType}`)
  }

  // This function will be called by PriceCalculator when calculation is complete
  const handleCalculationComplete = (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "essential" | "premium" | "luxury"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
  }) => {
    console.log("Price calculation complete:", data)
    // Here you can use the calculated data, e.g., update a summary,
    // store it in context, or trigger other actions.
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
              Flexible Cleaning Plans
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choose from our pre-defined packages or build your own custom plan.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* The PricingContent component is for displaying the package and individual room options */}
            <PricingContent onSelectTier={handleSelectTier} />
            {/* The PriceCalculator component is for the interactive building of the custom plan */}
            <PriceCalculator
              initialSelectedRooms={initialSelectedRooms}
              initialServiceType={initialServiceType}
              onCalculationComplete={handleCalculationComplete}
            />
          </div>
        </div>
      </main>
      {/* Add the floating cart summary */}
      <FloatingCartSummary />
    </div>
  )
}
