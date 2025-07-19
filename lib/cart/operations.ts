import type { CartItem, NormalizedCartState, CartAction } from "./types"
import { generateCompositeKey, normalizeCartItem, calculateCartSummary, validateQuantity } from "./utils"
import { cartDB, CartCRDT } from "./persistence"

export class CartOperations {
  private crdt: CartCRDT
  private batchQueue: CartAction[] = []
  private batchTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.crdt = new CartCRDT()
  }

  // Add item with normalization and composite key generation
  async addItem(state: NormalizedCartState, itemData: Partial<CartItem>): Promise<NormalizedCartState> {
    const startTime = performance.now()

    try {
      // Normalize incoming data
      const normalizedItem = normalizeCartItem(itemData)

      // Generate composite key
      const compositeKey = generateCompositeKey(normalizedItem.id, normalizedItem.sku)

      // Find existing item or create new one
      const existingIndex = state.items.findIndex(
        (item) => generateCompositeKey(item.id, item.sku).hash === compositeKey.hash,
      )

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        // Update existing item quantity
        newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + normalizedItem.quantity,
        }
      } else {
        // Add new item
        newItems = [...state.items, normalizedItem]
      }

      // Recalculate summary
      const summary = calculateCartSummary(newItems)

      // Create new state
      const newState: NormalizedCartState = {
        ...state,
        items: newItems,
        summary,
        lastModified: Date.now(),
        conflictResolution: {
          vectorClock: this.crdt.getVectorClock(),
          nodeId: this.crdt.getNodeId(),
        },
      }

      // Persist state
      await this.persistState(newState)

      // Log performance
      const duration = performance.now() - startTime
      if (duration > 100) {
        console.warn(`Add item operation took ${duration}ms (target: <100ms)`)
      }

      return newState
    } catch (error) {
      console.error("Failed to add item:", error)
      throw error
    }
  }

  // Remove item
  async removeItem(state: NormalizedCartState, itemId: string, sku: string): Promise<NormalizedCartState> {
    const startTime = performance.now()

    try {
      const compositeKey = generateCompositeKey(itemId, sku)

      const newItems = state.items.filter((item) => generateCompositeKey(item.id, item.sku).hash !== compositeKey.hash)

      const summary = calculateCartSummary(newItems)

      const newState: NormalizedCartState = {
        ...state,
        items: newItems,
        summary,
        lastModified: Date.now(),
        conflictResolution: {
          vectorClock: this.crdt.getVectorClock(),
          nodeId: this.crdt.getNodeId(),
        },
      }

      await this.persistState(newState)

      const duration = performance.now() - startTime
      if (duration > 100) {
        console.warn(`Remove item operation took ${duration}ms (target: <100ms)`)
      }

      return newState
    } catch (error) {
      console.error("Failed to remove item:", error)
      throw error
    }
  }

  // Update quantity with validation
  async updateQuantity(
    state: NormalizedCartState,
    itemId: string,
    sku: string,
    quantity: number,
  ): Promise<NormalizedCartState> {
    const startTime = performance.now()

    try {
      const validatedQuantity = validateQuantity(quantity)
      const compositeKey = generateCompositeKey(itemId, sku)

      const newItems = state.items.map((item) => {
        if (generateCompositeKey(item.id, item.sku).hash === compositeKey.hash) {
          return { ...item, quantity: validatedQuantity }
        }
        return item
      })

      const summary = calculateCartSummary(newItems)

      const newState: NormalizedCartState = {
        ...state,
        items: newItems,
        summary,
        lastModified: Date.now(),
        conflictResolution: {
          vectorClock: this.crdt.getVectorClock(),
          nodeId: this.crdt.getNodeId(),
        },
      }

      await this.persistState(newState)

      const duration = performance.now() - startTime
      if (duration > 100) {
        console.warn(`Update quantity operation took ${duration}ms (target: <100ms)`)
      }

      return newState
    } catch (error) {
      console.error("Failed to update quantity:", error)
      throw error
    }
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Coupon handling
  // ────────────────────────────────────────────────────────────────────────────────
  /**
   * Apply a coupon code to the current cart state.
   * For now this is a demo implementation that recognises a single
   * code (`SAVE10`) and applies a 10 % discount to the subtotal.
   * Extend this logic to fetch real coupon data from your backend.
   *
   * @param state The current cart state
   * @param code  The coupon code entered by the user (case-insensitive)
   */
  async applyCouponCode(state: NormalizedCartState, code: string): Promise<NormalizedCartState> {
    const startTime = performance.now()

    // Normalise code
    const normalised = code.trim().toUpperCase()

    // You can replace this with an async call to your coupons DB
    const isValid = normalised === "SAVE10"
    const discountRate = isValid ? 0.1 : 0

    // Recalculate discounts
    const newItems = [...state.items]
    const summary = calculateCartSummary(newItems)
    const couponDiscount = summary.subTotal * discountRate

    const newState: NormalizedCartState = {
      ...state,
      items: newItems,
      summary: {
        ...summary,
        discounts: summary.discounts + couponDiscount,
        grandTotal: summary.subTotal - (summary.discounts + couponDiscount) + summary.shipping + summary.taxes,
      },
      lastModified: Date.now(),
      couponCode: isValid ? normalised : undefined,
      couponDiscount: isValid ? couponDiscount : 0,
    }

    // Persist & performance log
    await this.persistState(newState)
    const duration = performance.now() - startTime
    if (duration > 100) {
      console.warn(`Apply coupon operation took ${duration}ms (target: <100ms)`)
    }

    return newState
  }

  // Batch operations for performance
  private async persistState(state: NormalizedCartState): Promise<void> {
    this.crdt.incrementClock()
    await cartDB.saveCart(state)
  }

  // Load initial state
  async loadInitialState(): Promise<NormalizedCartState> {
    const saved = await cartDB.loadCart()

    if (saved) {
      return saved
    }

    // Return empty state
    return {
      items: [],
      summary: {
        subTotal: 0,
        discounts: 0,
        shipping: 0,
        taxes: 0,
        grandTotal: 0,
      },
      version: 1,
      lastModified: Date.now(),
      conflictResolution: {
        vectorClock: this.crdt.getVectorClock(),
        nodeId: this.crdt.getNodeId(),
      },
    }
  }
}
