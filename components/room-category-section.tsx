"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { getRoomTiers, roomDisplayNames, roomImages } from "@/lib/room-tiers"
import { getServiceFeatures } from "@/lib/service-features"
import { formatCurrency } from "@/lib/utils"

interface RoomCategorySectionProps {
  roomType: string
  onSelectTier: (roomType: string, tierId: string) => void
}

export function RoomCategorySection({ roomType, onSelectTier }: RoomCategorySectionProps) {
  const tiers = getRoomTiers(roomType)
  const features = getServiceFeatures(roomType)

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={roomImages[roomType] || "/placeholder.svg?height=140&width=200&text=Room Image"}
            alt={roomDisplayNames[roomType]}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">{roomDisplayNames[roomType]} Cleaning</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-3xl font-bold mt-2">{formatCurrency(tier.price)}</div>
                <p className="text-sm text-gray-500">{tier.timeEstimate} estimated</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-1 text-sm text-gray-600">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.notIncludedTasks.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold">Not included:</span>{" "}
                    {tier.notIncludedTasks.map((task) => task.replace("✗ ", "")).join(", ")}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => onSelectTier(roomType, tier.id)}>
                  Select Tier <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <ServiceComparisonTable roomType={roomDisplayNames[roomType]} features={features} />
    </section>
  )
}
