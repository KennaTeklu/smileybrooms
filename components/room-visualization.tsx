"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface RoomVisualizationProps {
  roomType: string
  selectedTier: string
  selectedAddOns?: string[]
}

export function RoomVisualization({ roomType, selectedTier, selectedAddOns = [] }: RoomVisualizationProps) {
  const [activeView, setActiveView] = useState("2d")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)

  // Room areas based on room type
  const getRoomAreas = (type: string) => {
    switch (type.toLowerCase()) {
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
      case "living room":
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 400, height: 250 },
          { id: "sofa", name: "Sofa", x: 100, y: 100, width: 250, height: 80 },
          { id: "coffeeTable", name: "Coffee Table", x: 150, y: 200, width: 150, height: 60 },
          { id: "tvStand", name: "TV Stand", x: 400, y: 100, width: 100, height: 40 },
          { id: "bookshelf", name: "Bookshelf", x: 50, y: 50, width: 80, height: 150 },
        ]
      default:
        return [
          { id: "floor", name: "Floor", x: 50, y: 200, width: 300, height: 200 },
          { id: "furniture", name: "Furniture", x: 100, y: 100, width: 200, height: 100 },
        ]
    }
  }

  // Get cleaning areas based on tier
  const getCleaningAreas = (tier: string, roomType: string) => {
    const allAreas = getRoomAreas(roomType).map((area) => area.id)

    switch (tier) {
      case "PREMIUM":
        return allAreas
      case "DEEP CLEAN":
        return allAreas.filter((area) => area !== "closet" && area !== "bookshelf")
      case "QUICK CLEAN":
      default:
        return allAreas.filter((area) => ["floor", "counters", "sink", "bed"].includes(area))
    }
  }

  // Draw the room visualization
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsLoading(true)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw room outline
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Get room areas and cleaning areas
    const roomAreas = getRoomAreas(roomType)
    const cleaningAreas = getCleaningAreas(selectedTier, roomType)

    // Draw room areas
    roomAreas.forEach((area) => {
      const isIncluded = cleaningAreas.includes(area.id) || selectedAddOns?.includes(area.id)
      const isHovered = hoveredArea === area.id

      ctx.fillStyle = isIncluded
        ? isHovered
          ? "rgba(34, 197, 94, 0.7)"
          : "rgba(34, 197, 94, 0.4)"
        : isHovered
          ? "rgba(203, 213, 225, 0.7)"
          : "rgba(203, 213, 225, 0.3)"

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

    setIsLoading(false)

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
  }, [roomType, selectedTier, selectedAddOns, hoveredArea])

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
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            <div className="relative">
              <canvas ref={canvasRef} width={500} height={400} className="w-full h-auto border rounded-md"></canvas>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Badge variant="outline" className="bg-white">
                  {selectedTier}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                <span className="text-sm">Included in {selectedTier}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getRoomAreas(roomType).map((area) => {
                  const isIncluded =
                    getCleaningAreas(selectedTier, roomType).includes(area.id) || selectedAddOns?.includes(area.id)

                  return (
                    <div
                      key={area.id}
                      className={`p-2 border rounded-md flex items-center gap-2 ${
                        isIncluded ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${isIncluded ? "bg-green-500" : "bg-gray-300"}`}></div>
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
