"use client"

import Image from "next/image"
import { roomDisplayNames, roomImages } from "@/lib/room-tiers"

interface PricingContentProps {
  /**
   * Array of selected room keys, e.g. `['bedroom', 'bathroom']`.
   */
  selectedRooms?: string[]
}

/**
 * Grid of cards displaying a thumbnail and label for each selected room.
 */
export function PricingContent({ selectedRooms = [] }: PricingContentProps) {
  if (!selectedRooms.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No rooms selected yet. Choose a room above to begin customising your clean!
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {selectedRooms.map((room) => (
        <article
          key={room}
          className="overflow-hidden rounded-lg border bg-background shadow-sm transition-colors hover:border-primary"
        >
          <Image
            src={roomImages[room] ?? roomImages.other}
            alt={`${roomDisplayNames[room]} reference image`}
            width={400}
            height={220}
            className="h-40 w-full object-cover"
            priority
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold leading-none">{roomDisplayNames[room] ?? room}</h3>
          </div>
        </article>
      ))}
    </div>
  )
}

/*  -- allow both default & named import styles -- */
export default PricingContent
