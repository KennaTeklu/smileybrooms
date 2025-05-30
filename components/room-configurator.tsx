"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, Settings, Video } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getRoomTiers } from "@/lib/room-tiers" // Removed getRoomReductions
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { SimpleCustomizationPanel } from "./simple-customization-panel"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
  videoDiscountAmount?: number
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
  initialRooms?: RoomItem[]
  onRoomsChange?: (rooms: RoomItem[]) => void
  panelType?: "simple" | "enhanced" | "wizard"
}

export function RoomConfigurator({ initialRooms = [], onRoomsChange, panelType = "enhanced" }: RoomConfiguratorProps) {
  const [rooms, setRooms] = useState<RoomItem[]>(initialRooms)
  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<RoomItem | null>(null)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false) // State for video recording

  // Memoize room types and their default configurations
  const availableRoomTypes = useMemo(
    () => [
      {
        type: "bedroom",
        name: "Bedroom",
        icon: "🛏️",
        defaultConfig: {
          roomName: "Bedroom",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("bedroom")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("bedroom")[0]?.price || 0,
        },
      },
      {
        type: "bathroom",
        name: "Bathroom",
        icon: "🛁",
        defaultConfig: {
          roomName: "Bathroom",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("bathroom")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("bathroom")[0]?.price || 0,
        },
      },
      {
        type: "kitchen",
        name: "Kitchen",
        icon: "🍳",
        defaultConfig: {
          roomName: "Kitchen",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("kitchen")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("kitchen")[0]?.price || 0,
        },
      },
      {
        type: "living_room",
        name: "Living Room",
        icon: "🛋️",
        defaultConfig: {
          roomName: "Living Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("living_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("living_room")[0]?.price || 0,
        },
      },
      {
        type: "dining_room",
        name: "Dining Room",
        icon: "🍽️",
        defaultConfig: {
          roomName: "Dining Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("dining_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("dining_room")[0]?.price || 0,
        },
      },
      {
        type: "hallway",
        name: "Hallway",
        icon: "🚶",
        defaultConfig: {
          roomName: "Hallway",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("hallway")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("hallway")[0]?.price || 0,
        },
      },
      {
        type: "home_office",
        name: "Home Office",
        icon: "🖥️",
        defaultConfig: {
          roomName: "Home Office",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("home_office")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("home_office")[0]?.price || 0,
        },
      },
      {
        type: "laundry_room",
        name: "Laundry Room",
        icon: "🧺",
        defaultConfig: {
          roomName: "Laundry Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("laundry_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("laundry_room")[0]?.price || 0,
        },
      },
      {
        type: "stairs",
        name: "Stairs",
        icon: "🪜",
        defaultConfig: {
          roomName: "Stairs",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("stairs")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("stairs")[0]?.price || 0,
        },
      },
      {
        type: "entryway",
        name: "Entryway",
        icon: "🚪",
        defaultConfig: {
          roomName: "Entryway",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("entryway")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("entryway")[0]?.price || 0,
        },
      },
    ],
    [],
  )

  // Calculate total price of all rooms
  const overallTotalPrice = useMemo(() => {
    return rooms.reduce((total, room) => total + room.config.totalPrice * room.count, 0)
  }, [rooms])

  // Add a room to the list
  const addRoom = useCallback(
    (roomType: string) => {
      const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
      if (roomInfo) {
        setRooms((prevRooms) => {
          const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
          if (existingRoomIndex > -1) {
            // If room type already exists, increment count
            const updatedRooms = [...prevRooms]
            updatedRooms[existingRoomIndex] = {
              ...updatedRooms[existingRoomIndex],
              count: updatedRooms[existingRoomIndex].count + 1,
            }
            onRoomsChange?.(updatedRooms)
            return updatedRooms
          } else {
            // Otherwise, add new room
            const newRoom: RoomItem = {
              id: `room-${Date.now()}`,
              roomType: roomInfo.type,
              roomName: roomInfo.name,
              roomIcon: roomInfo.icon,
              count: 1,
              config: roomInfo.defaultConfig,
            }
            const updatedRooms = [...prevRooms, newRoom]
            onRoomsChange?.(updatedRooms)
            return updatedRooms
          }
        })
      }
    },
    [availableRoomTypes, onRoomsChange],
  )

  // Remove a room from the list
  const removeRoom = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.filter((room) => room.id !== id)
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  // Decrement room count or remove if count is 1
  const decrementRoomCount = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms
          .map((room) => {
            if (room.id === id) {
              return { ...room, count: room.count - 1 }
            }
            return room
          })
          .filter((room) => room.count > 0) // Remove if count becomes 0
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  // Increment room count
  const incrementRoomCount = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.id === id) {
            return { ...room, count: room.count + 1 }
          }
          return room
        })
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  // Open customization panel for a specific room
  const openCustomizationPanel = useCallback((room: RoomItem) => {
    setCurrentRoomToCustomize(room)
    setIsCustomizationPanelOpen(true)
  }, [])

  // Handle configuration change from customization panel
  const handleConfigChange = useCallback(
    (updatedConfig: RoomConfig) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) =>
          room.id === currentRoomToCustomize?.id ? { ...room, config: updatedConfig } : room,
        )
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
      setIsCustomizationPanelOpen(false)
      setCurrentRoomToCustomize(null)
    },
    [currentRoomToCustomize, onRoomsChange],
  )

  const CustomizationPanelComponent = useMemo(() => {
    if (panelType === "enhanced") return EnhancedRoomCustomizationPanel
    if (panelType === "wizard") return MultiStepCustomizationWizard
    return SimpleCustomizationPanel
  }, [panelType])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {availableRoomTypes.map((roomType) => (
          <Button key={roomType.type} onClick={() => addRoom(roomType.type)} variant="outline" className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">{roomType.icon}</span>
              <span className="text-sm font-medium">{roomType.name}</span>
              <span className="text-xs text-gray-500">Add to list</span>
            </div>
          </Button>
        ))}
      </div>

      {rooms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Selected Rooms</h3>
          <div className="space-y-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{room.roomIcon}</span>
                    <div>
                      <CardTitle className="text-lg">{room.roomName}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {room.config.selectedTier}
                        {room.config.selectedAddOns.length > 0 && ` + ${room.config.selectedAddOns.length} add-on(s)`}
                      </p>
                      <p className="text-sm font-medium">
                        {formatCurrency(room.config.totalPrice)} x {room.count} ={" "}
                        {formatCurrency(room.config.totalPrice * room.count)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => decrementRoomCount(room.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-6 text-center">{room.count}</span>
                    <Button variant="outline" size="icon" onClick={() => incrementRoomCount(room.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openCustomizationPanel(room)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => removeRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="p-4 mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Additional Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowVideoRecording"
              checked={allowVideoRecording}
              onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
            />
            <Label htmlFor="allowVideoRecording" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Allow video recording for a discount
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-2xl font-bold mb-8">
        <span>Total Estimated Price:</span>
        <span>{formatCurrency(overallTotalPrice)}</span>
      </div>

      {currentRoomToCustomize && (
        <CustomizationPanelComponent
          isOpen={isCustomizationPanelOpen}
          onClose={() => setIsCustomizationPanelOpen(false)}
          roomType={currentRoomToCustomize.roomType}
          roomName={currentRoomToCustomize.roomName}
          roomIcon={currentRoomToCustomize.roomIcon}
          roomCount={currentRoomToCustomize.count}
          config={currentRoomToCustomize.config}
          onConfigChange={handleConfigChange}
          allowVideoRecording={allowVideoRecording} // Pass the prop
        />
      )}
    </div>
  )
}
