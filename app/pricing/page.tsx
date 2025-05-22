"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { RoomConfigurator } from "@/components/room-configurator"
import { ServiceSummaryCard } from "@/components/service-summary-card"
import { CleanlinessSlider } from "@/components/cleanliness-slider"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Star, Clock, Shield } from "lucide-react"

export default function PricingPage() {
  const { addItem } = useCart()
  const [roomConfigurations, setRoomConfigurations] = useState<Record<string, any>>({
    bedroom: {
      roomName: "Bedroom",
      selectedTier: "Essential Clean",
      selectedAddOns: [],
      selectedReductions: [],
      basePrice: 29.99,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      reductionsPrice: 0,
      totalPrice: 29.99,
    },
    bathroom: {
      roomName: "Bathroom",
      selectedTier: "Essential Clean",
      selectedAddOns: [],
      selectedReductions: [],
      basePrice: 39.99,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      reductionsPrice: 0,
      totalPrice: 39.99,
    },
    kitchen: {
      roomName: "Kitchen",
      selectedTier: "Essential Clean",
      selectedAddOns: [],
      selectedReductions: [],
      basePrice: 49.99,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      reductionsPrice: 0,
      totalPrice: 49.99,
    },
    livingRoom: {
      roomName: "Living Room",
      selectedTier: "Essential Clean",
      selectedAddOns: [],
      selectedReductions: [],
      basePrice: 34.99,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      reductionsPrice: 0,
      totalPrice: 34.99,
    },
  })

  const handleRoomConfigChange = (roomType: string, config: any) => {
    setRoomConfigurations((prev) => ({
      ...prev,
      [roomType]: config,
    }))
  }

  const handleAddToCart = () => {
    // Create a cart item from the configurations
    const cartItem = {
      id: `cleaning-service-${Date.now()}`,
      name: "Cleaning Service",
      price: getCalculatedTotals().totalPrice,
      quantity: 1,
      image: "/professional-cleaning-service.png",
      details: {
        rooms: Object.values(roomConfigurations),
        totalRooms: Object.values(roomConfigurations).length,
      },
    }

    // Add to cart
    addItem(cartItem)
  }

  // Calculate totals based on room configurations
  const getCalculatedTotals = () => {
    const rooms = Object.values(roomConfigurations)

    // Base price (sum of all Essential Clean prices)
    const basePrice = rooms.reduce((sum, room) => sum + (room.basePrice || 0), 0)

    // Tier upgrade price (sum of all tier upgrade prices)
    const tierUpgradePrice = rooms.reduce((sum, room) => sum + (room.tierUpgradePrice || 0), 0)

    // Add-ons price (sum of all add-on prices)
    const addOnsPrice = rooms.reduce((sum, room) => sum + (room.addOnsPrice || 0), 0)

    // Reductions price (sum of all reduction discounts)
    const reductionsPrice = rooms.reduce((sum, room) => sum + (room.reductionsPrice || 0), 0)

    // Service fee (fixed percentage of subtotal)
    const subtotal = basePrice + tierUpgradePrice + addOnsPrice - reductionsPrice
    const serviceFee = subtotal * 0.05 // 5% service fee

    // Total price
    const totalPrice = subtotal + serviceFee

    return {
      basePrice,
      tierUpgradePrice,
      addOnsPrice,
      reductionsPrice,
      serviceFee,
      totalPrice,
    }
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customize Your Cleaning Service</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Choose the rooms you want cleaned and customize the service level for each room.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CleanlinessSlider />

          <Tabs defaultValue="bedroom" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
              <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="livingRoom">Living Room</TabsTrigger>
            </TabsList>

            <TabsContent value="bedroom">
              <RoomConfigurator
                roomName="Bedroom"
                roomIcon="🛏️"
                baseTier={getRoomTiers("bedroom")[0]}
                tiers={getRoomTiers("bedroom")}
                addOns={getRoomAddOns("bedroom")}
                reductions={getRoomReductions("bedroom")}
                onConfigChange={(config) => handleRoomConfigChange("bedroom", config)}
                initialConfig={roomConfigurations.bedroom}
              />
            </TabsContent>

            <TabsContent value="bathroom">
              <RoomConfigurator
                roomName="Bathroom"
                roomIcon="🚿"
                baseTier={getRoomTiers("bathroom")[0]}
                tiers={getRoomTiers("bathroom")}
                addOns={getRoomAddOns("bathroom")}
                reductions={getRoomReductions("bathroom")}
                onConfigChange={(config) => handleRoomConfigChange("bathroom", config)}
                initialConfig={roomConfigurations.bathroom}
              />
            </TabsContent>

            <TabsContent value="kitchen">
              <RoomConfigurator
                roomName="Kitchen"
                roomIcon="🍳"
                baseTier={getRoomTiers("kitchen")[0]}
                tiers={getRoomTiers("kitchen")}
                addOns={getRoomAddOns("kitchen")}
                reductions={getRoomReductions("kitchen")}
                onConfigChange={(config) => handleRoomConfigChange("kitchen", config)}
                initialConfig={roomConfigurations.kitchen}
              />
            </TabsContent>

            <TabsContent value="livingRoom">
              <RoomConfigurator
                roomName="Living Room"
                roomIcon="🛋️"
                baseTier={getRoomTiers("livingRoom")[0]}
                tiers={getRoomTiers("livingRoom")}
                addOns={getRoomAddOns("livingRoom")}
                reductions={getRoomReductions("livingRoom")}
                onConfigChange={(config) => handleRoomConfigChange("livingRoom", config)}
                initialConfig={roomConfigurations.livingRoom}
              />
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose Our Cleaning Service?</CardTitle>
              <CardDescription>We provide professional, reliable, and customizable cleaning services.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium mb-2">Professional Cleaners</h3>
                  <p className="text-sm text-gray-500">Our cleaners are trained, background-checked, and insured.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium mb-2">Flexible Scheduling</h3>
                  <p className="text-sm text-gray-500">
                    Book a time that works for you, including evenings and weekends.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-medium mb-2">Satisfaction Guarantee</h3>
                  <p className="text-sm text-gray-500">
                    If you're not satisfied, we'll re-clean at no additional cost.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ServiceSummaryCard
              roomConfigurations={Object.values(roomConfigurations)}
              calculatedTotals={getCalculatedTotals()}
              onAddToCart={handleAddToCart}
            />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">How long will the cleaning take?</h3>
                  <p className="text-sm text-gray-500">
                    Cleaning time depends on the size of your home and the services selected. On average, a standard
                    cleaning takes 2-4 hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Do I need to provide cleaning supplies?</h3>
                  <p className="text-sm text-gray-500">
                    No, our cleaners bring all necessary supplies and equipment. If you prefer specific products, you
                    can provide them.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Can I get a recurring cleaning service?</h3>
                  <p className="text-sm text-gray-500">
                    Yes! We offer weekly, bi-weekly, and monthly cleaning plans with discounted rates.
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  View All FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AccessibilityToolbar className="z-50" />
    </main>
  )
}
