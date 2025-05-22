import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompactRoomSelector } from "@/components/compact-room-selector"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomCategoryProps {
  title: string
  description: string
  rooms: string[]
  roomCounts: Record<string, number>
  onRoomCountChange: (roomId: string, count: number) => void
  onRoomConfigChange: (roomId: string, config: any) => void
  getRoomConfig: (roomType: string) => any
  variant?: "primary" | "secondary"
}

export function RoomCategory({
  title,
  description,
  rooms,
  roomCounts,
  onRoomCountChange,
  onRoomConfigChange,
  getRoomConfig,
  variant = "primary",
}: RoomCategoryProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader
        className={cn(
          variant === "primary"
            ? "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"
            : "bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/30",
        )}
      >
        <CardTitle className="text-2xl flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              variant === "primary"
                ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/30"
                : "text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/30",
            )}
          >
            <CheckCircle2 className="h-5 w-5" />
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={cn(
            "grid gap-4",
            rooms.length > 3
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
          )}
        >
          {rooms.map((roomType) => (
            <CompactRoomSelector
              key={roomType}
              roomId={roomType}
              roomName={roomDisplayNames[roomType]}
              roomIcon={<span className="text-xl">{roomIcons[roomType]}</span>}
              basePrice={getRoomTiers(roomType)[0].price}
              count={roomCounts[roomType] || 0}
              onCountChange={onRoomCountChange}
              baseTier={getRoomTiers(roomType)[0]}
              tiers={getRoomTiers(roomType)}
              addOns={getRoomAddOns(roomType)}
              reductions={getRoomReductions(roomType)}
              onConfigChange={onRoomConfigChange}
              initialConfig={getRoomConfig(roomType)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
