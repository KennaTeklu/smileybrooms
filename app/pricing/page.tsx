"use client"

import { useState, useCallback, useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RoomConfigurator } from "@/components/room-configurator"
import { ServiceSummaryCard } from "@/components/service-summary-card"
import { FrequencySelector } from "@/components/frequency-selector"
import { CleanlinessSlider } from "@/components/cleanliness-slider"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import { Sparkles, Home, Clock, Shield } from "lucide-react"

interface RoomConfig {
  id: string
  name: string
  tier: string
  addOns: string[]
  reductions: string[]
  basePrice: number
  tierUpgrade: number
  addOnPrice: number
  reductionPrice: number
  totalPrice: number
}

export default function PricingPage() {
  const { addItem, setLastAddedItem } = useCart()
  const [roomConfigurations, setRoomConfigurations] = useState<RoomConfig[]>([])
  const [frequency, setFrequency] = useState("weekly")
  const [cleanliness, setCleanliness] = useState(50)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoomConfigurationChange = useCallback((configs: RoomConfig[]) => {
    setRoomConfigurations(configs)
  }, [])

  const getCalculatedTotals = useMemo(() => {
    const totals = roomConfigurations.reduce(
      (acc, config) => ({
        basePrice: acc.basePrice + (config.basePrice || 0),
        tierUpgrade: acc.tierUpgrade + (config.tierUpgrade || 0),
        addOnPrice: acc.addOnPrice + (config.addOnPrice || 0),
        reductionPrice: acc.reductionPrice + (config.reductionPrice || 0),
        totalPrice: acc.totalPrice + (config.totalPrice || 0),
      }),
      { basePrice: 0, tierUpgrade: 0, addOnPrice: 0, reductionPrice: 0, totalPrice: 0 },
    )

    const serviceFee = 50
    const frequencyMultipliers: Record<string, number> = {
      one_time: 2.17,
      weekly: 1.0,
      biweekly: 1.2,
      monthly: 1.54,
      semi_annual: 1.92,
      annually: 2.56,
      vip_daily: 7.5,
    }

    const frequencyMultiplier = frequencyMultipliers[frequency] || 1.0
    const subtotal = totals.totalPrice * frequencyMultiplier
    const finalTotal = subtotal + serviceFee

    return {
      ...totals,
      serviceFee,
      frequencyMultiplier,
      subtotal,
      finalTotal,
    }
  }, [roomConfigurations, frequency])

  const handleAddToCart = async () => {
    if (roomConfigurations.length === 0) return

    setIsLoading(true)

    try {
      const cartItem = {
        id: `service-${Date.now()}`,
        name: `Cleaning Service (${roomConfigurations.length} rooms)`,
        price: getCalculatedTotals.finalTotal,
        quantity: 1,
        type: "service" as const,
        details: {
          rooms: roomConfigurations.reduce(
            (acc, config) => {
              acc[config.id] = {
                name: config.name,
                tier: config.tier,
                addOns: config.addOns,
                reductions: config.reductions,
                price: config.totalPrice,
              }
              return acc
            },
            {} as Record<string, any>,
          ),
          frequency,
          totalRooms: roomConfigurations.length,
          basePrice: getCalculatedTotals.basePrice,
          tierUpgrade: getCalculatedTotals.tierUpgrade,
          addOnPrice: getCalculatedTotals.addOnPrice,
          reductionPrice: getCalculatedTotals.reductionPrice,
          frequencyMultiplier: getCalculatedTotals.frequencyMultiplier,
          serviceFee: getCalculatedTotals.serviceFee,
        },
      }

      addItem(cartItem)
      setLastAddedItem(cartItem)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Customize Your Cleaning Service</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select your rooms, choose your cleaning level, and get an instant quote for your perfect cleaning service.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Home className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Room-by-Room Customization</h3>
              <p className="text-sm text-gray-600">Choose different cleaning levels for each room</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">Weekly, bi-weekly, monthly, or one-time cleaning</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">100% satisfaction guaranteed or we'll make it right</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Frequency Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Cleaning Frequency
                </CardTitle>
                <CardDescription>How often would you like your cleaning service?</CardDescription>
              </CardHeader>
              <CardContent>
                <FrequencySelector value={frequency} onChange={setFrequency} />
              </CardContent>
            </Card>

            {/* Cleanliness Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Current Cleanliness Level
                </CardTitle>
                <CardDescription>
                  Help us understand your starting point for better service recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CleanlinessSlider value={cleanliness} onChange={setCleanliness} />
              </CardContent>
            </Card>

            {/* Room Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Room Configuration
                </CardTitle>
                <CardDescription>Add rooms and customize the cleaning level for each</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomConfigurator
                  onConfigurationChange={handleRoomConfigurationChange}
                  frequency={frequency}
                  cleanliness={cleanliness}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ServiceSummaryCard
                roomConfigurations={roomConfigurations}
                frequency={frequency}
                basePrice={getCalculatedTotals.basePrice}
                tierUpgrade={getCalculatedTotals.tierUpgrade}
                addOnPrice={getCalculatedTotals.addOnPrice}
                reductionPrice={getCalculatedTotals.reductionPrice}
                serviceFee={getCalculatedTotals.serviceFee}
                frequencyMultiplier={getCalculatedTotals.frequencyMultiplier}
                subtotal={getCalculatedTotals.subtotal}
                total={getCalculatedTotals.finalTotal}
                onAddToCart={handleAddToCart}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Configure your rooms above and add your custom cleaning service to cart
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Professional Team</Badge>
                <Badge variant="secondary">Eco-Friendly Products</Badge>
                <Badge variant="secondary">Insured & Bonded</Badge>
                <Badge variant="secondary">Satisfaction Guaranteed</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AccessibilityToolbar />
    </div>
  )
}
