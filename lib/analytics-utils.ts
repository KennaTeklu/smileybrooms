// Track adding an item to the cart
export function trackAddToCart(item: { id: string; name: string; price: number; sourceSection?: string }) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "USD",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_category: "Cleaning Services",
            item_list_name: item.sourceSection || "Product List",
          },
        ],
      })
    }
  } catch (error) {
    console.error("Error tracking add to cart:", error)
  }
}

// Track removing an item from the cart
export function trackRemoveFromCart(item: { id: string; name: string; price: number }) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "remove_from_cart", {
        currency: "USD",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_category: "Cleaning Services",
          },
        ],
      })
    }
  } catch (error) {
    console.error("Error tracking remove from cart:", error)
  }
}

// Track viewing the cart
export function trackViewCart(items: any[], totalValue: number) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_cart", {
        currency: "USD",
        value: totalValue,
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: "Cleaning Services",
        })),
      })
    }
  } catch (error) {
    console.error("Error tracking view cart:", error)
  }
}

// Track beginning checkout
export function trackBeginCheckout(items: any[], totalValue: number) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "USD",
        value: totalValue,
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: "Cleaning Services",
        })),
      })
    }
  } catch (error) {
    console.error("Error tracking begin checkout:", error)
  }
}

// Track purchase completion
export function trackPurchase(transactionId: string, items: any[], totalValue: number) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        value: totalValue,
        currency: "USD",
        tax: totalValue * 0.07, // Assuming 7% tax
        shipping: 0,
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: "Cleaning Services",
        })),
      })
    }
  } catch (error) {
    console.error("Error tracking purchase:", error)
  }
}
