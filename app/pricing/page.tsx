"use client"

import { useEffect } from "react"
import { useRoomContext } from "@/lib/room-context"
import { PriceCalculator } from "@/components/price-calculator"
import { RoomCategory } from "@/components/room-category"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Home, Calendar } from "lucide-react"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { HowItWorks } from "@/components/how-it-works"
import { CallToAction } from "@/components/call-to-action"
import { ServiceComparisonTable } from "@/components/service-comparison-table"

export default function PricingPage() {
  const { resetRoomCounts } = useRoomContext()

  useEffect(() => {
    // Reset room counts when the pricing page mounts
    resetRoomCounts()
  }, [resetRoomCounts])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Transparent Pricing, Exceptional Clean
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300 mt-4">
              Get an instant quote for your cleaning needs. No hidden fees, just sparkling results.
            </p>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Customize Your Cleaning Service
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Select your rooms, choose your cleaning level, and pick a frequency that fits your lifestyle.
                </p>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        Room Selection
                      </CardTitle>
                      <CardDescription>Choose the rooms you&apos;d like us to clean.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoomCategory
                        title="Core Rooms"
                        description="Essential spaces for a clean home."
                        rooms={["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom"]}
                        variant="primary"
                      />
                      <RoomCategory
                        title="Additional Spaces"
                        description="Expand your clean to other areas."
                        rooms={["homeOffice", "laundryRoom", "entryway", "hallway", "stairs"]}
                        variant="secondary"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Cleaning Frequency
                      </CardTitle>
                      <CardDescription>How often would you like us to clean?</CardDescription>
                    </CardHeader>
                    <CardContent>{/* Frequency selection is now handled within PriceCalculator */}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Cleanliness Level
                      </CardTitle>
                      <CardDescription>How dirty is your space?</CardDescription>
                    </CardHeader>
                    <CardContent>{/* Cleanliness level is now handled within PriceCalculator */}</CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <PriceCalculator />
              </div>
            </div>
          </div>
        </section>

        <ServiceComparisonTable />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  )
}
