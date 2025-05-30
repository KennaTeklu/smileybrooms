"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { advancedMatchCriteria, getItemSignature } from "@/lib/cart-matching"

export type CartItem = {
  id: string
  name: string
  price: number
  priceId: string
  quantity: number
  image?: string
  sourceSection?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
}

export type CartListType = "main" | "business" | "personal" | "wishlist" | "saved"

type CartState = {
  lists: Record<CartListType, CartItem[]>
  activeList: CartListType
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: CartItem; listType?: CartListType } }
  | { type: "REMOVE_ITEM"; payload: { id: string; listType?: CartListType } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number; listType?: CartListType } }
  | { type: "MOVE_ITEM"; payload: { id: string; fromList: CartListType; toList: CartListType } }
  | { type: "SET_ACTIVE_LIST"; payload: CartListType }
  | { type: "CLEAR_LIST"; payload: CartListType }
  | { type: "CLEAR_ALL_LISTS" }

const initialState: CartState = {
  lists: {
    main: [],
    business: [],
    personal: [],
    wishlist: [],
    saved: [],
  },
  activeList: "main",
  totalItems: 0,
  totalPrice: 0,
}

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + item.price * item.quantity,
      }
    },
    { totalItems: 0, totalPrice: 0 },
  )
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, listType = state.activeList } = action.payload
      const currentList = state.lists[listType]

      // Check if there's a similar item using advanced matching criteria
      const similarItemIndex = currentList.findIndex((existingItem) => advancedMatchCriteria(existingItem, item))

      let updatedList: CartItem[]

      if (similarItemIndex >= 0) {
        updatedList = currentList.map((existingItem, index) => {
          if (index === similarItemIndex) {
            return { ...existingItem, quantity: existingItem.quantity + item.quantity }
          }
          return existingItem
        })
      } else {
        // Generate a more reliable ID for the new item
        const itemSignature = getItemSignature(item)
        const enhancedItem = {
          ...item,
          id: item.id.includes("custom-cleaning") ? `custom-cleaning-${itemSignature}` : item.id,
        }
        updatedList = [...currentList, enhancedItem]
      }

      const updatedLists = {
        ...state.lists,
        [listType]: updatedList,
      }

      // Calculate totals for the active list only
      const { totalItems, totalPrice } = calculateCartTotals(updatedLists[state.activeList])

      return {
        ...state,
        lists: updatedLists,
        totalItems,
        totalPrice,
      }
    }

    case "REMOVE_ITEM": {
      const { id, listType = state.activeList } = action.payload
      const currentList = state.lists[listType]
      const updatedList = currentList.filter((item) => item.id !== id)

      const updatedLists = {
        ...state.lists,
        [listType]: updatedList,
      }

      // Calculate totals for the active list only
      const { totalItems, totalPrice } = calculateCartTotals(updatedLists[state.activeList])

      return {
        ...state,
        lists: updatedLists,
        totalItems,
        totalPrice,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity, listType = state.activeList } = action.payload
      const currentList = state.lists[listType]
      const updatedList = currentList.map((item) => {
        if (item.id === id) {
          return { ...item, quantity }
        }
        return item
      })

      const updatedLists = {
        ...state.lists,
        [listType]: updatedList,
      }

      // Calculate totals for the active list only
      const { totalItems, totalPrice } = calculateCartTotals(updatedLists[state.activeList])

      return {
        ...state,
        lists: updatedLists,
        totalItems,
        totalPrice,
      }
    }

    case "MOVE_ITEM": {
      const { id, fromList, toList } = action.payload
      const sourceList = state.lists[fromList]
      const targetList = state.lists[toList]

      // Find the item to move
      const itemToMove = sourceList.find((item) => item.id === id)
      if (!itemToMove) return state

      // Check if a similar item exists in the target list
      const similarItemIndex = targetList.findIndex((item) => advancedMatchCriteria(item, itemToMove))

      let updatedTargetList: CartItem[]

      if (similarItemIndex >= 0) {
        // If similar item exists, merge quantities
        updatedTargetList = targetList.map((item, index) => {
          if (index === similarItemIndex) {
            return { ...item, quantity: item.quantity + itemToMove.quantity }
          }
          return item
        })
      } else {
        // Otherwise, add the item to the target list
        updatedTargetList = [...targetList, itemToMove]
      }

      // Remove the item from the source list
      const updatedSourceList = sourceList.filter((item) => item.id !== id)

      const updatedLists = {
        ...state.lists,
        [fromList]: updatedSourceList,
        [toList]: updatedTargetList,
      }

      // Calculate totals for the active list only
      const { totalItems, totalPrice } = calculateCartTotals(updatedLists[state.activeList])

      return {
        ...state,
        lists: updatedLists,
        totalItems,
        totalPrice,
      }
    }

    case "SET_ACTIVE_LIST": {
      const activeList = action.payload
      const { totalItems, totalPrice } = calculateCartTotals(state.lists[activeList])

      return {
        ...state,
        activeList,
        totalItems,
        totalPrice,
      }
    }

    case "CLEAR_LIST": {
      const listType = action.payload
      const updatedLists = {
        ...state.lists,
        [listType]: [],
      }

      // Calculate totals for the active list only
      const { totalItems, totalPrice } = calculateCartTotals(updatedLists[state.activeList])

      return {
        ...state,
        lists: updatedLists,
        totalItems,
        totalPrice,
      }
    }

    case "CLEAR_ALL_LISTS":
      return initialState

    default:
      return state
  }
}

