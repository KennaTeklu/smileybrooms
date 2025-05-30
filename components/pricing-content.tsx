"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"
import { useCart } from "@/lib/cart-context" // Import useCart

export function PricingContent() {
  const { addToCart } = useCart() // Use addToCart from context

  const handleAddToCart = (planName: string, price: number) => {
    addToCart({ id: planName.toLowerCase().replace(/\s/g, "-"), name: planName, price }, 1)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Flexible Pricing Plans</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Choose the perfect cleaning plan that fits your needs and budget.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Basic Clean</CardTitle>
              <p className="text-2xl font-bold">$99</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Perfect for small homes</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>2 hours of cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Dusting and vacuuming</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Bathroom and kitchen wipe-down</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart("Basic Clean", 99)}>
                Select Plan
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deep Clean</CardTitle>
              <p className="text-2xl font-bold">$149</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">For a thorough refresh</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>4 hours of cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Everything in Basic Clean</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Floor scrubbing and sanitization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Appliance exterior cleaning</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart("Deep Clean", 149)}>
                Select Plan
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium Clean</CardTitle>
              <p className="text-2xl font-bold">$199</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ultimate spotless experience</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>6 hours of cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Everything in Deep Clean</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Window interior cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Cabinet and drawer organization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Laundry service (wash & fold)</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart("Premium Clean", 199)}>
                Select Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
