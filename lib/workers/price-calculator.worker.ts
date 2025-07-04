// This worker calculates the price based on the provided data.
// It runs in a separate thread to avoid blocking the main UI thread.

// Define a constant for the waiver discount
const WAIVER_DISCOUNT = 0.15 // 15% discount for waiver

self.onmessage = (event: MessageEvent<{ type: string; payload: any }>) => {
  if (event.data.type === "calculatePrice") {
    const { rooms, services, frequency, hasWaiver } = event.data.payload

    let totalPrice = 0
    const details: Record<string, number> = {}

    // Example: Base price per room type
    const roomPrices: Record<string, number> = {
      bedroom: 50,
      bathroom: 40,
      kitchen: 60,
      livingRoom: 55,
      diningRoom: 45,
      hallway: 30,
      entryway: 25,
      stairs: 35,
      homeOffice: 40,
      laundryRoom: 30,
    }

    // Calculate price based on rooms
    if (rooms) {
      for (const roomType in rooms) {
        const count = rooms[roomType]
        if (roomPrices[roomType]) {
          const roomCost = roomPrices[roomType] * count
          totalPrice += roomCost
          details[roomType] = roomCost
        }
      }
    }

    // Example: Additional services pricing
    const servicePrices: Record<string, number> = {
      deepCleaning: 100,
      windowCleaning: 50,
      carpetCleaning: 75,
      ovenCleaning: 40,
      fridgeCleaning: 30,
    }

    // Calculate price based on selected services
    if (services) {
      for (const serviceName of services) {
        if (servicePrices[serviceName]) {
          totalPrice += servicePrices[serviceName]
          details[serviceName] = servicePrices[serviceName]
        }
      }
    }

    // Apply frequency discount/markup (example logic)
    if (frequency === "weekly") {
      totalPrice *= 0.8 // 20% discount for weekly
      details.frequencyDiscount = totalPrice * 0.25 // Store the discount amount
    } else if (frequency === "bi-weekly") {
      totalPrice *= 0.9 // 10% discount for bi-weekly
      details.frequencyDiscount = totalPrice * 0.1 // Store the discount amount
    } else if (frequency === "monthly") {
      // No discount or markup
    }

    // Apply waiver discount if applicable
    if (hasWaiver) {
      const discountAmount = totalPrice * WAIVER_DISCOUNT
      totalPrice -= discountAmount
      details.waiverDiscount = discountAmount
    }

    // Simulate some heavy computation
    let sum = 0
    for (let i = 0; i < 100000000; i++) {
      sum += Math.sqrt(i)
    }
    // console.log('Heavy computation result:', sum); // Log to ensure computation happens

    self.postMessage({ totalPrice, details })
  }
}
