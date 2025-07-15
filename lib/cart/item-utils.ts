import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for consistent identification and quantity updates in the cart.
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = [...selectedAddOns].sort()
  const sortedReductions = [...selectedReductions].sort()

  // Create a unique string based on all relevant properties
  return `${roomType}-${selectedTier}-${sortedAddOns.join(",")}-${sortedReductions.join(",")}`
}

/**
 * Creates a CartItem object from a RoomConfig.
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @param name The display name for the cart item.
 * @param image Optional image URL for the item.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(
  roomConfig: RoomConfig,
  price: number,
  name: string,
  image?: string,
): CartItem {
  return {
    id: generateCartItemId(roomConfig),
    name: name,
    price: price,
    quantity: 1, // Always 1 for a room configuration, quantity is handled by the room count
    image: image,
    paymentType: "online", // Default payment type for room cleaning
    metadata: {
      roomType: roomConfig.roomType,
      selectedTier: roomConfig.selectedTier,
      selectedAddOns: roomConfig.selectedAddOns,
      selectedReductions: roomConfig.selectedReductions,
      // Add other relevant metadata from roomConfig if needed
    },
  }
}
