import {
  Home,
  Bath,
  Utensils,
  Sofa,
  Coffee,
  Monitor,
  WashingMachineIcon as Laundry,
  DoorOpen,
  Waypoints,
  StepBackIcon as Stairs,
} from "lucide-react"
import { defaultTiers } from "./room-tiers" // Import defaultTiers

// Calculate the multiplier based on the new bedroom essential price
const oldBedroomBasePrice = 35.42 // This was the original base price in room-config.ts
const newBedroomEssentialPrice = defaultTiers.bedroom[0].price // 125.00
const priceMultiplier = newBedroomEssentialPrice / oldBedroomBasePrice

export const roomConfig = {
  roomTypes: [
    {
      id: "bedroom",
      name: "Bedroom",
      basePrice: Number.parseFloat((35.42 * priceMultiplier).toFixed(2)), // Original: 35.42
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "bathroom",
      name: "Bathroom",
      basePrice: Number.parseFloat((38.25 * priceMultiplier).toFixed(2)), // Original: 38.25
      icon: <Bath className="h-5 w-5" />,
    },
    {
      id: "kitchen",
      name: "Kitchen",
      basePrice: Number.parseFloat((43.75 * priceMultiplier).toFixed(2)), // Original: 43.75
      icon: <Utensils className="h-5 w-5" />,
    },
    {
      id: "living_room",
      name: "Living Room",
      basePrice: Number.parseFloat((30.0 * priceMultiplier).toFixed(2)), // Original: 30.00
      icon: <Sofa className="h-5 w-5" />,
    },
    {
      id: "dining_room",
      name: "Dining Room",
      basePrice: Number.parseFloat((25.0 * priceMultiplier).toFixed(2)), // Original: 25.00
      icon: <Coffee className="h-5 w-5" />,
    },
    {
      id: "home_office",
      name: "Home Office",
      basePrice: Number.parseFloat((25.0 * priceMultiplier).toFixed(2)), // Original: 25.00
      icon: <Monitor className="h-5 w-5" />,
    },
    {
      id: "laundry_room",
      name: "Laundry Room",
      basePrice: Number.parseFloat((20.0 * priceMultiplier).toFixed(2)), // Original: 20.00
      icon: <Laundry className="h-5 w-5" />,
    },
    {
      id: "entryway",
      name: "Entryway",
      basePrice: Number.parseFloat((15.0 * priceMultiplier).toFixed(2)), // Original: 15.00
      icon: <DoorOpen className="h-5 w-5" />,
    },
    {
      id: "hallway",
      name: "Hallway",
      basePrice: Number.parseFloat((15.0 * priceMultiplier).toFixed(2)), // Original: 15.00
      icon: <Waypoints className="h-5 w-5" />,
    },
    {
      id: "stairs",
      name: "Stairs",
      basePrice: Number.parseFloat((20.0 * priceMultiplier).toFixed(2)), // Original: 20.00
      icon: <Stairs className="h-5 w-5" />,
    },
  ],
}
