"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Clock, Home, Bed, Bath, Square, Sparkles, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface RoomConfig {
  type: string
  min: number
  max: number
  default: number
  timePerUnit: number // minutes per unit
}

interface AddOn {
  name: string
  time: number // minutes
}

const roomConfigs: RoomConfig[] = [
  { type: "Bedroom", min: 0, max: 5, default: 1, timePerUnit: 20 },
  { type: "Bathroom", min: 0, max: 4, default: 1, timePerUnit: 30 },
  { type: "Living Room", min: 0, max: 2, default: 1, timePerUnit: 40 },
  { type: "Kitchen", min: 0, max: 1, default: 1, timePerUnit: 60 },
  { type: "Dining Room", min: 0, max: 1, default: 0, timePerUnit: 30 },
  { type: "Home Office", min: 0, max: 2, default: 0, timePerUnit: 25 },
]

const addOns: AddOn[] = [
  { name: "Inside Oven Cleaning", time: 30 },
  { name: "Inside Refrigerator Cleaning", time: 20 },
  { name: "Interior Window Cleaning", time: 45 },
  { name: "Laundry Service", time: 60 },
  { name: "Wall Spot Cleaning", time: 15 },
]

export default function CleaningTimeEstimator() {
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>(
    roomConfigs.reduce((acc, room) => ({ ...acc, [room.type]: room.default }), {}),
  )
  const [squareFootage, setSquareFootage] = useState<number | string>("")
  const [cleanlinessLevel, setCleanlinessLevel] = useState("medium") // low, medium, high
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const handleRoomCountChange = (type: string, value: number[]) => {
    setRoomCounts((prev) => ({ ...prev, [type]: value[0] }))
  }

  const handleAddOnChange = (addOnName: string, checked: boolean) => {
    setSelectedAddOns((prev) => (checked ? [...prev, addOnName] : prev.filter((name) => name !== addOnName)))
  }

  const calculateEstimatedTime = () => {
    let totalMinutes = 0

    // Add time for rooms
    roomConfigs.forEach((room) => {
      totalMinutes += (roomCounts[room.type] || 0) * room.timePerUnit
    })

    // Adjust for square footage (simple linear scaling, e.g., 1000 sq ft = 10 mins, 2000 sq ft = 20 mins)
    if (typeof squareFootage === "number" && squareFootage > 0) {
      totalMinutes += Math.round(squareFootage / 100) * 5 // 5 minutes per 100 sq ft
    }

    // Adjust for cleanliness level
    switch (cleanlinessLevel) {
      case "low":
        totalMinutes *= 0.8 // 20% faster
        break
      case "high":
        totalMinutes *= 1.3 // 30% slower
        break
      default:
        // medium, no change
        break
    }

    // Add time for selected add-ons
    selectedAddOns.forEach((addOnName) => {
      const addOn = addOns.find((a) => a.name === addOnName)
      if (addOn) {
        totalMinutes += addOn.time
      }
    })

    return Math.max(0, Math.round(totalMinutes)) // Ensure non-negative
  }

  const estimatedTimeMinutes = calculateEstimatedTime()
  const hours = Math.floor(estimatedTimeMinutes / 60)
  const minutes = estimatedTimeMinutes % 60

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Clock className="h-6 w-6" />
            Cleaning Time Estimator
          </CardTitle>
          <CardDescription>Estimate how long your cleaning service will take.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Room Configuration */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Rooms in Your Home
            </h3>
            {roomConfigs.map((room) => (
              <div key={room.type} className="space-y-2">
                <Label htmlFor={`room-${room.type}`} className="flex items-center gap-2">
                  {room.type === "Bedroom" && <Bed className="h-5 w-5 text-blue-500" />}
                  {room.type === "Bathroom" && <Bath className="h-5 w-5 text-green-500" />}
                  {(room.type === "Living Room" ||
                    room.type === "Dining Room" ||
                    room.type === "Kitchen" ||
                    room.type === "Home Office") && <Home className="h-5 w-5 text-purple-500" />}
                  {room.type} ({roomCounts[room.type] || 0})
                </Label>
                <Slider
                  id={`room-${room.type}`}
                  min={room.min}
                  max={room.max}
                  step={1}
                  value={[roomCounts[room.type] || 0]}
                  onValueChange={(val) => handleRoomCountChange(room.type, val)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <Separator />

          {/* Square Footage */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Square className="h-5 w-5" />
              Approx. Square Footage (Optional)
            </h3>
            <Input
              type="number"
              placeholder="e.g., 1500 sq ft"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value === "" ? "" : Number.parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Providing square footage helps us give a more accurate estimate.
            </p>
          </div>

          <Separator />

          {/* Cleanliness Level */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Current Cleanliness Level
            </h3>
            <Select value={cleanlinessLevel} onValueChange={setCleanlinessLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cleanliness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Lightly Dirty (Faster)</SelectItem>
                <SelectItem value="medium">Moderately Dirty (Standard)</SelectItem>
                <SelectItem value="high">Very Dirty (Slower)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Add-on Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add-on Services (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addOn, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`addon-${index}`}
                    checked={selectedAddOns.includes(addOn.name)}
                    onCheckedChange={(checked) => handleAddOnChange(addOn.name, checked as boolean)}
                  />
                  <Label htmlFor={`addon-${index}`} className="text-base font-normal">
                    {addOn.name} ({addOn.time} mins)
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 text-center"
          >
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              Estimated Cleaning Time
            </h3>
            <p className="text-5xl font-bold text-blue-600">
              {hours}h {minutes}m
            </p>
            <p className="text-sm text-muted-foreground">
              This is an estimate. Actual time may vary based on specific conditions.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
