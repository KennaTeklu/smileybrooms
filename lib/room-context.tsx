"use client"

import { createContext, useContext, useReducer, type ReactNode, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define types for Room Configuration
export type RoomAddon = {
  id: string
  name: string
  price: number
  quantity: number
  type: "fixed" | "per_room" | "per_item"
}

export type RoomReduction = {
  id: string
  name: string
  value: number // Can be fixed amount or percentage
  type: "fixed" | "percentage"
}

export type RoomConfig = {
  id: string
  name: string
  basePrice: number
  timeEstimate: string // e.g., "1-2 hours"
  description: string
  image: string
  category:
    | "bedroom"
    | "bathroom"
    | "kitchen"
    | "living_room"
    | "dining_room"
    | "hallway"
    | "entryway"
    | "home_office"
    | "laundry_room"
    | "stairs"
    | "custom_space"
  addons: RoomAddon[]
  reductions: RoomReduction[]
  isPriceTBD: boolean // Indicates if price is "Email for Pricing"
  paymentType: "online" | "in_person" // "online" for standard, "in_person" for custom
}

// Define the state structure for the room configurator
type RoomState = {
  roomConfigs: { [key: string]: RoomConfig }
  totalPrice: number
  totalTimeEstimate: string // Combined time estimate
  totalRooms: number
}

// Define actions for the reducer
type RoomAction =
  | { type: "ADD_ROOM"; payload: RoomConfig }
  | { type: "UPDATE_ROOM"; payload: RoomConfig }
  | { type: "REMOVE_ROOM"; payload: string }
  | { type: "SET_ROOMS"; payload: RoomConfig[] }
  | { type: "CLEAR_ROOMS" }

const initialState: RoomState = {
  roomConfigs: {},
  totalPrice: 0,
  totalTimeEstimate: "0 hours",
  totalRooms: 0,
}

// Helper function to calculate price for a single room config
export const calculateRoomPrice = (room: RoomConfig): number => {
  let price = room.basePrice

  // Apply addons
  room.addons.forEach((addon) => {
    if (addon.type === "fixed" || addon.type === "per_room") {
      price += addon.price * addon.quantity
    } else if (addon.type === "per_item") {
      // Assuming 'per_item' means per item within the room, which is 1 for a room config
      price += addon.price * addon.quantity
    }
  })

  // Apply reductions
  room.reductions.forEach((reduction) => {
    if (reduction.type === "fixed") {
      price -= reduction.value
    } else if (reduction.type === "percentage") {
      price -= price * (reduction.value / 100)
    }
  })

  return Math.max(0, price) // Ensure price doesn't go below zero
}

// Reducer function
const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  let updatedRoomConfigs = { ...state.roomConfigs }

  switch (action.type) {
    case "ADD_ROOM":
    case "UPDATE_ROOM": {
      const room = action.payload
      updatedRoomConfigs[room.id] = room
      break
    }
    case "REMOVE_ROOM": {
      delete updatedRoomConfigs[action.payload]
      break
    }
    case "SET_ROOMS": {
      updatedRoomConfigs = action.payload.reduce(
        (acc, room) => {
          acc[room.id] = room
          return acc
        },
        {} as { [key: string]: RoomConfig },
      )
      break
    }
    case "CLEAR_ROOMS":
      updatedRoomConfigs = {}
      break
    default:
      return state
  }

  // Recalculate totals
  let newTotalPrice = 0
  let newTotalRooms = 0
  const timeEstimates: number[] = []

  Object.values(updatedRoomConfigs).forEach((room) => {
    if (!room.isPriceTBD) {
      newTotalPrice += calculateRoomPrice(room)
    }
    newTotalRooms += 1 // Each room config represents one room
    // Parse time estimate (e.g., "1-2 hours" -> average 1.5 hours)
    const match = room.timeEstimate.match(/(\d+)-?(\d+)?\s*hours?/)
    if (match) {
      const min = Number.parseInt(match[1])
      const max = match[2] ? Number.parseInt(match[2]) : min
      timeEstimates.push((min + max) / 2)
    }
  })

  const totalHours = timeEstimates.reduce((sum, time) => sum + time, 0)
  let newTotalTimeEstimate = "0 hours"
  if (totalHours > 0) {
    const hours = Math.floor(totalHours)
    const minutes = Math.round((totalHours - hours) * 60)
    newTotalTimeEstimate = `${hours} hour${hours !== 1 ? "s" : ""}`
    if (minutes > 0) {
      newTotalTimeEstimate += ` ${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
  }

  return {
    ...state,
    roomConfigs: updatedRoomConfigs,
    totalPrice: newTotalPrice,
    totalTimeEstimate: newTotalTimeEstimate,
    totalRooms: newTotalRooms,
  }
}

// Define the context type
type RoomContextType = {
  roomState: RoomState
  addRoom: (room: RoomConfig) => void
  updateRoom: (room: RoomConfig) => void
  removeRoom: (id: string) => void
  setRooms: (rooms: RoomConfig[]) => void
  clearRooms: () => void
  getCalculatedRoomPrice: (room: RoomConfig) => number
  getTotalPrice: () => number // Add getTotalPrice to the context type
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomState, dispatch] = useReducer(roomReducer, initialState)
  const { toast } = useToast()

  // Function to get the calculated price for a given room config
  const getCalculatedRoomPrice = useCallback((room: RoomConfig): number => {
    return calculateRoomPrice(room)
  }, [])

  // Function to get the total price from the current state
  const getTotalPrice = useCallback((): number => {
    return roomState.totalPrice
  }, [roomState.totalPrice])

  const addRoom = useCallback(
    (room: RoomConfig) => {
      dispatch({ type: "ADD_ROOM", payload: room })
      toast({
        title: "Room Added",
        description: `${room.name} has been added to your configuration.`,
        duration: 2000,
      })
    },
    [toast],
  )

  const updateRoom = useCallback(
    (room: RoomConfig) => {
      dispatch({ type: "UPDATE_ROOM", payload: room })
      toast({
        title: "Room Updated",
        description: `${room.name} configuration has been updated.`,
        duration: 2000,
      })
    },
    [toast],
  )

  const removeRoom = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE_ROOM", payload: id })
      toast({
        title: "Room Removed",
        description: "Room has been removed from your configuration.",
        duration: 2000,
      })
    },
    [toast],
  )

  const setRooms = useCallback((rooms: RoomConfig[]) => {
    dispatch({ type: "SET_ROOMS", payload: rooms })
  }, [])

  const clearRooms = useCallback(() => {
    dispatch({ type: "CLEAR_ROOMS" })
    toast({
      title: "Configuration Cleared",
      description: "All rooms have been removed from your configuration.",
      duration: 2000,
    })
  }, [toast])

  return (
    <RoomContext.Provider
      value={{
        roomState,
        addRoom,
        updateRoom,
        removeRoom,
        setRooms,
        clearRooms,
        getCalculatedRoomPrice,
        getTotalPrice, // Provide getTotalPrice in the context value
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider")
  }
  return context
}
