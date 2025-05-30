"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Sparkles, Star, Zap, Leaf, Shield, Heart } from "lucide-react"
import { Cart } from "@/components/cart"
import { useCart } from "@/lib/cart-context" // Import useCart

interface FeatureProps {
  children: React.ReactNode
}

const Feature = ({ children }: FeatureProps) => (
  <li className="flex items-center gap-2">
    <Check className="h-4 w-4 text-green-500" />
    <span className="text-gray-600 dark:text-gray-400">{children}</span>
  </li>
)

export function PricingContent() {
  const [selectedPlan, setSelectedPlan] = useState("standard")
  const { cart } = useCart() // Use the cart context

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-50">
          Flexible Cleaning Plans for Every Need
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Choose the perfect plan that fits your lifestyle and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <Card className="flex flex-col justify-between border-2 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Basic Clean</CardTitle>
            <CardDescription className="text-center mt-2">Ideal for regular upkeep</CardDescription>
            <div className="text-center mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">$99</span>
              <span className="text-gray-500 dark:text-gray-400">/visit</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <Feature>Dusting all surfaces</Feature>
              <Feature>Vacuuming and mopping floors</Feature>
              <Feature>Bathroom cleaning (toilet, sink, mirror)</Feature>
              <Feature>Kitchen surface wipe-down</Feature>
              <Feature>Trash removal</Feature>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                <X className="h-4 w-4 text-red-500" />
                <span>Deep cleaning options</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                <X className="h-4 w-4 text-red-500" />
                <span>Appliance cleaning</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full" variant="outline" onClick={() => handleSelectPlan("basic")}>
              Select Basic
            </Button>
          </CardFooter>
        </Card>

        {/* Standard Plan */}
        <Card className="relative flex flex-col justify-between border-2 border-blue-500 shadow-lg dark:border-blue-600">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold uppercase text-white dark:bg-blue-600">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Standard Clean</CardTitle>
            <CardDescription className="text-center mt-2">Comprehensive cleaning for busy homes</CardDescription>
            <div className="text-center mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">$149</span>
              <span className="text-gray-500 dark:text-gray-400">/visit</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <Feature>All Basic features</Feature>
              <Feature>Detailed bathroom cleaning (grout, fixtures)</Feature>
              <Feature>Kitchen deep clean (sink, counters, exterior appliances)</Feature>
              <Feature>Baseboard wiping</Feature>
              <Feature>Window sills and blinds dusting</Feature>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                <X className="h-4 w-4 text-red-500" />
                <span>Interior window cleaning</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                <X className="h-4 w-4 text-red-500" />
                <span>Carpet shampooing</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full" onClick={() => handleSelectPlan("standard")}>
              Select Standard
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="flex flex-col justify-between border-2 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Premium Clean</CardTitle>
            <CardDescription className="text-center mt-2">The ultimate spotless experience</CardDescription>
            <div className="text-center mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">$199</span>
              <span className="text-gray-500 dark:text-gray-400">/visit</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <Feature>All Standard features</Feature>
              <Feature>Interior window cleaning</Feature>
              <Feature>Appliance interior cleaning (microwave, oven, fridge)</Feature>
              <Feature>Cabinet exterior wipe-down</Feature>
              <Feature>Wall spot cleaning</Feature>
              <Feature>Carpet vacuuming with edge cleaning</Feature>
              <Feature>Air freshening and deodorizing</Feature>
            </ul>
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full" variant="outline" onClick={() => handleSelectPlan("premium")}>
              Select Premium
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Add-on Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center p-6 text-center">
            <Sparkles className="h-10 w-10 text-yellow-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Deep Carpet Cleaning</CardTitle>
            <CardDescription className="mb-4">Revitalize your carpets with a thorough wash.</CardDescription>
            <Button variant="outline" className="w-full">
              Add for $50
            </Button>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Star className="h-10 w-10 text-purple-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Window Washing (Interior/Exterior)</CardTitle>
            <CardDescription className="mb-4">Sparkling clean windows for a brighter home.</CardDescription>
            <Button variant="outline" className="w-full">
              Add for $40
            </Button>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Zap className="h-10 w-10 text-orange-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Upholstery Cleaning</CardTitle>
            <CardDescription className="mb-4">Refresh your furniture with professional care.</CardDescription>
            <Button variant="outline" className="w-full">
              Add for $60
            </Button>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Leaf className="h-10 w-10 text-green-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Eco-Friendly Products</CardTitle>
            <CardDescription className="mb-4">Green cleaning for a healthier home.</CardDescription>
            <Button variant="outline" className="w-full">
              Add for $15
            </Button>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Shield className="h-10 w-10 text-indigo-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Disinfection Service</CardTitle>
            <CardDescription className="mb-4">Eliminate germs and bacteria for peace of mind.</CardDescription>
            <Button variant="outline" className="w-full">
              Add for $30
            </Button>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Heart className="h-10 w-10 text-red-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Post-Construction Clean-up</CardTitle>
            <CardDescription className="mb-4">Thorough cleaning after renovations.</CardDescription>
            <Button variant="outline" className="w-full">
              Request Quote
            </Button>
          </Card>
        </div>
      </div>

      {cart.totalItems > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Cart showLabel={true} />
        </div>
      )}
    </div>
  )
}
