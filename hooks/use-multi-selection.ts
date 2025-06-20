"use client"

import { useMemo } from "react"

export const useMultiSelection = (roomCounts: Record<string, number>) => {
  return useMemo(() => {
    const selectedRoomTypesCount = Object.values(roomCounts).filter((count) => count > 0).length
    return selectedRoomTypesCount > 1
  }, [roomCounts])
}
