"use client"

import { useMemo } from "react"

/**
 * Custom hook to determine if multiple room types are selected
 * Algorithm: Count room types with count > 0, return true if > 1
 */
export const useMultiSelection = (roomCounts: Record<string, number>) => {
  return useMemo(() => {
    const selectedRoomTypesCount = Object.values(roomCounts).filter((count) => count > 0).length
    return selectedRoomTypesCount > 1
  }, [roomCounts])
}
