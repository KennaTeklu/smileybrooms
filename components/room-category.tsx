"use client"
import { useState, useCallback } from "react"
import RoomConfigurator from "./room-configurator"
import type { RoomConfig } from "@/types"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"

interface RoomCategoryProps {
  categoryName: string
  rooms: {
    id: string
    name: string
    icon: string
    type: string
  }[]
  roomConfigs: { [roomId: string]: RoomConfig }
  onRoomConfigChange: (roomId: string, config: RoomConfig) => void
}

export function RoomCategory({ categoryName, rooms, roomConfigs, onRoomConfigChange }) {
  const [expandedRooms, setExpandedRooms] = useState<{ [roomId: string]: boolean }>({})

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }))
  }

  const handleConfigChange = useCallback(
    (roomId: string, config: RoomConfig) => {
      onRoomConfigChange(roomId, config)
    },
    [onRoomConfigChange],
  )

  return (
    <div>
      <h3>{categoryName}</h3>
      {rooms.map((room) => (
        <div key={room.id}>
          <div onClick={() => toggleRoomExpansion(room.id)} style={{ cursor: "pointer" }}>
            {room.icon} {room.name}
          </div>
          {expandedRooms[room.id] && (
            <RoomConfigurator
              roomName={room.name}
              roomIcon={room.icon}
              baseTier={getRoomTiers(room.type)[0]}
              tiers={getRoomTiers(room.type)}
              addOns={getRoomAddOns(room.type)}
              reductions={getRoomReductions(room.type)}
              onConfigChange={(config) => handleConfigChange(room.id, config)}
              initialConfig={roomConfigs[room.id]}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default RoomCategory
