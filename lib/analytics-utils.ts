"use client"

import { track } from "@vercel/analytics"

/**
 * Track cart events with Vercel Analytics
 */
export function trackCartEvent(eventName: string, properties: Record<string, any>) {
  try {
    track(eventName, properties)
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

/**
 * Track when an item is added to the cart
 */
export function trackAddToCart(item: {
  id: string
  name: string
  price: number
  sourceSection?: string
}) {
  trackCartEvent("add_to_cart", {
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    source_section: item.sourceSection || "Unknown",
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track when an item is removed from the cart
 */
export function trackRemoveFromCart(item: {
  id: string
  name: string
  price: number
}) {
  trackCartEvent("remove_from_cart", {
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track when the cart is viewed
 */
export function trackViewCart(items: Array<any>, totalPrice: number) {
  trackCartEvent("view_cart", {
    items_count: items.length,
    total_price: totalPrice,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track when checkout is initiated
 */
export function trackBeginCheckout(items: Array<any>, totalPrice: number) {
  trackCartEvent("begin_checkout", {
    items_count: items.length,
    total_price: totalPrice,
    timestamp: new Date().toISOString(),
  })
}
