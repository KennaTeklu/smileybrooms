"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { getServiceFeatures } from "@/lib/service-features"
import { getRoomTiers, roomDisplayNames, roomImages } from "@/lib/room-tiers"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

interface PricingContentProps {
  onSelectTier: (roomType: string, tierId: string) => void
}

export function PricingContent({ onSelectTier }: PricingContentProps) {
  const [activeTab, setActiveTab] = useState("tiers") // 'tiers' or 'custom'

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleTierSelect = (roomType: string, tierId: string) => {
    onSelectTier(roomType, tierId)
    handleTabChange("custom") // Switch to custom plan tab after selection
  }

  // Prioritize "default" (Whole House) to appear first
  const roomTypesOrder = ["default", ...Object.keys(roomDisplayNames).filter((key) => key !== "default")]

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Flexible Cleaning Plans</h1>
        <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Choose from our pre-defined tiers or build a custom plan tailored to your needs.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto mb-8">
          <TabsTrigger value="tiers">Choose a Tier</TabsTrigger>
          <TabsTrigger value="custom">Build Your Custom Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-12">
          {roomTypesOrder.map((roomType) => {
            const tiers = getRoomTiers(roomType)
            const features = getServiceFeatures(roomType)

            return (
              <section key={roomType} className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={roomImages[roomType] || "/placeholder.svg"}
                      alt={roomDisplayNames[roomType]}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
                      <h2 className="text-2xl font-bold text-white drop-shadow-md">
                        {roomDisplayNames[roomType]} Cleaning
                      </h2>
                    </div>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <Button className="w-full" onClick={() => handleTierSelect(roomType, tier.id)}>
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
          })}
        </TabsContent>

        <TabsContent value="custom">
          <div className="flex justify-center">
            {/* The PriceCalculator component will be rendered here */}
            {/* It will receive initialSelectedRooms and initialServiceType from the parent */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
