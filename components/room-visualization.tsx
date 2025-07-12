"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { roomImages, roomDisplayNames, type RoomTier, type RoomAddOn } from "@/lib/room-tiers"

interface RoomVisualizationProps {
  roomType: string
  selectedTierDetails?: RoomTier
  selectedAddOnsDetails?: RoomAddOn[]
}

// Define areas within each room image for highlighting
const getRoomAreas = (roomType: string) => {
  switch (roomType) {
    case "bedroom":
      return [
        { id: "bed", x: 30, y: 40, width: 40, height: 30, keywords: ["bed", "linen", "pillow", "mattress"] },
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "vacuum", "carpet"] },
        { id: "nightstand", x: 10, y: 50, width: 15, height: 20, keywords: ["nightstand", "surface"] },
        { id: "dresser", x: 70, y: 50, width: 20, height: 20, keywords: ["dresser", "surface"] },
        { id: "window", x: 40, y: 10, width: 20, height: 30, keywords: ["window", "sill", "blinds"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 70, keywords: ["wall", "baseboard"] },
        { id: "light-fixture", x: 45, y: 0, width: 10, height: 10, keywords: ["light fixture", "chandelier"] },
        { id: "closet", x: 80, y: 20, width: 15, height: 60, keywords: ["closet"] },
        { id: "electronics", x: 50, y: 30, width: 10, height: 10, keywords: ["tv", "electronics", "remote"] },
      ]
    case "bathroom":
      return [
        { id: "toilet", x: 10, y: 50, width: 20, height: 40, keywords: ["toilet", "bowl", "exterior"] },
        { id: "shower-tub", x: 70, y: 30, width: 30, height: 70, keywords: ["shower", "tub", "grout", "door"] },
        { id: "sink-vanity", x: 35, y: 40, width: 30, height: 30, keywords: ["sink", "vanity", "faucet"] },
        { id: "mirror", x: 40, y: 10, width: 20, height: 30, keywords: ["mirror"] },
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "mop"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 70, keywords: ["wall", "baseboard"] },
        { id: "ventilation", x: 80, y: 0, width: 10, height: 10, keywords: ["ventilation", "fan"] },
        { id: "cabinet", x: 35, y: 70, width: 30, height: 10, keywords: ["cabinet", "medicine"] },
      ]
    case "kitchen":
      return [
        { id: "countertop", x: 0, y: 40, width: 100, height: 20, keywords: ["countertop", "backsplash"] },
        { id: "sink", x: 20, y: 45, width: 15, height: 15, keywords: ["sink", "faucet", "disposal"] },
        { id: "stovetop-oven", x: 40, y: 30, width: 20, height: 40, keywords: ["stovetop", "oven", "range hood"] },
        { id: "microwave", x: 65, y: 30, width: 15, height: 15, keywords: ["microwave"] },
        { id: "refrigerator", x: 85, y: 10, width: 15, height: 60, keywords: ["refrigerator", "fridge"] },
        { id: "dishwasher", x: 0, y: 50, width: 15, height: 30, keywords: ["dishwasher"] },
        { id: "cabinets", x: 0, y: 0, width: 100, height: 40, keywords: ["cabinet", "pantry"] },
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "mop"] },
        { id: "small-appliances", x: 5, y: 30, width: 10, height: 10, keywords: ["coffee maker", "toaster"] },
      ]
    case "livingRoom":
      return [
        { id: "sofa", x: 20, y: 50, width: 60, height: 30, keywords: ["sofa", "furniture", "upholstery"] },
        { id: "coffee-table", x: 40, y: 70, width: 20, height: 15, keywords: ["coffee table", "surface"] },
        { id: "floor", x: 0, y: 80, width: 100, height: 20, keywords: ["floor", "vacuum", "carpet"] },
        { id: "tv-stand", x: 70, y: 40, width: 25, height: 30, keywords: ["tv", "electronics", "entertainment"] },
        { id: "bookshelf", x: 5, y: 20, width: 15, height: 50, keywords: ["bookshelf", "decor"] },
        { id: "window", x: 0, y: 0, width: 20, height: 40, keywords: ["window", "sill"] },
        { id: "ceiling-fan", x: 45, y: 0, width: 10, height: 10, keywords: ["ceiling fan", "light fixture"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 80, keywords: ["wall", "baseboard"] },
      ]
    case "diningRoom":
      return [
        { id: "dining-table", x: 30, y: 40, width: 40, height: 30, keywords: ["table", "polishing"] },
        { id: "chairs", x: 20, y: 50, width: 60, height: 40, keywords: ["chair", "upholstery"] },
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "sweep", "mop"] },
        { id: "china-cabinet", x: 70, y: 10, width: 20, height: 60, keywords: ["china cabinet", "glassware"] },
        { id: "light-fixture", x: 45, y: 0, width: 10, height: 10, keywords: ["light fixture", "chandelier"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 70, keywords: ["wall", "baseboard"] },
      ]
    case "homeOffice":
      return [
        { id: "desk", x: 20, y: 40, width: 60, height: 30, keywords: ["desk", "surface", "drawer"] },
        { id: "chair", x: 40, y: 60, width: 20, height: 30, keywords: ["chair"] },
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "vacuum"] },
        {
          id: "computer",
          x: 30,
          y: 20,
          width: 40,
          height: 20,
          keywords: ["computer", "monitor", "keyboard", "mouse", "electronics"],
        },
        { id: "bookshelf", x: 5, y: 10, width: 15, height: 60, keywords: ["bookshelf", "filing cabinet"] },
        { id: "window", x: 80, y: 10, width: 15, height: 40, keywords: ["window", "sill", "blinds"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 70, keywords: ["wall"] },
      ]
    case "laundryRoom":
      return [
        { id: "washer-dryer", x: 10, y: 30, width: 40, height: 60, keywords: ["washer", "dryer", "lint trap", "vent"] },
        { id: "sink", x: 60, y: 50, width: 20, height: 30, keywords: ["sink", "utility"] },
        { id: "countertop", x: 0, y: 20, width: 100, height: 15, keywords: ["countertop", "detergent"] },
        { id: "cabinets", x: 0, y: 0, width: 100, height: 20, keywords: ["cabinet"] },
        { id: "floor", x: 0, y: 80, width: 100, height: 20, keywords: ["floor", "sweep", "mop"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 80, keywords: ["wall"] },
      ]
    case "entryway":
      return [
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "sweep", "mop"] },
        { id: "console-table", x: 30, y: 40, width: 40, height: 20, keywords: ["console table", "surface"] },
        { id: "door", x: 0, y: 20, width: 20, height: 60, keywords: ["door", "handle", "hardware"] },
        { id: "mirror", x: 40, y: 10, width: 20, height: 30, keywords: ["mirror"] },
        { id: "shoe-rack", x: 10, y: 80, width: 15, height: 10, keywords: ["shoe rack", "shoe organization"] },
        { id: "coat-closet", x: 80, y: 20, width: 15, height: 60, keywords: ["coat closet"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 80, keywords: ["wall", "baseboard"] },
        { id: "light-fixture", x: 45, y: 0, width: 10, height: 10, keywords: ["light fixture", "chandelier"] },
      ]
    case "hallway":
      return [
        { id: "floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "vacuum", "mop", "runner", "carpet"] },
        {
          id: "walls",
          x: 0,
          y: 0,
          width: 100,
          height: 70,
          keywords: ["wall", "baseboard", "picture frame", "artwork"],
        },
        { id: "doors", x: 0, y: 30, width: 100, height: 40, keywords: ["door", "doorframe", "hardware"] },
        { id: "light-fixture", x: 45, y: 0, width: 10, height: 10, keywords: ["light fixture"] },
        { id: "ceiling", x: 0, y: 0, width: 100, height: 10, keywords: ["ceiling", "cobweb", "air vent"] },
      ]
    case "stairs":
      return [
        { id: "steps", x: 0, y: 40, width: 100, height: 60, keywords: ["step", "riser", "carpet", "runner"] },
        { id: "handrail", x: 70, y: 10, width: 10, height: 60, keywords: ["handrail", "spindle"] },
        { id: "walls", x: 0, y: 0, width: 100, height: 70, keywords: ["wall", "baseboard"] },
        { id: "under-stairs", x: 0, y: 70, width: 30, height: 30, keywords: ["under-stair"] },
        { id: "light-fixture", x: 45, y: 0, width: 10, height: 10, keywords: ["light fixture"] },
      ]
    case "default":
    default:
      return [
        {
          id: "general-surfaces",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          keywords: ["surface", "dusting", "tidying", "light switch", "doorknob", "mirror"],
        },
        { id: "general-floor", x: 0, y: 70, width: 100, height: 30, keywords: ["floor", "vacuum", "sweep", "mop"] },
        { id: "general-trash", x: 80, y: 80, width: 10, height: 10, keywords: ["trash"] },
        { id: "general-appliances", x: 50, y: 40, width: 20, height: 30, keywords: ["appliance", "exterior"] },
        { id: "general-bathroom", x: 10, y: 40, width: 20, height: 30, keywords: ["bathroom", "grout", "faucet"] },
        { id: "general-kitchen", x: 30, y: 40, width: 20, height: 30, keywords: ["kitchen", "sink", "cabinet"] },
        { id: "general-windows", x: 70, y: 10, width: 10, height: 20, keywords: ["window", "interior"] },
        { id: "general-upholstery", x: 40, y: 60, width: 30, height: 20, keywords: ["upholstery", "sofa", "chair"] },
        { id: "general-beds", x: 20, y: 50, width: 20, height: 20, keywords: ["bed", "linen"] },
        {
          id: "general-walls",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          keywords: ["wall", "ceiling", "crown molding", "air vent"],
        },
        {
          id: "general-personal",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          keywords: ["personal item", "drawer", "closet", "laundry"],
        },
      ]
  }
}

