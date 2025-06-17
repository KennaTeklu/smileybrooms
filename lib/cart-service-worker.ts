// Service Worker for offline cart functionality
const CACHE_NAME = "cart-cache-v1"
const CART_ENDPOINTS = ["/api/cart", "/api/cart/items", "/api/cart/sync"]

// Install event
self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/cart", "/static/js/cart.js", "/static/css/cart.css"])
    }),
  )
})

// Fetch event - Network first, then cache
self.addEventListener("fetch", (event: any) => {
  if (CART_ENDPOINTS.some((endpoint) => event.request.url.includes(endpoint))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone()

          // Store in cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })

          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
        }),
    )
  }
})

// Background sync for cart operations
self.addEventListener("sync", (event: any) => {
  if (event.tag === "cart-sync") {
    event.waitUntil(syncCartOperations())
  }
})

async function syncCartOperations() {
  try {
    const pendingOps = await getStoredOperations()

    for (const operation of pendingOps) {
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operation),
      })
    }

    // Clear pending operations after successful sync
    await clearStoredOperations()
  } catch (error) {
    console.error("Cart sync failed:", error)
  }
}

async function getStoredOperations() {
  // Implementation would retrieve from IndexedDB
  return []
}

async function clearStoredOperations() {
  // Implementation would clear from IndexedDB
}

export {}
