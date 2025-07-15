import type { CartItem } from "@/lib/cart-context"

export type CartHealthMetric = {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  value: number
  threshold: number
  description: string
  suggestion?: string
}

export type CartHealthReport = {
  overallHealth: "healthy" | "warning" | "critical"
  score: number
  metrics: CartHealthMetric[]
  suggestions: string[]
  lastUpdated: string
}

export function analyzeCartHealth(items: CartItem[]): CartHealthReport {
  const metrics: CartHealthMetric[] = []
  const suggestions: string[] = []

  // Metric 1: Cart Size
  const cartSize = items.length
  const cartSizeMetric: CartHealthMetric = {
    id: "cart-size",
    name: "Cart Size",
    status: cartSize <= 10 ? "healthy" : cartSize <= 15 ? "warning" : "critical",
    value: cartSize,
    threshold: 10,
    description: "Number of unique items in cart",
  }

  if (cartSizeMetric.status === "warning") {
    cartSizeMetric.suggestion = "Consider reviewing your cart items to ensure you need everything."
    suggestions.push(cartSizeMetric.suggestion)
  } else if (cartSizeMetric.status === "critical") {
    cartSizeMetric.suggestion =
      "Your cart has many items. Consider splitting into multiple orders for better management."
    suggestions.push(cartSizeMetric.suggestion)
  }

  metrics.push(cartSizeMetric)

  // Metric 2: Cart Value
  const cartValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartValueMetric: CartHealthMetric = {
    id: "cart-value",
    name: "Cart Value",
    status: cartValue < 1000 ? "healthy" : cartValue < 2000 ? "warning" : "critical",
    value: cartValue,
    threshold: 1000,
    description: "Total value of items in cart",
  }

  if (cartValueMetric.status === "warning") {
    cartValueMetric.suggestion = "Your cart value is getting high. Check if you qualify for any discounts."
    suggestions.push(cartValueMetric.suggestion)
  } else if (cartValueMetric.status === "critical") {
    cartValueMetric.suggestion = "Consider splitting your high-value order into multiple smaller orders."
    suggestions.push(cartValueMetric.suggestion)
  }

  metrics.push(cartValueMetric)

  // Metric 3: Item Quantity
  const highQuantityItems = items.filter((item) => item.quantity > 5)
  const highQuantityMetric: CartHealthMetric = {
    id: "high-quantity",
    name: "High Quantity Items",
    status: highQuantityItems.length === 0 ? "healthy" : highQuantityItems.length < 3 ? "warning" : "critical",
    value: highQuantityItems.length,
    threshold: 0,
    description: "Items with quantity greater than 5",
  }

  if (highQuantityMetric.status === "warning") {
    highQuantityMetric.suggestion = "You have some items with high quantities. Verify these are correct."
    suggestions.push(highQuantityMetric.suggestion)
  } else if (highQuantityMetric.status === "critical") {
    highQuantityMetric.suggestion =
      "Multiple items have unusually high quantities. Please review to ensure this is intentional."
    suggestions.push(highQuantityMetric.suggestion)
  }

  metrics.push(highQuantityMetric)

  // Metric 4: Service Mix
  const serviceTypes = new Set(items.map((item) => item.metadata?.serviceType))
  const serviceMixMetric: CartHealthMetric = {
    id: "service-mix",
    name: "Service Mix",
    status: serviceTypes.size <= 2 ? "healthy" : serviceTypes.size <= 3 ? "warning" : "critical",
    value: serviceTypes.size,
    threshold: 2,
    description: "Different types of services in cart",
  }

  if (serviceMixMetric.status === "warning") {
    serviceMixMetric.suggestion =
      "You have several different service types. Consider scheduling them on different days."
    suggestions.push(serviceMixMetric.suggestion)
  } else if (serviceMixMetric.status === "critical") {
    serviceMixMetric.suggestion =
      "You have many different service types. We recommend splitting these into separate orders."
    suggestions.push(serviceMixMetric.suggestion)
  }

  metrics.push(serviceMixMetric)

  // Metric 5: Address Consistency
  const addresses = new Set()
  items.forEach((item) => {
    if (item.metadata?.customer?.address) {
      addresses.add(item.metadata.customer.address)
    }
  })

  const addressConsistencyMetric: CartHealthMetric = {
    id: "address-consistency",
    name: "Address Consistency",
    status: addresses.size <= 1 ? "healthy" : addresses.size <= 2 ? "warning" : "critical",
    value: addresses.size,
    threshold: 1,
    description: "Number of different service addresses",
  }

  if (addressConsistencyMetric.status === "warning") {
    addressConsistencyMetric.suggestion =
      "You have services at different addresses. Consider creating separate orders for each location."
    suggestions.push(addressConsistencyMetric.suggestion)
  } else if (addressConsistencyMetric.status === "critical") {
    addressConsistencyMetric.suggestion =
      "You have many different service addresses. We strongly recommend separate orders for each location."
    suggestions.push(addressConsistencyMetric.suggestion)
  }

  metrics.push(addressConsistencyMetric)

  // Calculate overall health score (0-100)
  const healthyMetrics = metrics.filter((m) => m.status === "healthy").length
  const warningMetrics = metrics.filter((m) => m.status === "warning").length
  const criticalMetrics = metrics.filter((m) => m.status === "critical").length

  const score = Math.round((healthyMetrics * 100 + warningMetrics * 50) / metrics.length)

  // Determine overall health status
  let overallHealth: "healthy" | "warning" | "critical" = "healthy"
  if (criticalMetrics > 0) {
    overallHealth = "critical"
  } else if (warningMetrics > metrics.length / 3) {
    overallHealth = "warning"
  }

  // Add general suggestions based on overall health
  if (overallHealth === "warning") {
    suggestions.push("Your cart has some potential issues. Review the suggestions to optimize your order.")
  } else if (overallHealth === "critical") {
    suggestions.push(
      "Your cart has several issues that may affect your checkout experience. Please review the suggestions.",
    )
  }

  return {
    overallHealth,
    score,
    metrics,
    suggestions: [...new Set(suggestions)], // Remove duplicates
    lastUpdated: new Date().toISOString(),
  }
}

// Function to get cart health from localStorage or generate a new report
export function getCartHealthReport(items: CartItem[]): CartHealthReport {
  try {
    const cachedReport = localStorage.getItem("cart-health-report")
    const cachedTimestamp = localStorage.getItem("cart-health-timestamp")

    // If we have a cached report and it's less than 5 minutes old, use it
    if (cachedReport && cachedTimestamp) {
      const timestamp = Number.parseInt(cachedTimestamp, 10)
      const now = Date.now()

      if (now - timestamp < 5 * 60 * 1000) {
        // 5 minutes
        return JSON.parse(cachedReport)
      }
    }

    // Otherwise generate a new report
    const report = analyzeCartHealth(items)

    // Cache the report
    localStorage.setItem("cart-health-report", JSON.stringify(report))
    localStorage.setItem("cart-health-timestamp", Date.now().toString())

    return report
  } catch (error) {
    console.error("Error getting cart health report:", error)

    // Return a default report if there's an error
    return {
      overallHealth: "healthy",
      score: 100,
      metrics: [],
      suggestions: ["Unable to analyze cart health. Please try again later."],
      lastUpdated: new Date().toISOString(),
    }
  }
}

// -----------------------------------------------------------------------------
// Public helper requested by the UI
// -----------------------------------------------------------------------------
export function getCartHealthSuggestions(items: CartItem[]): string[] {
  return analyzeCartHealth(items).suggestions
}
