"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { roomImages, type RoomTier, type RoomAddOn } from "@/lib/room-tiers" // Import RoomTier and RoomAddOn types

interface RoomVisualizationProps {
  roomType: string
  selectedTierDetails?: RoomTier // Changed to accept full tier details
  selectedAddOnsDetails?: RoomAddOn[] // Changed to accept full add-on details
}

export function RoomVisualization({
  roomType,
  selectedTierDetails,
  selectedAddOnsDetails = [],
}: RoomVisualizationProps) {
  const [activeView, setActiveView] = useState("2d")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

  // Mapping of abstract area IDs to keywords found in detailedTasks
  const areaKeywords: Record<string, string[]> = {
    floor: ["floor", "vacuum", "sweep", "mop", "carpet", "hardwood"],
    bed: ["bed", "mattress", "pillow", "under-bed", "linen"],
    nightstand: ["nightstand"],
    dresser: ["dresser"],
    closet: ["closet", "wardrobe"],
    shower: ["shower", "tub"],
    toilet: ["toilet"],
    sink: ["sink"],
    mirror: ["mirror"],
    counters: ["countertop", "counter"],
    stove: ["stovetop", "oven", "range hood"],
    refrigerator: ["refrigerator"],
    cabinets: ["cabinet"],
    sofa: ["sofa", "furniture", "upholstery"],
    coffeeTable: ["coffee table"],
    tvStand: ["tv stand", "electronics", "entertainment center"],
    bookshelf: ["bookshelf"],
    table: ["table"], // dining table
    chairs: ["chair"], // dining chairs
    sideboard: ["sideboard"],
    desk: ["desk"],
    chair: ["chair"], // office chair
    washer: ["washer"],
    dryer: ["dryer"],
    consoleTable: ["console table"],
    coatRack: ["coat rack", "coat closet"],
    artwork: ["artwork", "picture frame"],
    steps: ["steps", "stair"],
    handrail: ["handrail"],
  }

  // Room areas based on room type (abstract coordinates, will overlay on image)
  const getRoomAreas = (type: string) => {
    // Normalize type to match keys in roomImages and roomDisplayNames
    const normalizedType = type.replace(/\s/g, "").toLowerCase()

    switch (normalizedType) {
      case "bedroom":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "bed", name: "Bed", x: 100, y: 100, width: 200, height: 150 },
          { id: "nightstand", name: "Nightstand", x: 320, y: 120, width: 60, height: 60 },
          { id: "dresser", name: "Dresser", x: 50, y: 50, width: 100, height: 40 },
          { id: "closet", name: "Closet", x: 380, y: 50, width: 70, height: 150 },
        ]
      case "bathroom":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "shower", name: "Shower/Tub", x: 300, y: 50, width: 150, height: 150 },
          { id: "toilet", name: "Toilet", x: 200, y: 50, width: 80, height: 80 },
          { id: "sink", name: "Sink", x: 50, y: 50, width: 120, height: 80 },
          { id: "mirror", name: "Mirror", x: 50, y: 20, width: 120, height: 30 },
        ]
      case "kitchen":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 400, height: 200 },
          { id: "counters", name: "Countertops", x: 50, y: 150, width: 400, height: 40 },
          { id: "sink", name: "Sink", x: 200, y: 130, width: 100, height: 60 },
          { id: "stove", name: "Stove/Oven", x: 320, y: 50, width: 130, height: 90 },
          { id: "refrigerator", name: "Refrigerator", x: 50, y: 50, width: 100, height: 90 },
          { id: "cabinets", name: "Cabinets", x: 160, y: 50, width: 150, height: 40 },
        ]
      case "livingroom":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 400, height: 250 },
          { id: "sofa", name: "Sofa", x: 100, y: 100, width: 250, height: 80 },
          { id: "coffeeTable", name: "Coffee Table", x: 150, y: 200, width: 150, height: 60 },
          { id: "tvStand", name: "TV Stand", x: 400, y: 100, width: 100, height: 40 },
          { id: "bookshelf", name: "Bookshelf", x: 50, y: 50, width: 80, height: 150 },
        ]
      case "diningroom":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 400, height: 200 },
          { id: "table", name: "Dining Table", x: 100, y: 100, width: 250, height: 100 },
          { id: "chairs", name: "Chairs", x: 80, y: 80, width: 300, height: 150 },
          { id: "sideboard", name: "Sideboard", x: 400, y: 50, width: 80, height: 100 },
        ]
      case "homeoffice":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "desk", name: "Desk", x: 100, y: 100, width: 200, height: 80 },
          { id: "chair", name: "Chair", x: 150, y: 180, width: 100, height: 60 },
          { id: "bookshelf", name: "Bookshelf", x: 320, y: 50, width: 80, height: 150 },
        ]
      case "laundryroom":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "washer", name: "Washer", x: 100, y: 50, width: 80, height: 100 },
          { id: "dryer", name: "Dryer", x: 200, y: 50, width: 80, height: 100 },
          { id: "sink", name: "Sink", x: 300, y: 50, width: 80, height: 80 },
          { id: "counter", name: "Counter", x: 50, y: 160, width: 400, height: 40 },
        ]
      case "entryway":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "consoleTable", name: "Console Table", x: 100, y: 100, width: 150, height: 60 },
          { id: "mirror", name: "Mirror", x: 120, y: 50, width: 100, height: 40 },
          { id: "coatRack", name: "Coat Rack", x: 300, y: 50, width: 50, height: 150 },
        ]
      case "hallway":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 400, height: 200 },
          { id: "consoleTable", name: "Console Table", x: 100, y: 100, width: 150, height: 60 },
          { id: "artwork", name: "Artwork", x: 300, y: 50, width: 80, height: 100 },
        ]
      case "stairs":
        return [
          { id: "steps", name: "Steps", x: 50, y: 100, width: 200, height: 300 },
          { id: "handrail", name: "Handrail", x: 250, y: 50, width: 50, height: 350 },
        ]
      default:
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "furniture", name: "Furniture", x: 100, y: 100, width: 200, height: 100 },
        ]
    }
  }

  // Determine if an area is included in cleaning based on tier details and add-ons
  const isAreaIncluded = (areaId: string) => {
    if (!selectedTierDetails) return false

    const detailedTasks = selectedTierDetails.detailedTasks.map((task) => task.toLowerCase())
    const notIncludedTasks = selectedTierDetails.notIncludedTasks.map((task) => task.toLowerCase())

    // Check if any keyword for the area is present in detailedTasks
    const keywords = areaKeywords[areaId] || []
    const isCoveredByTier = keywords.some((keyword) => detailedTasks.some((task) => task.includes(keyword)))

    // Check if any keyword for the area is present in notIncludedTasks
    const isExcludedByTier = keywords.some((keyword) => notIncludedTasks.some((task) => task.includes(keyword)))

    // Check if the area is explicitly added via add-ons
    const isCoveredByAddOn = selectedAddOnsDetails.some((addOn) =>
      keywords.some((keyword) => addOn.name.toLowerCase().includes(keyword)),
    )

    // An area is included if it's covered by the tier AND not explicitly excluded, OR if it's covered by an add-on.
    return (isCoveredByTier && !isExcludedByTier) || isCoveredByAddOn
  }

  // Load background image
  useEffect(() => {
    setIsLoading(true)
    const img = new Image()
    img.crossOrigin = "anonymous" // Important for CORS when drawing on canvas
    const imagePath = roomImages[roomType] || "/cozy-reading-nook.png"
    img.src = imagePath
    img.onload = () => {
      setBackgroundImage(img)
      setIsLoading(false)
    }
    img.onerror = () => {
      console.error("Failed to load image:", img.src)
      setBackgroundImage(null) // Clear image on error
      setIsLoading(false)
    }
  }, [roomType])

  // Draw the room visualization
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image if loaded
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    } else {
      // Fallback if image fails to load or is not available
      ctx.fillStyle = "#f0f0f0" // Light gray background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#666"
      ctx.font = "20px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Image not available", canvas.width / 2, canvas.height / 2)
    }

    // Get room areas
    const roomAreas = getRoomAreas(roomType)

    // Draw room areas as overlays
    roomAreas.forEach((area) => {
      const isIncluded = isAreaIncluded(area.id)
      const isHovered = hoveredArea === area.id

      // Use a semi-transparent fill to show the background image
      ctx.fillStyle = isIncluded
        ? isHovered
          ? "rgba(34, 197, 94, 0.5)" // Green for included, slightly more opaque on hover
          : "rgba(34, 197, 94, 0.3)" // Green for included
        : isHovered
          ? "rgba(203, 213, 225, 0.5)" // Gray for not included, slightly more opaque on hover
          : "rgba(203, 213, 225, 0.2)" // Gray for not included

      ctx.strokeStyle = isIncluded ? "#16a34a" : "#94a3b8"
      ctx.lineWidth = isHovered ? 3 : 1

      ctx.fillRect(area.x, area.y, area.width, area.height)
      ctx.strokeRect(area.x, area.y, area.width, area.height)

      // Add area label
      ctx.fillStyle = isIncluded ? "#166534" : "#475569"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(area.name, area.x + area.width / 2, area.y + area.height / 2)
    })

    // Add mouse move event listener for hover effects
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let hoveredAreaId: string | null = null

      roomAreas.forEach((area) => {
        if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
          hoveredAreaId = area.id
        }
      })

      if (hoveredAreaId !== hoveredArea) {
        setHoveredArea(hoveredAreaId)
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [roomType, selectedTierDetails, selectedAddOnsDetails, hoveredArea, backgroundImage]) // Re-run when backgroundImage or tier/add-on details change

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Room Visualization</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Green areas show what will be cleaned with your selected service tier. Hover over areas to see
                  details.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="2d" value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="2d">2D View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="2d" className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 z-10">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            <div className="relative">
              <canvas ref={canvasRef} width={500} height={400} className="w-full h-auto border rounded-md"></canvas>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {selectedTierDetails?.name || "No Tier Selected"}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                <span className="text-sm">Included in {selectedTierDetails?.name || "selected tier"}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getRoomAreas(roomType).map((area) => {
                  const isIncluded = isAreaIncluded(area.id)

                  return (
                    <div
                      key={area.id}
                      className={`p-2 border rounded-md flex items-center gap-2 ${
                        isIncluded
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${isIncluded ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      ></div>
                      <span>{area.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
