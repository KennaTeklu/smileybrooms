"use client"

import { PricingContent } from "@/components/pricing-content"
import { RoomConfigurator } from "@/components/room-configurator"
import { useRoomContext } from "@/lib/room-context"
import { useMemo } from "react"

export default function PricingPage() {
  const { selectedRooms, selectedServices } = useRoomContext()

  const showRoomConfigurator = useMemo(() => {
    return selectedRooms.length > 0 || selectedServices.length > 0
  }, [selectedRooms, selectedServices])

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      <div className="flex-1 p-4 lg:p-8">
        <PricingContent />
      </div>
      {showRoomConfigurator && (
        <div className="lg:w-1/3 p-4 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800">
          <RoomConfigurator />
        </div>
      )}
    </div>
  )
}
