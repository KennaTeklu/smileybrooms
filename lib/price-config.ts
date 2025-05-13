export const PRICE_CONFIG = {
  roomRates: {
    standard: {
      master_bedroom: 35,
      bedroom: 25,
      bathroom: 30,
      kitchen: 50,
      living_room: 40,
      dining_room: 30,
      office: 35,
      playroom: 30,
      mudroom: 20,
      laundry_room: 25,
      sunroom: 30,
      guest_room: 25,
      garage: 45,
    },
    detailing: {
      master_bedroom: 55,
      bedroom: 40,
      bathroom: 50,
      kitchen: 75,
      living_room: 60,
      dining_room: 45,
      office: 55,
      playroom: 45,
      mudroom: 30,
      laundry_room: 40,
      sunroom: 45,
      guest_room: 40,
      garage: 70,
    },
  },
  multipliers: {
    serviceType: {
      standard: 1.0,
      detailing: 1.8,
    },
    cleanliness: [1.0, 1.3, 1.7, 2.5], // Index 0 = level 1
    frequency: {
      one_time: { surcharge: 0.0, discount: 0.0 },
      weekly: { surcharge: 0.05, discount: 0.12 },
      biweekly: { surcharge: 0.03, discount: 0.08 },
      monthly: { surcharge: 0.0, discount: 0.05 },
      semi_annual: { surcharge: 0.1, discount: 0.15 },
      annually: { surcharge: 0.15, discount: 0.2 },
    },
    payment: {
      per_service: 0.0,
      monthly: 0.05,
      yearly: 0.18,
    },
    videoDiscount: 25,
  },
  serviceFee: 15.0, // Base service fee added to all orders
}
