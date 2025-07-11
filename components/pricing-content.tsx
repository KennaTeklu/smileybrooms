"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { roomDisplayNames, getRoomTiers } from "@/lib/room-tiers"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface PricingContentProps {
  onSelectTier: (roomType: string, tierId: string) => void
}

// Data for Full House Packages (copied from price-calculator for consistency)
const fullHousePackages = [
  {
    id: "essential-full-house",
    name: "Essential Full House Clean",
    description: "Basic cleaning for your entire home - perfect for maintenance cleaning",
    originalPrice: 1620,
    basePrice: 1458, // Discounted price from guide
    includedRooms: ["3 Bedrooms", "2 Bathrooms", "1 Kitchen", "1 Living Room", "1 Dining Room", "1 Entryway"],
    tier: "essential",
  },
  {
    id: "premium-full-house",
    name: "Premium Full House Clean",
    description: "Thorough cleaning with attention to detail for every room",
    originalPrice: 2880,
    basePrice: 2592, // Discounted price from guide
    includedRooms: [
      "3 Bedrooms",
      "2 Bathrooms",
      "1 Kitchen",
      "1 Living Room",
      "1 Dining Room",
      "1 Home Office",
      "1 Laundry Room",
    ],
    tier: "premium",
  },
  {
    id: "luxury-full-house",
    name: "Luxury Full House Clean",
    description: "Comprehensive deep cleaning with premium treatments throughout",
    originalPrice: 4680,
    basePrice: 4212, // Discounted price from guide
    includedRooms: [
      "3 Bedrooms",
      "2 Bathrooms",
      "1 Kitchen",
      "1 Living Room",
      "1 Dining Room",
      "1 Home Office",
      "1 Laundry Room",
      "1 Entryway",
      "1 Hallway",
      "1 Stairs",
    ],
    tier: "luxury",
  },
]

export function PricingContent({ onSelectTier }: PricingContentProps) {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
          Flexible Cleaning Plans
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Choose from our pre-defined packages or build your own custom plan.
        </p>
      </div>

      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="tiers">Choose a Tier</TabsTrigger>
        <TabsTrigger value="custom">Build Your Custom Plan</TabsTrigger>
      </TabsList>

      {/* Full House Packages Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Full House Cleaning Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fullHousePackages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-center">{pkg.name}</CardTitle>
                <CardDescription className="text-center">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl text-gray-400 line-through">{formatCurrency(pkg.originalPrice)}</span>
                  <span className="text-4xl font-bold">{formatCurrency(pkg.basePrice)}</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium mb-4">
                  Save {formatCurrency(pkg.originalPrice - pkg.basePrice)}!
                </span>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left w-full px-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Standard House Configuration:
                  </li>
                  {pkg.includedRooms.map((room, index) => (
                    <li key={index} className="flex items-center gap-2 ml-6">
                      - {room}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => onSelectTier("bedroom", pkg.id)}>Select Package</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Individual Room Pricing Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Individual Room Pricing by Tier</h2>
        {Object.keys(roomDisplayNames).map((roomType) => {
          // Skip 'other' as it's a generic fallback and not a specific room for tier display
          if (roomType === "other") return null

          const tiers = getRoomTiers(roomType)
          return (
            <div key={roomType} className="mb-10">
              <h3 className="text-2xl font-semibold mb-6 text-center capitalize">
                {roomDisplayNames[roomType]} Cleaning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <Card key={tier.id} className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-center">{tier.name}</CardTitle>
                      <CardDescription className="text-center">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <span className="text-3xl font-bold mb-4">{formatCurrency(tier.price)}</span>
                      <p className="text-sm text-gray-500 mb-4">Est. Time: {tier.timeEstimate}</p>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left w-full px-4">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button onClick={() => onSelectTier(roomType, tier.id)}>Select Tier</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default PricingContent
