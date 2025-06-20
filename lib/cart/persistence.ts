import type { NormalizedCartState, CartAction } from "./types"

// IndexedDB wrapper with versioning
class CartDatabase {
  private dbName = "CartDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create cart store
        if (!db.objectStoreNames.contains("cart")) {
          const cartStore = db.createObjectStore("cart", { keyPath: "id" })
          cartStore.createIndex("lastModified", "lastModified", { unique: false })
        }

        // Create actions store for CRDT
        if (!db.objectStoreNames.contains("actions")) {
          const actionsStore = db.createObjectStore("actions", { keyPath: "timestamp" })
          actionsStore.createIndex("nodeId", "nodeId", { unique: false })
        }
      }
    })
  }

  async saveCart(state: NormalizedCartState): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["cart"], "readwrite")
    const store = transaction.objectStore("cart")

    await new Promise<void>((resolve, reject) => {
      const request = store.put({ id: "current", ...state })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Also save to localStorage as fallback
    localStorage.setItem("cart-state", JSON.stringify(state))
  }

  async loadCart(): Promise<NormalizedCartState | null> {
    if (!this.db) await this.init()

    try {
      const transaction = this.db!.transaction(["cart"], "readonly")
      const store = transaction.objectStore("cart")

      const state = await new Promise<NormalizedCartState | null>((resolve, reject) => {
        const request = store.get("current")
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })

      return state
    } catch (error) {
      // Fallback to localStorage
      const fallback = localStorage.getItem("cart-state")
      return fallback ? JSON.parse(fallback) : null
    }
  }

  async saveAction(action: CartAction): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["actions"], "readwrite")
    const store = transaction.objectStore("actions")

    await new Promise<void>((resolve, reject) => {
      const request = store.add(action)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const cartDB = new CartDatabase()

// CRDT implementation for conflict resolution
export class CartCRDT {
  private nodeId: string
  private vectorClock: Record<string, number> = {}

  constructor() {
    this.nodeId = localStorage.getItem("cart-node-id") || crypto.randomUUID()
    localStorage.setItem("cart-node-id", this.nodeId)
  }

  incrementClock(): void {
    this.vectorClock[this.nodeId] = (this.vectorClock[this.nodeId] || 0) + 1
  }

  merge(remoteState: NormalizedCartState, localState: NormalizedCartState): NormalizedCartState {
    // Simple last-write-wins for now, can be enhanced with more sophisticated CRDT logic
    if (remoteState.lastModified > localState.lastModified) {
      return remoteState
    }
    return localState
  }

  getNodeId(): string {
    return this.nodeId
  }

  getVectorClock(): Record<string, number> {
    return { ...this.vectorClock }
  }
}
