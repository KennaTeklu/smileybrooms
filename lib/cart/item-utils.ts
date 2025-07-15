import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that the same room type with the same tier, add-ons, and reductions
 * always produces the same ID, allowing for consistent cart management.
 * @param config The RoomConfig object.
 * @returns A unique string ID for the cart item.
 */
export function generateRoomCartItemId(config: RoomConfig): string {
  const sortedAddOns = [...config.selectedAddOns].sort().join("-")
  const sortedReductions = [...config.selectedReductions].sort().join("-")

  // Combine room name, selected tier, sorted add-ons, and sorted reductions
  // to create a unique and deterministic ID.
  return `room-${config.roomName}-${config.selectedTier}-${sortedAddOns}-${sortedReductions}`.toLowerCase()
}

/**
 * Generates a display name for a cart item based on its room configuration.
 * @param config The RoomConfig object.
 * @returns A user-friendly string name for the cart item.
 */
export function getRoomCartItemDisplayName(config: RoomConfig): string {
  let name = `${config.roomName.replace(/([A-Z])/g, " $1").trim()} - ${config.selectedTier}`
  if (config.selectedAddOns.length > 0) {
    name += ` (+${config.selectedAddOns.length} Add-on${config.selectedAddOns.length > 1 ? "s" : ""})`
  }
  if (config.selectedReductions.length > 0) {
    name += ` (-${config.selectedReductions.length} Reduction${config.selectedReductions.length > 1 ? "s" : ""})`
  }
  return name
}
