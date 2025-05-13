"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

// Define the SERVICES constant here to avoid import issues
const SERVICES = [
  {
    id: "standard-cleaning",
    name: "Standard Cleaning",
    description: "Regular cleaning service for maintained homes",
    price: 120,
    image: "/sparkling-clean-home.png",
    features: ["Dusting all accessible surfaces", "Vacuuming carpets and floors", "Mopping hard floors"],
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    description: "Thorough cleaning for homes needing extra attention",
    price: 220,
    image: "/deep-cleaning-tools.png",
    features: ["All standard cleaning services", "Inside cabinet cleaning", "Inside oven and refrigerator"],
  },
  {
    id: "move-in-out",
    name: "Move In/Out Cleaning",
    description: "Comprehensive cleaning for moving transitions",
    price: 320,
    image: "/moving-cleaning.png",
    features: ["All deep cleaning services", "Inside all cabinets and drawers", "Closet cleaning"],
  },
]

export function ServiceShowcase() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Professional Cleaning Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose the perfect service for your home
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.id} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 w-full relative">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
                {service.id === "deep-cleaning" && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white">Most Popular</Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-indigo-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <div className="text-xl font-bold">${service.price}</div>
                <Button asChild>
                  <Link href={`/pricing?service=${service.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/pricing" className="flex items-center">
              View All Services & Pricing
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
