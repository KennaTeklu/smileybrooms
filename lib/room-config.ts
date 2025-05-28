// lib/room-config.ts

import { getRoomTiers } from "./room-tiers"

// Add console.log to verify tiers are loading
console.log("Loading tiers for bedroom:", getRoomTiers("bedroom"))

export const roomConfigs = [
  {
    id: "bedroom-1",
    name: "Bedroom",
    type: "bedroom", // This must match the key in defaultTiers
    icon: "🛏️",
    description: "A cozy bedroom for a good night's sleep.",
    baseCost: 100,
    costMultiplier: 1.1,
  },
  {
    id: "kitchen-1",
    name: "Kitchen",
    type: "kitchen",
    icon: "🍳",
    description: "A fully equipped kitchen for all your culinary needs.",
    baseCost: 150,
    costMultiplier: 1.2,
  },
  {
    id: "living-room-1",
    name: "Living Room",
    type: "living-room",
    icon: "🛋️",
    description: "A comfortable living room for relaxation and entertainment.",
    baseCost: 200,
    costMultiplier: 1.3,
  },
  {
    id: "bathroom-1",
    name: "Bathroom",
    type: "bathroom",
    icon: "🛁",
    description: "A modern bathroom with all the amenities.",
    baseCost: 120,
    costMultiplier: 1.15,
  },
  {
    id: "office-1",
    name: "Office",
    type: "office",
    icon: "🏢",
    description: "A dedicated office space for work and productivity.",
    baseCost: 180,
    costMultiplier: 1.25,
  },
]
