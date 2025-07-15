import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique, deterministic ID for a cart item based on its room configuration.
 * This ensures that identical room configurations (room type, tier, add-ons, reductions)
 * result in the same cart item ID, allowing for proper quantity aggregation.
 *
 * @param roomConfig The room configuration object.
 * @returns A unique string ID.
 */
export const generateRoomCartItemId = (roomConfig: RoomConfig): string => {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = selectedAddOns ? [...selectedAddOns].sort().join(",") : ""
  const sortedReductions = selectedReductions ? [...selectedReductions].sort().join(",") : ""

  // Combine all relevant properties into a string to create a unique ID
  // This ID will be used to identify if an item already exists in the cart
  return `${roomType}-${selectedTier}-${sortedAddOns}-${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig.
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @param quantity The quantity of this room configuration.
 * @returns A CartItem object.
 */
export const createRoomCartItem = (roomConfig: RoomConfig, price: number, quantity = 1): CartItem => {
  const id = generateRoomCartItemId(roomConfig)
  const name = `${roomConfig.roomType.replace(/_/g, " ")} - ${roomConfig.selectedTier.replace(/_/g, " ")}`
  const priceId = `price_${id}` // Placeholder priceId, replace with actual Stripe Price ID if applicable

  return {
    id,
    name,
    price,
    priceId,
    quantity,
    paymentType: roomConfig.roomType === "custom_space" ? "in_person" : "online",
    metadata: {
      roomType: roomConfig.roomType,
      selectedTier: roomConfig.selectedTier,
      selectedAddOns: roomConfig.selectedAddOns,
      selectedReductions: roomConfig.selectedReductions,
      // Add other relevant metadata from roomConfig if needed
    },
  }
}