export function RoomVisualization({ roomType, selectedTierDetails, selectedAddOnsDetails }: RoomVisualizationProps) {
  const imageUrl = roomImages[roomType] || roomImages.default
  const displayName = roomDisplayNames[roomType] || roomDisplayNames.default

  const areas = useMemo(() => getRoomAreas(roomType), [roomType])

  const highlightedAreas = useMemo(() => {
    const includedKeywords = new Set<string>()

    // Add keywords from selected tier's detailed tasks
    selectedTierDetails?.detailedTasks.forEach((task) => {
      task
        .toLowerCase()
        .split(" ")
        .forEach((word) => includedKeywords.add(word.replace(/[^a-z0-9]/g, "")))
    })

    // Add keywords from selected add-ons
    selectedAddOnsDetails?.forEach((addOn) => {
      addOn.name
        .toLowerCase()
        .split(" ")
        .forEach((word) => includedKeywords.add(word.replace(/[^a-z0-9]/g, "")))
      addOn.description
        ?.toLowerCase()
        .split(" ")
        .forEach((word) => includedKeywords.add(word.replace(/[^a-z0-9]/g, "")))
    })

    return areas.filter((area) => area.keywords.some((keyword) => includedKeywords.has(keyword)))
  }, [selectedTierDetails, selectedAddOnsDetails, areas])

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Visualization of ${displayName}`}
            className="absolute inset-0 w-full h-full object-cover"
            width={600}
            height={400}
          />
          {highlightedAreas.map((area) => (
            <div
              key={area.id}
              className="absolute bg-blue-500/30 border-2 border-blue-600 dark:border-blue-400 transition-all duration-300 ease-in-out"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-2xl font-bold">
            {displayName} Visualization
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
