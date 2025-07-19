"use client"

import { CartCRDT } from "./persistence"
import type { CartItem, CartState, RoomDetails } from "./types"
import { calculateItemPrice, calculateTotalPrice } from "./utils"
import { getFeatureFlag } from "@/lib/server/feature-key"
import { FEATURE_KEYS } from "@/lib/constants"

// Initialize the cart CRDT (Conflict-free Replicated Data Type)
// This ensures that cart state can be merged consistently across different sessions or devices.
const cartCRDT = new CartCRDT()

/**
 * Retrieves the current state of the shopping cart.
 * @returns {CartState} The current cart state.
 */
export function getCart(): CartState {
  return cartCRDT.getState()
}

/**
 * Adds an item to the cart or updates its quantity if it already exists.
 * @param {CartItem} item The item to add or update.
 * @returns {CartState} The updated cart state.
 */
export function addItemToCart(item: CartItem): CartState {
  const existingItem = cartCRDT.getItem(item.id)
  if (existingItem) {
    // If item exists, update its quantity
    const updatedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity }
    cartCRDT.updateItem(updatedItem)
  } else {
    // If item does not exist, add it
    cartCRDT.addItem(item)
  }
  return cartCRDT.getState()
}

/**
 * Removes an item from the cart.
 * @param {string} itemId The ID of the item to remove.
 * @returns {CartState} The updated cart state.
 */
export function removeItemFromCart(itemId: string): CartState {
  cartCRDT.removeItem(itemId)
  return cartCRDT.getState()
}

/**
 * Updates the quantity of a specific item in the cart.
 * If the quantity is set to 0 or less, the item is removed.
 * @param {string} itemId The ID of the item to update.
 * @param {number} quantity The new quantity for the item.
 * @returns {CartState} The updated cart state.
 */
export function updateItemQuantity(itemId: string, quantity: number): CartState {
  if (quantity <= 0) {
    return removeItemFromCart(itemId)
  }
  const existingItem = cartCRDT.getItem(itemId)
  if (existingItem) {
    const updatedItem = { ...existingItem, quantity }
    cartCRDT.updateItem(updatedItem)
  }
  return cartCRDT.getState()
}

/**
 * Clears all items from the cart.
 * @returns {CartState} The empty cart state.
 */
export function clearCart(): CartState {
  cartCRDT.clear()
  return cartCRDT.getState()
}

/**
 * Updates the details of a specific room in the cart.
 * @param {string} roomId The ID of the room to update.
 * @param {Partial<RoomDetails>} newDetails The new details to apply to the room.
 * @returns {CartState} The updated cart state.
 */
export function updateRoomDetails(roomId: string, newDetails: Partial<RoomDetails>): CartState {
  const currentCart = cartCRDT.getState()
  const updatedItems = currentCart.items.map((item) => {
    if (item.type === "room" && item.id === roomId) {
      const updatedRoom = { ...item.roomDetails, ...newDetails }
      return { ...item, roomDetails: updatedRoom, price: calculateItemPrice(item.type, updatedRoom) }
    }
    return item
  })
  cartCRDT.setState({ ...currentCart, items: updatedItems })
  return cartCRDT.getState()
}

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
export function getTotalCartPrice(): number {
  const cart = cartCRDT.getState()
  return calculateTotalPrice(cart.items)
}

/**
 * Checks if the advanced cart features are enabled.
 * This function is a server-side check, but its result can be used on the client.
 * @returns {Promise<boolean>} True if advanced cart features are enabled, false otherwise.
 */
export async function isAdvancedCartEnabled(): Promise<boolean> {
  // This function might be called on the server, but its result is used client-side.
  // The actual feature flag check should ideally happen on the server or be pre-fetched.
  // For now, we'll assume it's a client-side check if this file is 'use client'.
  // In a real app, you'd likely fetch this from an API route or pass it as props.
  return getFeatureFlag(FEATURE_KEYS.ADVANCED_CART)
}
