"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import { getRoomTiers } from "@/lib/room-tiers" // Ensure this path is correct

// Define types for room configuration
export interface RoomConfig {
  roomType: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
}

// Define the state structure for the room context
interface RoomState {
  roomCounts: Record<string, number>
  roomConfigs: Record<string, RoomConfig>
}

// Define action types for the reducer
type RoomActionType = "UPDATE_COUNT" | "UPDATE_CONFIG" | "SET_INITIAL_STATE"

// Define the structure for room actions
interface RoomAction {
  type: RoomActionType
  payload: any
}

// Local storage key for persistence
const LOCAL_STORAGE_ROOM_STATE_KEY = "smileybrooms_room_state"

// Initial state for the room context
const initialRoomState: RoomState = {
  roomCounts: {},
  roomConfigs: {},
}

// Reducer function to manage room state
const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case "UPDATE_COUNT":
      const { roomType: countRoomType, count } = action.payload
      return {
        ...state,
        roomCounts: {
          ...state.roomCounts,
          [countRoomType]: count,
        },
      }
    case "UPDATE_CONFIG":
      const { roomType: configRoomType, config } = action.payload
      return {
        ...state,
        roomConfigs: {
          ...state.roomConfigs,
          [configRoomType]: config,
        },
      }
    case "SET_INITIAL_STATE":
      return action.payload
    default:
      return state
  }
}

// Create the Room Context
interface RoomContextType {
  roomCounts: Record<string, number>
  roomConfigs: Record<string, RoomConfig>
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, config: RoomConfig) => void
  calculateRoomPrice: (roomType: string, tier: string, addOns: string[], reductions: string[]) => number
  calculateTotalPrice: () => number
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined)

// Create the Room Provider component
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialRoomState)

  // Load state from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem(LOCAL_STORAGE_ROOM_STATE_KEY)
      if (storedState) {
        try {
          const parsedState: RoomState = JSON.parse(storedState)
          dispatch({ type: "SET_INITIAL_STATE", payload: parsedState })
        } catch (error) {
          console.error("Failed to parse stored room state:", error)
          // If parsing fails, clear the invalid data
          localStorage.removeItem(LOCAL_STORAGE_ROOM_STATE_KEY)
        }
      }
    }
  }, [])

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_ROOM_STATE_KEY, JSON.stringify(state))
    }
  }, [state])

  const updateRoomCount = useCallback((roomType: string, count: number) => {
    dispatch({ type: "UPDATE_COUNT", payload: { roomType, count } })
  }, [])

  const updateRoomConfig = useCallback((roomType: string, config: RoomConfig) => {
    dispatch({ type: "UPDATE_CONFIG", payload: { roomType, config } })
  }, [])

  const calculateRoomPrice = useCallback(
    (roomType: string, tier: string, addOns: string[], reductions: string[]): number => {
      const roomTiers = getRoomTiers()
      const roomData = roomTiers[roomType]

      if (!roomData) {
        console.warn(`Room type "${roomType}" not found in room tiers.`)
        return 0
      }

      const basePrice = roomData.tiers[tier]?.price || 0

      // Calculate add-on costs
      const addOnCost = addOns.reduce((sum, addOnId) => {
        const addOn = roomData.addOns?.find((a) => a.id === addOnId)
        return sum + (addOn?.price || 0)
      }, 0)

      // Calculate reduction savings
      const reductionSavings = reductions.reduce((sum, reductionId) => {
        const reduction = roomData.reductions?.find((r) => r.id === reductionId)
        return sum + (reduction?.price || 0)
      }, 0)

      return basePrice + addOnCost - reductionSavings
    },
    [],
  )

  const calculateTotalPrice = useCallback((): number => {
    return Object.entries(state.roomCounts).reduce((total, [roomType, count]) => {
      if (count > 0 && state.roomConfigs[roomType]) {
        const config = state.roomConfigs[roomType]
        const roomPrice = calculateRoomPrice(
          roomType,
          config.selectedTier,
          config.selectedAddOns,
          config.selectedReductions,
        )
        return total + roomPrice * count
      }
      return total
    }, 0)
  }, [state.roomCounts, state.roomConfigs, calculateRoomPrice])

  return (
    <RoomContext.Provider
      value={{
        roomCounts: state.roomCounts,
        roomConfigs: state.roomConfigs,
        updateRoomCount,
        updateRoomConfig,
        calculateRoomPrice,
        calculateTotalPrice,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

// Custom hook to use the room context
export const useRoomContext = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
