export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 100,
    bedroom: 80,
    bathroom: 90,
    kitchen: 120,
    living_room: 110,
    dining_room: 70,
    office: 95,
    playroom: 85,
    mudroom: 60,
    laundry_room: 75,
    sunroom: 90,
    guest_room: 70,
    garage: 50,
  },
  frequencyMultipliers: {
    one_time: 1.0,
    weekly: 0.85, // 15% discount
    bi_weekly: 0.9, // 10% discount
    monthly: 0.95, // 5% discount
    quarterly: 0.98, // 2% discount
  },
  cleanlinessMultipliers: {
    1: 0.9, // Lightly dirty: 10% discount
    2: 0.95, // Moderately clean: 5% discount
    3: 1.0, // Standard: no change
    4: 1.05, // Quite dirty: 5% increase
    5: 1.1, // Very dirty: 10% increase
  },
  addOnPrices: {
    "oven-cleaning": 25,
    "fridge-cleaning": 20,
    "window-cleaning": 30,
    "laundry-service": 40,
  },
}
