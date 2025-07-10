"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getRoomTiers, roomImages } from "@/lib/room-tiers" // Import getRoomTiers and roomImages

type PricingContentProps = {
  roomType: string // New prop to specify which room's tiers to display
  onSelect?: (tier: ReturnType<typeof getRoomTiers>[0]) => void
  selected?: string | null
}

export function PricingContent({ roomType, onSelect, selected }: PricingContentProps) {
  const tiersForRoom = getRoomTiers(roomType) // Get tiers based on the roomType prop

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tiersForRoom.map((tier) => {
        const isActive = tier.id === selected
        return (
          <Card
            key={tier.id}
            onClick={() => onSelect?.(tier)}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/60",
              isActive && "border-2 border-primary",
            )}
            aria-pressed={isActive}
            role="button"
          >
            <CardHeader>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-6">
              <Image
                src={roomImages[roomType] || "/placeholder.svg"} // Use roomImages based on roomType
                alt={`${tier.name} illustration for ${roomType}`}
                width={200}
                height={140}
                className="rounded-md object-cover"
              />
              <p className="text-sm text-muted-foreground text-center">{tier.description}</p>
              <span className="text-2xl font-bold">${tier.price.toFixed(2)}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Keep existing named imports working AND provide a default export
export default PricingContent
