"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useCart } from "@/lib/cart-context"

interface CartAnalytics {
  sessionId: string
  cartCreatedAt: Date
  itemsAdded: number
  itemsRemoved: number
  totalInteractions: number
  timeSpent: number
  abandonmentRisk: "low" | "medium" | "high"
  conversionProbability: number
}

interface SavedCart {
  id: string
  name: string
  items: any[]
  createdAt: Date
  totalPrice: number
}

interface CartRecommendation {
  id: string
  name: string
  price: number
  reason: string
  confidence: number
}

export function useAdvancedCartFeatures() {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart()
  const [analytics, setAnalytics] = useState<CartAnalytics>({
    sessionId: crypto.randomUUID(),
    cartCreatedAt: new Date(),
    itemsAdded: 0,
    itemsRemoved: 0,
    totalInteractions: 0,
    timeSpent: 0,
    abandonmentRisk: "low",
    conversionProbability: 0.8,
  })

  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([])
  const [recommendations, setRecommendations] = useState<CartRecommendation[]>([])
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [pendingOperations, setPendingOperations] = useState<any[]>([])
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])

  const sessionStartRef = useRef(Date.now())
  const interactionTimeoutRef = useRef<NodeJS.Timeout>()

  // Track user interactions and analytics
  const trackInteraction = useCallback(
    (action: string, data?: any) => {
      setAnalytics((prev) => ({
        ...prev,
        totalInteractions: prev.totalInteractions + 1,
        timeSpent: Date.now() - sessionStartRef.current,
        ...(action === "add_item" && { itemsAdded: prev.itemsAdded + 1 }),
        ...(action === "remove_item" && { itemsRemoved: prev.itemsRemoved + 1 }),
      }))

      // Calculate abandonment risk
      const timeSpent = Date.now() - sessionStartRef.current
      const interactionRate = analytics.totalInteractions / (timeSpent / 1000 / 60) // interactions per minute

      let abandonmentRisk: "low" | "medium" | "high" = "low"
      if (timeSpent > 300000 && interactionRate < 2)
        abandonmentRisk = "high" // 5+ minutes, low interaction
      else if (timeSpent > 120000 && interactionRate < 5) abandonmentRisk = "medium" // 2+ minutes, medium interaction

      setAnalytics((prev) => ({ ...prev, abandonmentRisk }))

      // Send analytics to backend (in production)
      if (process.env.NODE_ENV === "production") {
        // Analytics API call would go here
        console.log("Analytics:", { action, data, analytics })
      }
    },
    [analytics],
  )

  // Undo/Redo functionality
  const addToUndoStack = useCallback((operation: any) => {
    setUndoStack((prev) => [...prev.slice(-9), operation]) // Keep last 10 operations
    setRedoStack([]) // Clear redo stack when new operation is added
  }, [])

  const undo = useCallback(() => {
    if (undoStack.length === 0) return

    const lastOperation = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setRedoStack((prev) => [lastOperation, ...prev])

    // Execute undo operation
    switch (lastOperation.type) {
      case "add_item":
        removeItem(lastOperation.itemId)
        break
      case "remove_item":
        addItem(lastOperation.item)
        break
      case "update_quantity":
        updateQuantity(lastOperation.itemId, lastOperation.previousQuantity)
        break
      case "clear_cart":
        lastOperation.items.forEach((item: any) => addItem(item))
        break
    }

    trackInteraction("undo", lastOperation)
  }, [undoStack, removeItem, addItem, updateQuantity, trackInteraction])

  const redo = useCallback(() => {
    if (redoStack.length === 0) return

    const operation = redoStack[0]
    setRedoStack((prev) => prev.slice(1))
    setUndoStack((prev) => [...prev, operation])

    // Execute redo operation
    switch (operation.type) {
      case "add_item":
        addItem(operation.item)
        break
      case "remove_item":
        removeItem(operation.itemId)
        break
      case "update_quantity":
        updateQuantity(operation.itemId, operation.newQuantity)
        break
      case "clear_cart":
        clearCart()
        break
    }

    trackInteraction("redo", operation)
  }, [redoStack, addItem, removeItem, updateQuantity, clearCart, trackInteraction])

  // Save cart functionality
  const saveCart = useCallback(
    (name: string) => {
      const savedCart: SavedCart = {
        id: crypto.randomUUID(),
        name,
        items: cart.items,
        createdAt: new Date(),
        totalPrice: cart.totalPrice,
      }

      setSavedCarts((prev) => [...prev, savedCart])
      localStorage.setItem("savedCarts", JSON.stringify([...savedCarts, savedCart]))
      trackInteraction("save_cart", { name, itemCount: cart.items.length })
    },
    [cart, savedCarts, trackInteraction],
  )

  const loadCart = useCallback(
    (cartId: string) => {
      const savedCart = savedCarts.find((c) => c.id === cartId)
      if (!savedCart) return

      // Save current cart state for undo
      addToUndoStack({
        type: "load_cart",
        previousItems: cart.items,
        loadedCart: savedCart,
      })

      clearCart()
      savedCart.items.forEach((item) => addItem(item))
      trackInteraction("load_cart", { cartId, itemCount: savedCart.items.length })
    },
    [savedCarts, cart.items, addToUndoStack, clearCart, addItem, trackInteraction],
  )

  const deleteSavedCart = useCallback(
    (cartId: string) => {
      setSavedCarts((prev) => prev.filter((c) => c.id !== cartId))
      const updatedCarts = savedCarts.filter((c) => c.id !== cartId)
      localStorage.setItem("savedCarts", JSON.stringify(updatedCarts))
      trackInteraction("delete_saved_cart", { cartId })
    },
    [savedCarts, trackInteraction],
  )

  // Smart recommendations based on cart content
  const generateRecommendations = useCallback(() => {
    if (cart.items.length === 0) return

    // Mock recommendation logic (in production, this would call an AI service)
    const mockRecommendations: CartRecommendation[] = [
      {
        id: "rec-1",
        name: "Deep Carpet Cleaning",
        price: 89.99,
        reason: "Customers who added bathroom cleaning often add carpet cleaning",
        confidence: 0.85,
      },
      {
        id: "rec-2",
        name: "Window Cleaning Service",
        price: 45.0,
        reason: "Complete your home cleaning package",
        confidence: 0.72,
      },
      {
        id: "rec-3",
        name: "Appliance Deep Clean",
        price: 65.0,
        reason: "Popular add-on for kitchen cleaning services",
        confidence: 0.68,
      },
    ]

    setRecommendations(mockRecommendations)
  }, [cart.items])

  // Offline support
  const handleOfflineOperation = useCallback(
    (operation: any) => {
      setPendingOperations((prev) => [...prev, { ...operation, timestamp: Date.now() }])
      localStorage.setItem("pendingCartOperations", JSON.stringify(pendingOperations))
    },
    [pendingOperations],
  )

  const syncPendingOperations = useCallback(async () => {
    if (pendingOperations.length === 0) return

    try {
      // In production, sync with backend
      console.log("Syncing pending operations:", pendingOperations)

      // Clear pending operations after successful sync
      setPendingOperations([])
      localStorage.removeItem("pendingCartOperations")
    } catch (error) {
      console.error("Failed to sync pending operations:", error)
    }
  }, [pendingOperations])

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (cart.items.length > 0) {
      localStorage.setItem(
        "autoSavedCart",
        JSON.stringify({
          items: cart.items,
          timestamp: Date.now(),
          sessionId: analytics.sessionId,
        }),
      )
    }
  }, [cart.items, analytics.sessionId])

  // Load saved data on mount
  useEffect(() => {
    const savedCartsData = localStorage.getItem("savedCarts")
    if (savedCartsData) {
      setSavedCarts(JSON.parse(savedCartsData))
    }

    const pendingOpsData = localStorage.getItem("pendingCartOperations")
    if (pendingOpsData) {
      setPendingOperations(JSON.parse(pendingOpsData))
    }

    // Load auto-saved cart if exists and is recent (within 24 hours)
    const autoSavedData = localStorage.getItem("autoSavedCart")
    if (autoSavedData) {
      const autoSaved = JSON.parse(autoSavedData)
      const isRecent = Date.now() - autoSaved.timestamp < 24 * 60 * 60 * 1000

      if (isRecent && cart.items.length === 0) {
        // Offer to restore auto-saved cart
        console.log("Auto-saved cart available for restoration")
      }
    }
  }, [cart.items.length])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      syncPendingOperations()
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncPendingOperations])

  // Auto-save timer
  useEffect(() => {
    const autoSaveInterval = setInterval(autoSave, 30000) // Auto-save every 30 seconds
    return () => clearInterval(autoSaveInterval)
  }, [autoSave])

  // Generate recommendations when cart changes
  useEffect(() => {
    const timeout = setTimeout(generateRecommendations, 1000) // Debounce recommendations
    return () => clearTimeout(timeout)
  }, [generateRecommendations])

  return {
    // Analytics
    analytics,
    trackInteraction,

    // Undo/Redo
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    addToUndoStack,

    // Saved Carts
    savedCarts,
    saveCart,
    loadCart,
    deleteSavedCart,

    // Recommendations
    recommendations,
    generateRecommendations,

    // Offline Support
    isOffline,
    pendingOperations,
    syncPendingOperations,

    // Auto-save
    autoSave,
  }
}
