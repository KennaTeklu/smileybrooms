import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { RoomAddOn, RoomTier } from "@/lib/room-tiers"
import Image from "next/image"

interface RoomVisualizationProps {
  roomType: string
  selectedTierDetails?: RoomTier
  selectedAddOnsDetails?: RoomAddOn[]
}

export function RoomVisualization({ roomType, selectedTierDetails, selectedAddOnsDetails }: RoomVisualizationProps) {
  const imageUrl = `/images/${roomType}-professional.png` // Assuming images are named like 'kitchen-professional.png'
  const placeholderImage = "/clean-room-interior.png"

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {roomType !== "default" && (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`Visualisation of ${roomType}`}
              width={400}
              height={300}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = placeholderImage
              }}
            />
          )}
          {roomType === "default" && (
            <Image
              src={placeholderImage || "/placeholder.svg"}
              alt="Placeholder for room visualization"
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
            <h3 className="text-white text-xl font-bold capitalize">
              {roomType !== "default" ? roomType.replace(/-/g, " ") : "Selected Room"}
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-lg">Service Tier:</h4>
            <p
              className={cn(
                "text-sm",
                selectedTierDetails ? "text-gray-700 dark:text-gray-300" : "text-gray-500 italic",
              )}
            >
              {selectedTierDetails ? selectedTierDetails.name : "No tier selected"}
            </p>
            {selectedTierDetails && (
              <p className="text-xs text-muted-foreground mt-1">{selectedTierDetails.description}</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-lg">Selected Add-ons:</h4>
            {selectedAddOnsDetails && selectedAddOnsDetails.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {selectedAddOnsDetails.map((addOn) => (
                  <li key={addOn.id}>{addOn.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No add-ons selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
