export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 49.99,
    bedroom: 39.99,
    bathroom: 44.99,
    kitchen: 59.99,
    living_room: 49.99,
    dining_room: 39.99,
    office: 34.99,
    playroom: 39.99,
    mudroom: 29.99,
    laundry_room: 29.99,
    sunroom: 34.99,
    guest_room: 39.99,
    garage: 69.99,
  },
  frequencyMultipliers: {
    one_time: 1,
    weekly: 0.8,
    bi_weekly: 0.85,
    monthly: 0.9,
  },
  serviceFee: 19.99,
  cleaningTypes: {
    regular: {
      basePrice: 129.99,
      description: "Standard cleaning for maintained homes",
    },
    deep: {
      basePrice: 199.99,
      description: "Thorough cleaning for homes needing extra attention",
    },
    move: {
      basePrice: 249.99,
      description: "Comprehensive cleaning for moving transitions",
    },
  },
  cleanlinessLevels: {
    light: {
      multiplier: 1,
      description: "Mostly clean, needs light maintenance",
    },
    medium: {
      multiplier: 1.25,
      description: "Moderately dirty, standard cleaning recommended",
    },
    heavy: {
      multiplier: 1.5,
      description: "Very dirty, needs deep cleaning",
    },
  },
}

export const roomTypes = [
  { id: "bedroom", label: "Bedroom", icon: "bed" },
  { id: "bathroom", label: "Bathroom", icon: "bath" },
  { id: "kitchen", label: "Kitchen", icon: "utensils" },
  { id: "living_room", label: "Living Room", icon: "couch" },
  { id: "dining_room", label: "Dining Room", icon: "utensils" },
  { id: "office", label: "Office", icon: "briefcase" },
  { id: "laundry_room", label: "Laundry Room", icon: "tshirt" },
  { id: "hallway", label: "Hallway", icon: "door-open" },
  { id: "staircase", label: "Staircase", icon: "stairs" },
  { id: "basement", label: "Basement", icon: "warehouse" },
  { id: "garage", label: "Garage", icon: "car" },
  { id: "other", label: "Other", icon: "plus" },
]

export const frequencyOptions = [
  { id: "one_time", label: "One-Time Cleaning" },
  { id: "weekly", label: "Weekly", discount: "30% off" },
  { id: "biweekly", label: "Biweekly", discount: "25% off" },
  { id: "monthly", label: "Monthly", discount: "20% off" },
  { id: "semi_annual", label: "Semi-Annual", discount: "15% off" },
  { id: "annually", label: "Annual", discount: "10% off" },
  { id: "vip_daily", label: "VIP Daily", discount: "40% off" },
]

export const paymentFrequencyOptions = [
  { id: "per_service", label: "Pay Per Service" },
  { id: "monthly", label: "Monthly Subscription", discount: "5% off" },
  { id: "yearly", label: "Annual Subscription", discount: "15% off" },
]
