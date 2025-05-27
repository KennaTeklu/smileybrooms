"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Room } from "@/types"
import { autoScrollToSection } from "@/lib/scroll-to-section"

interface RoomCategoryProps {
  rooms: Room[]
  selectedRoom: string | null
  onRoomSelect?: (roomType: string) => void
  setIsCustomizationOpen: (isOpen: boolean) => void
}

const RoomCategory: React.FC<RoomCategoryProps> = ({ rooms, selectedRoom, onRoomSelect, setIsCustomizationOpen }) => {
  const [localSelectedRoom, setLocalSelectedRoom] = useState<string | null>(selectedRoom || null)

  const handleCustomizeClick = (roomType: string) => {
    onRoomSelect?.(roomType)
    setLocalSelectedRoom(roomType)
    setIsCustomizationOpen(true)

    // Auto-scroll to room customization section
    autoScrollToSection("room-customization-section", 200, 80)
  }

  return (
    <div className="flex items-center space-x-4 overflow-x-auto py-4">
      {rooms.map((room) => (
        <button
          key={room.type}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
            localSelectedRoom === room.type
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
            "hover:bg-muted hover:text-muted-foreground",
          )}
          onClick={() => handleCustomizeClick(room.type)}
          aria-selected={localSelectedRoom === room.type}
          role="radio"
          data-state={localSelectedRoom === room.type ? "active" : "inactive"}
        >
          {room.name}
        </button>
      ))}
    </div>
  )
}

export default RoomCategory
