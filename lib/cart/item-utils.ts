import type { CartItem } from "./types"
import type { RoomConfig, RoomType, RoomTier, AddOn, Reduction } from "@/lib/types" // Assuming these types exist

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that items with the same configuration have the same ID,
 * allowing for proper quantity aggregation in the cart.
 * @param roomType The type of room (e.g., 'bedroom', 'bathroom').
 * @param selectedTier The selected cleaning tier.
 * @param selectedAddOns An array of selected add-on values.
 * @param selectedReductions An array of selected reduction values.
 * @returns A unique string ID for the cart item.
 */
export function generateRoomCartItemId(
  roomType: RoomType,
  selectedTier: RoomTier["value"],
  selectedAddOns: AddOn["value"][],
  selectedReductions: Reduction["value"][],
): string {
  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = [...selectedAddOns].sort().join("-")
  const sortedReductions = [...selectedReductions].sort().join("-")

  return `room-${roomType}-${selectedTier}-${sortedAddOns}-${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig.
 * @param roomConfig The room configuration object.
 * @param price The calculated price for the room.
 * @param quantity The quantity of this room configuration.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, price: number, quantity: number): CartItem {
  const id = generateRoomCartItemId(
    roomConfig.roomType,
    roomConfig.selectedTier,
    roomConfig.selectedAddOns,
    roomConfig.selectedReductions,
  )

  // Determine a more descriptive name for the cart item
  const tierName = roomConfig.selectedTier.replace(/_/g, " ") // e.g., "standard_clean" -> "standard clean"
  const roomName = roomConfig.roomType.replace(/_/g, " ") // e.g., "master_bedroom" -> "master bedroom"
  let name = `${roomName} (${tierName})`

  if (roomConfig.selectedAddOns.length > 0) {
    name += ` + ${roomConfig.selectedAddOns.length} add-on(s)`
  }
  if (roomConfig.selectedReductions.length > 0) {
    name += ` - ${roomConfig.selectedReductions.length} reduction(s)`
  }

  return {
    id: id,
    name: name,
    price: price,
    quantity: quantity,
    image: roomConfig.image || "/placeholder.svg", // Use roomConfig image if available
    description: `Cleaning service for ${roomName} with ${tierName} tier.`,
    metadata: {
      roomType: roomConfig.roomType,
      selectedTier: roomConfig.selectedTier,
      selectedAddOns: roomConfig.selectedAddOns,
      selectedReductions: roomConfig.selectedReductions,
      timeEstimate: roomConfig.timeEstimate,
      // Add any other relevant metadata from roomConfig
    },
  }
}
