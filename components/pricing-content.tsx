"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Import Button
import { cn } from "@/lib/utils"
import { getRoomTiers, roomImages } from "@/lib/room-tiers"

type PricingContentProps = {
  roomType: string
  onSelect?: (tier: ReturnType<typeof getRoomTiers>[0]) => void
  selected?: string | null
}

export function PricingContent({ roomType, onSelect, selected }: PricingContentProps) {
  const tiersForRoom = getRoomTiers(roomType)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tiersForRoom.map((tier) => {
        const isActive = tier.id === selected
        return (
          <Card
            key={tier.id}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/60 flex flex-col", // Added flex-col
              isActive && "border-2 border-primary",
            )}
            aria-pressed={isActive}
            role="button"
          >
            <CardHeader>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-6 flex-grow">
              {" "}
              {/* Added flex-grow */}
              <Image
                src={roomImages[roomType] || roomImages.default}
                alt={`${tier.name} illustration for ${roomType}`}
                width={200}
                height={140}
                className="rounded-md object-cover"
              />
              <p className="text-sm text-muted-foreground text-center flex-grow">{tier.description}</p>{" "}
              {/* Added flex-grow */}
              <span className="text-2xl font-bold">${tier.price.toFixed(2)}</span>
              <Button
                onClick={() => onSelect?.(tier)}
                className="w-full mt-auto" // Added mt-auto to push button to bottom
                variant={isActive ? "default" : "outline"}
              >
                {isActive ? "Selected" : "Select Tier"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default PricingContent
