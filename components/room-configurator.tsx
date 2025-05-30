"use client"

import { useMemo, useCallback } from "react"
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { SimpleCustomizationPanel } from "./simple-customization-panel"
import { RoomCategory } from "./room-category" // Import RoomCategory

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomItem {
  id: string
  roomType: string
  roomName: string
  roomIcon: string
  count: number
  config: RoomConfig
}

interface RoomConfiguratorProps {
  rooms: RoomItem[] // Now received as prop
  onRoomsChange: (rooms: RoomItem[]) => void // Callback for changes
  panelType?: "simple" | "enhanced" | "wizard"
  currentRoomToCustomize: RoomItem | null // Prop for current customization
  isCustomizationPanelOpen: boolean // Prop for panel open state
  onCloseCustomizationPanel: () => void // Callback to close panel
  onConfigChange: (updatedConfig: RoomConfig) => void // Callback for config changes
  onOpenCustomizationPanel: (room: RoomItem) => void // Callback to open panel
  availableRoomTypes: { type: string; name: string; icon: string; defaultConfig: RoomConfig }[] // Pass available room types
  getRoomConfigForCategory: (roomType: string) => RoomConfig | undefined // Pass the getter
}

export function RoomConfigurator({
  rooms,
  onRoomsChange,
  panelType = "enhanced",
  currentRoomToCustomize,
  isCustomizationPanelOpen,
  onCloseCustomizationPanel,
  onConfigChange,
  onOpenCustomizationPanel,
  availableRoomTypes,
  getRoomConfigForCategory,
}: RoomConfiguratorProps) {
  const roomCountsMap = useMemo(() => {
    return rooms.reduce(
      (acc, room) => {
        acc[room.roomType] = room.count
        return acc
      },
      {} as Record<string, number>,
    )
  }, [rooms])

  const numberOfDistinctSelectedRoomTypes = useMemo(() => {
    return rooms.filter((room) => room.count > 0).length
  }, [rooms])

  const addRoom = useCallback(
    (roomType: string) => {
      const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
      if (roomInfo) {
        onRoomsChange((prevRooms) => {
          const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
          if (existingRoomIndex > -1) {
            const updatedRooms = [...prevRooms]
            updatedRooms[existingRoomIndex] = {
              ...updatedRooms[existingRoomIndex],
              count: updatedRooms[existingRoomIndex].count + 1,
            }
            return updatedRooms
          } else {
            const newRoom: RoomItem = {
              id: `room-${Date.now()}`,
              roomType: roomInfo.type,
              roomName: roomInfo.name,
              roomIcon: roomInfo.icon,
              count: 1,
              config: roomInfo.defaultConfig,
            }
            return [...prevRooms, newRoom]
          }
        })
      }
    },
    [availableRoomTypes, onRoomsChange],
  )

  const removeRoom = useCallback(
    (id: string) => {
      onRoomsChange((prevRooms) => prevRooms.filter((room) => room.id !== id))
    },
    [onRoomsChange],
  )

  const decrementRoomCount = useCallback(
    (id: string) => {
      onRoomsChange((prevRooms) =>
        prevRooms
          .map((room) => {
            if (room.id === id) {
              return { ...room, count: room.count - 1 }
            }
            return room
          })
          .filter((room) => room.count > 0),
      )
    },
    [onRoomsChange],
  )

  const incrementRoomCount = useCallback(
    (id: string) => {
      onRoomsChange((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === id) {
            return { ...room, count: room.count + 1 }
          }
          return room
        }),
      )
    },
    [onRoomsChange],
  )

  const CustomizationPanelComponent = useMemo(() => {
    if (panelType === "enhanced") return EnhancedRoomCustomizationPanel
    if (panelType === "wizard") return MultiStepCustomizationWizard
    return SimpleCustomizationPanel
  }, [panelType])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Example of how you might group rooms into categories */}
        <RoomCategory
          title="Common Areas"
          description="Select and customize your living spaces."
          rooms={["living_room", "dining_room", "hallway", "entryway", "stairs"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              onRoomsChange((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  return [...prevRooms, newRoom]
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={onConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1}
        />

        <RoomCategory
          title="Private Spaces"
          description="Customize your bedrooms and bathrooms."
          rooms={["bedroom", "bathroom", "home_office", "laundry_room"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              onRoomsChange((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  return [...prevRooms, newRoom]
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={onConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1}
        />

        <RoomCategory
          title="Specialty Areas"
          description="For kitchens and other unique spaces."
          rooms={["kitchen"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              onRoomsChange((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  return [...prevRooms, newRoom]
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={onConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1}
        />
      </div>

      {currentRoomToCustomize && (
        <CustomizationPanelComponent
          isOpen={isCustomizationPanelOpen}
          onClose={onCloseCustomizationPanel}
          roomType={currentRoomToCustomize.roomType}
          roomName={currentRoomToCustomize.roomName}
          roomIcon={currentRoomToCustomize.roomIcon}
          roomCount={currentRoomToCustomize.count}
          config={currentRoomToCustomize.config}
          onConfigChange={onConfigChange}
        />
      )}
    </div>
  )
}
