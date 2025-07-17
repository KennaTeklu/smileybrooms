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

  // Batch add multiple items for better performance
  async addItems(state: NormalizedCartState, items: Partial<CartItem>[]): Promise<NormalizedCartState> {
    const startTime = performance.now()

    try {
      const currentState = state
      const normalizedItems = items.map((item) => normalizeCartItem(item))

      // Process all items in a single operation
      const updatedItems = [...currentState.items]

      for (const normalizedItem of normalizedItems) {
        const compositeKey = generateCompositeKey(normalizedItem.id, normalizedItem.sku)
        const existingIndex = updatedItems.findIndex(
          (item) => generateCompositeKey(item.id, item.sku).hash === compositeKey.hash,
        )

        if (existingIndex >= 0) {
          // Update existing item quantity
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + normalizedItem.quantity,
          }
        } else {
          // Add new item
          updatedItems.push(normalizedItem)
        }
      }

      // Recalculate summary once for all items
      const summary = calculateCartSummary(updatedItems)

      // Create new state
      const newState: NormalizedCartState = {
        ...currentState,
        items: updatedItems,
        summary,
        lastModified: Date.now(),
        conflictResolution: {
          vectorClock: this.crdt.getVectorClock(),
          nodeId: this.crdt.getNodeId(),
        },
      }

      // Persist state once
      await this.persistState(newState)

      // Log performance
      const duration = performance.now() - startTime
      if (duration > 200) {
        console.warn(`Batch add items operation took ${duration}ms (target: <200ms)`)
      }

      return newState
    } catch (error) {
      console.error("Failed to add items:", error)
      throw error
    }
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
