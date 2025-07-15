"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MinusIcon, PlusIcon } from "lucide-react"
import { ROOM_CONFIG } from "@/lib/constants"
import { usePriceWorker, type ServiceConfig, type PriceResult } from "@/lib/use-price-worker"
import { motion } from "framer-motion"

type RoomType = keyof typeof ROOM_CONFIG.roomPrices

export default function CollapsibleAddAllPanel() {
  const [rooms, setRooms] = useState<Record<RoomType, number>>({
    master_bedroom: 0,
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    living_room: 0,
    dining_room: 0,
    office: 0,
    playroom: 0,
    mudroom: 0,
    laundry_room: 0,
    sunroom: 0,
    guest_room: 0,
    garage: 0,
  })
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [frequency, setFrequency] = useState<keyof typeof ROOM_CONFIG.frequencyMultipliers>("monthly")
  const [cleanlinessLevel, setCleanlinessLevel] = useState<number>(3)
  const [specialRequests, setSpecialRequests] = useState<string[]>([])
  const [addons, setAddons] = useState<Record<string, number>>({})
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null)
  const { calculatePrice, isCalculating } = usePriceWorker()

  const serviceConfig: ServiceConfig = useMemo(
    () => ({
      rooms,
      serviceType,
      frequency,
      cleanlinessLevel,
      specialRequests,
      addons,
    }),
    [rooms, serviceType, frequency, cleanlinessLevel, specialRequests, addons],
  )

  useEffect(() => {
    const getPrice = async () => {
      const result = await calculatePrice(serviceConfig)
      setPriceResult(result)
    }
    getPrice()
  }, [serviceConfig, calculatePrice])

  const handleRoomChange = (roomType: RoomType, change: number) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] + change),
    }))
  }

  const handleAddonToggle = (addonName: string, price: number) => {
    setAddons((prev) => {
      const newAddons = { ...prev }
      if (newAddons[addonName]) {
        delete newAddons[addonName]
      } else {
        newAddons[addonName] = price
      }
      return newAddons
    })
  }

  const handleSpecialRequestToggle = (request: string) => {
    setSpecialRequests((prev) => (prev.includes(request) ? prev.filter((r) => r !== request) : [...prev, request]))
  }

  const roomCategories: { [key: string]: RoomType[] } = {
    "Living Spaces": ["living_room", "dining_room", "office", "playroom", "sunroom"],
    Bedrooms: ["master_bedroom", "bedroom", "guest_room"],
    Bathrooms: ["bathroom"],
    "Utility & Other": ["kitchen", "laundry_room", "mudroom", "garage"],
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add All Rooms & Configure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Room Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Rooms</h3>
          {Object.entries(roomCategories).map(([category, roomTypes]) => (
            <div key={category} className="mb-6">
              <h4 className="font-medium text-md mb-3">{category}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {roomTypes.map((roomType) => (
                  <motion.div key={roomType} className="flex flex-col items-center space-y-2">
                    {" "}
                    {/* Removed layout prop */}
                    <Label htmlFor={roomType} className="capitalize text-center">
                      {roomType.replace(/_/g, " ")}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRoomChange(roomType, -1)}
                        disabled={rooms[roomType] === 0}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        id={roomType}
                        type="number"
                        value={rooms[roomType]}
                        onChange={(e) =>
                          setRooms((prev) => ({
                            ...prev,
                            [roomType]: Math.max(0, Number.parseInt(e.target.value) || 0),
                          }))
                        }
                        className="w-16 text-center"
                        min="0"
                      />
                      <Button variant="outline" size="icon" onClick={() => handleRoomChange(roomType, 1)}>
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Service Type */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Service Type</h3>
          <Select value={serviceType} onValueChange={(value: "standard" | "detailing") => setServiceType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Cleaning</SelectItem>
              <SelectItem value="detailing">Deep Detailing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Frequency */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Frequency</h3>
          <Select
            value={frequency}
            onValueChange={(value: keyof typeof ROOM_CONFIG.frequencyMultipliers) => setFrequency(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {" "}
              {/* Added explicit classes for scrolling */}
              {Object.keys(ROOM_CONFIG.frequencyMultipliers).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Cleanliness Level */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Cleanliness Level</h3>
          <div className="flex items-center gap-4">
            <Slider
              min={1}
              max={5}
              step={1}
              value={[cleanlinessLevel]}
              onValueChange={(val) => setCleanlinessLevel(val[0])}
              className="w-full"
            />
            <span className="font-semibold w-10 text-right">{cleanlinessLevel}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">1 = Lightly dirty, 5 = Very dirty (affects price)</p>
        </div>

        <Separator />

        {/* Add-ons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="oven-cleaning-panel"
                checked={!!addons["oven-cleaning"]}
                onCheckedChange={() => handleAddonToggle("oven-cleaning", 25)}
              />
              <Label htmlFor="oven-cleaning-panel">Oven Cleaning ($25)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fridge-cleaning-panel"
                checked={!!addons["fridge-cleaning"]}
                onCheckedChange={() => handleAddonToggle("fridge-cleaning", 20)}
              />
              <Label htmlFor="fridge-cleaning-panel">Fridge Cleaning ($20)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="window-cleaning-panel"
                checked={!!addons["window-cleaning"]}
                onCheckedChange={() => handleAddonToggle("window-cleaning", 30)}
              />
              <Label htmlFor="window-cleaning-panel">Window Cleaning (Interior, $30)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laundry-service-panel"
                checked={!!addons["laundry-service"]}
                onCheckedChange={() => handleAddonToggle("laundry-service", 40)}
              />
              <Label htmlFor="laundry-service-panel">Laundry Service ($40)</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Special Requests */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Special Requests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eco-friendly-panel"
                checked={specialRequests.includes("eco-friendly")}
                onCheckedChange={() => handleSpecialRequestToggle("eco-friendly")}
              />
              <Label htmlFor="eco-friendly-panel">Eco-Friendly Products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pet-friendly-panel"
                checked={specialRequests.includes("pet-friendly")}
                onCheckedChange={() => handleSpecialRequestToggle("pet-friendly")}
              />
              <Label htmlFor="pet-friendly-panel">Pet-Friendly Cleaning</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Estimated Price</h3>
          {isCalculating ? (
            <div className="flex items-center justify-center h-20">
              <p>Calculating...</p>
            </div>
          ) : priceResult ? (
            <>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Base Price:</span>
                <span>${priceResult.basePrice.toFixed(2)}</span>
              </div>
              {Object.entries(priceResult.adjustments).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm text-gray-600">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span>{value >= 0 ? `+ $${value.toFixed(2)}` : `- $${Math.abs(value).toFixed(2)}`}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total:</span>
                <span>${priceResult.finalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">Estimated Duration: {priceResult.estimatedDuration} minutes</p>
              <Button className="w-full mt-4">Add to Cart</Button>
            </>
          ) : (
            <p className="text-center text-gray-500">Select rooms and options to see your price.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
