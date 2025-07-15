import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context" // Assuming RoomConfig is defined here or similar

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that identical room configurations result in the same cart item ID,
 * allowing for proper quantity management in the cart.
 * @param roomConfig The configuration of the room.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = [...selectedAddOns].sort().join("-")
  const sortedReductions = [...selectedReductions].sort().join("-")

  // Combine relevant properties into a string to form the unique ID
  // Use a delimiter that won't appear in the actual values (e.g., "::")
  return `${roomType}::${selectedTier}::${sortedAddOns}::${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig.
 * @param roomConfig The room configuration.
 * @param quantity The quantity of this room configuration.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, quantity = 1): CartItem {
  const id = generateCartItemId(roomConfig)
  const name = `${roomConfig.roomName} - ${roomConfig.selectedTier}`
  const price = roomConfig.totalPrice
  const imageUrl = roomConfig.roomImage // Assuming roomImage is part of RoomConfig

  return {
    id,
    name,
    price,
    quantity,
    imageUrl,
    roomType: roomConfig.roomType,
    selectedTier: roomConfig.selectedTier,
    selectedAddOns: roomConfig.selectedAddOns,
    selectedReductions: roomConfig.selectedReductions || [], // Ensure it's an array
  }
}
