import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique and deterministic ID for a CartItem based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for consistent identification and consolidation in the cart.
 *
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort arrays to ensure deterministic stringification regardless of order
  const sortedAddOns = [...selectedAddOns].sort().join("-")
  const sortedReductions = [...selectedReductions].sort().join("-")

  return `${roomType}-${selectedTier}-${sortedAddOns}-${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig and calculated price.
 *
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, price: number): CartItem {
  const id = generateCartItemId(roomConfig)
  const name = `${roomConfig.roomType} - ${roomConfig.selectedTier} Cleaning`
  const priceId = `${roomConfig.roomType}-${roomConfig.selectedTier}-price` // Example priceId, adjust as needed

  return {
    id,
    name,
    price,
    priceId,
    quantity: 1, // Always add one instance of this specific configuration
    roomType: roomConfig.roomType,
    selectedTier: roomConfig.selectedTier,
    selectedAddOns: roomConfig.selectedAddOns,
    selectedReductions: roomConfig.selectedReductions,
    sourceSection: "pricing-page", // Example source
  }
}