type EnhancedCartContextType = {
  cart: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }, listType?: CartListType) => void
  removeItem: (id: string, listType?: CartListType) => void
  updateQuantity: (id: string, quantity: number, listType?: CartListType) => void
  moveItem: (id: string, fromList: CartListType, toList: CartListType) => void
  setActiveList: (listType: CartListType) => void
  clearList: (listType: CartListType) => void
  clearAllLists: () => void
  getListCount: (listType: CartListType) => number
  getListTotal: (listType: CartListType) => number
}

const EnhancedCartContext = createContext<EnhancedCartContextType | undefined>(undefined)

const STORAGE_KEY = "enhanced-cart"

export function EnhancedCartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState

        // Initialize each list
        Object.entries(parsedCart.lists).forEach(([listType, items]) => {
          items.forEach((item) => {
            dispatch({
              type: "ADD_ITEM",
              payload: {
                item,
                listType: listType as CartListType,
              },
            })
          })
        })

        // Set the active list
        dispatch({
          type: "SET_ACTIVE_LIST",
          payload: parsedCart.activeList,
        })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // Reset to initial state if there's an error
      dispatch({ type: "CLEAR_ALL_LISTS" })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
      // Notify user of the error
      if (toast) {
        toast({
          title: "Error saving cart",
          description: "There was an error saving your cart. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [cart, toast])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }, listType?: CartListType) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        item: { ...item, quantity: item.quantity || 1 },
        listType,
      },
    })

    if (toast) {
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your ${listType || cart.activeList} list`,
        duration: 3000,
      })
    }
  }

  const removeItem = (id: string, listType?: CartListType) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id, listType },
    })

    if (toast) {
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your list",
        duration: 3000,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number, listType?: CartListType) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity, listType },
    })
  }

  const moveItem = (id: string, fromList: CartListType, toList: CartListType) => {
    dispatch({
      type: "MOVE_ITEM",
      payload: { id, fromList, toList },
    })

    if (toast) {
      toast({
        title: "Item moved",
        description: `Item moved from ${fromList} to ${toList}`,
        duration: 3000,
      })
    }
  }

  const setActiveList = (listType: CartListType) => {
    dispatch({
      type: "SET_ACTIVE_LIST",
      payload: listType,
    })
  }

  const clearList = (listType: CartListType) => {
    dispatch({
      type: "CLEAR_LIST",
      payload: listType,
    })

    if (toast) {
      toast({
        title: "List cleared",
        description: `All items have been removed from your ${listType} list`,
        duration: 3000,
      })
    }
  }

  const clearAllLists = () => {
    dispatch({ type: "CLEAR_ALL_LISTS" })

    if (toast) {
      toast({
        title: "All lists cleared",
        description: "All items have been removed from all your lists",
        duration: 3000,
      })
    }
  }

  const getListCount = (listType: CartListType): number => {
    return cart.lists[listType].reduce((total, item) => total + item.quantity, 0)
  }

  const getListTotal = (listType: CartListType): number => {
    return cart.lists[listType].reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <EnhancedCartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        moveItem,
        setActiveList,
        clearList,
        clearAllLists,
        getListCount,
        getListTotal,
      }}
    >
      {children}
    </EnhancedCartContext.Provider>
  )
}

export const useEnhancedCart = () => {
  const context = useContext(EnhancedCartContext)
  if (context === undefined) {
    throw new Error("useEnhancedCart must be used within an EnhancedCartProvider")
  }
  return context
}
