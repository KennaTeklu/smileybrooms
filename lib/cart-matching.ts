/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
import type { CartItem } from "@/lib/cart-context"

/**
 * Advanced match criteria for detecting similar cart items
 * This helps prevent duplicate items while allowing variations
 *
 * @param existingItem The item already in the cart
 * @param newItem The item being added to the cart
 * @returns boolean indicating if items should be considered the same
 */
export const advancedMatchCriteria = (existingItem: CartItem, newItem: CartItem): boolean => {
  // For standard products, just check the ID
  if (
    existingItem.id === newItem.id &&
    existingItem.priceId !== "price_custom_cleaning" &&
    newItem.priceId !== "price_custom_cleaning"
  ) {
    return true
  }

  // For custom cleaning services, use advanced matching
  if (existingItem.priceId === "price_custom_cleaning" && newItem.priceId === "price_custom_cleaning") {
    // Basic service matching
    const serviceMatches =
      existingItem.metadata?.serviceType === newItem.metadata?.serviceType &&
      existingItem.metadata?.frequency === newItem.metadata?.frequency &&
      existingItem.paymentFrequency === newItem.paymentFrequency

    if (!serviceMatches) return false

    // Address matching - handle potential undefined values safely
    const existingAddress = existingItem.metadata?.customer?.address?.toLowerCase() || ""
    const newAddress = newItem.metadata?.customer?.address?.toLowerCase() || ""

    // ZIP code matching for nearby locations
    const existingZip = existingItem.metadata?.customer?.zipCode || ""
    const newZip = newItem.metadata?.customer?.zipCode || ""

    // Check if addresses match exactly or ZIP codes match
    const locationMatches =
      (existingAddress && newAddress && existingAddress === newAddress) ||
      (existingZip && newZip && existingZip === newZip)

    // Special instructions matching - consider similar if both have special instructions
    const bothHaveSpecialInstructions =
      !!existingItem.metadata?.customer?.specialInstructions && !!newItem.metadata?.customer?.specialInstructions

    // Consider items the same if service and location match
    return serviceMatches && locationMatches
  }

  return false
}

/**
 * Deep equality check for nested objects
 * Used for comparing complex cart item properties
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true

  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }

  return true
}

/**
 * Get a unique identifier for a cart item based on its properties
 * This helps with deduplication and grouping
 */
export const getItemSignature = (item: CartItem): string => {
  const serviceType = item.metadata?.serviceType || "standard"
  const frequency = item.metadata?.frequency || "one_time"
  const zipCode = item.metadata?.customer?.zipCode || "no-zip"
  const paymentFreq = item.paymentFrequency || "per_service"

  return `${item.priceId}-${serviceType}-${frequency}-${zipCode}-${paymentFreq}`
}
