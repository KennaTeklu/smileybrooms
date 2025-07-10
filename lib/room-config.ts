import { roomImages } from "@/lib/room-tiers"
import {
  Home,
  Bath,
  Utensils,
  Sofa,
  BookOpen,
  WashingMachineIcon as Laundry,
  DoorOpen,
  Waypoints,
  StepBackIcon as Stairs,
} from "lucide-react"

export interface RoomType {
  id: string
  name: string
  icon: JSX.Element
  basePrice: number
  image: string
  description: string
}

// Original base prices (before proportional adjustment)
const originalBasePrices = {
  bedroom: 35.42,
  bathroom: 30.0,
  kitchen: 45.0,
  livingRoom: 40.0,
  diningRoom: 25.0,
  homeOffice: 33.0,
  laundryRoom: 20.0,
  entryway: 18.0,
  hallway: 15.0,
  stairs: 24.0,
}

// Target bedroom price for "Essential Clean"
const targetBedroomPrice = 125.0

// Calculate the multiplier based on the bedroom price increase
const multiplier = targetBedroomPrice / originalBasePrices.bedroom

// Function to calculate new price, rounded to nearest cent
const calculateNewPrice = (originalPrice: number) => {
  return Number.parseFloat((originalPrice * multiplier).toFixed(2))
}

const roomTypes = [
  {
    id: "bedroom",
    name: "Bedroom",
    icon: <Home className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.bedroom),
    image: roomImages.bedroom,
    description: "Sleeping area, including dusting, vacuuming, and bed making.",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: <Bath className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.bathroom),
    image: roomImages.bathroom,
    description: "Toilet, sink, shower, and floor cleaning.",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: <Utensils className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.kitchen),
    image: roomImages.kitchen,
    description: "Countertops, sink, stovetop, and appliance exteriors.",
  },
  {
    id: "livingRoom",
    name: "Living Room",
    icon: <Sofa className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.livingRoom),
    image: roomImages.livingRoom,
    description: "Dusting, vacuuming, and general tidying of common areas.",
  },
  {
    id: "diningRoom",
    name: "Dining Room",
    icon: <Sofa className="h-6 w-6" />, // Reusing Sofa icon, consider a specific one if available
    basePrice: calculateNewPrice(originalBasePrices.diningRoom),
    image: roomImages.diningRoom,
    description: "Table, chairs, and floor cleaning.",
  },
  {
    id: "homeOffice",
    name: "Home Office",
    icon: <BookOpen className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.homeOffice),
    image: roomImages.homeOffice,
    description: "Desk, shelves, and floor cleaning.",
  },
  {
    id: "laundryRoom",
    name: "Laundry Room",
    icon: <Laundry className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.laundryRoom),
    image: roomImages.laundryRoom,
    description: "Surfaces, floor, and appliance exteriors.",
  },
  {
    id: "entryway",
    name: "Entryway",
    icon: <DoorOpen className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.entryway),
    image: roomImages.entryway,
    description: "Floor, surfaces, and general tidying.",
  },
  {
    id: "hallway",
    name: "Hallway",
    icon: <Waypoints className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.hallway),
    image: roomImages.hallway,
    description: "Floor, baseboards, and wall spot cleaning.",
  },
  {
    id: "stairs",
    name: "Stairs",
    icon: <Stairs className="h-6 w-6" />,
    basePrice: calculateNewPrice(originalBasePrices.stairs),
    image: roomImages.stairs,
    description: "Vacuuming, railing wipe, and step cleaning.",
  },
]

export const roomConfig = {
  serviceFee: 50,
  frequencyMultipliers: {
    one_time: 2.17,
    weekly: 1.0,
    biweekly: 1.2,
    monthly: 1.54,
    semi_annual: 1.92,
    annually: 2.56,
    vip_daily: 7.5,
  },
  roomTypes: roomTypes,
  // initialRoomConfigs can be derived from roomTypes if needed, or removed if not used elsewhere
  // For now, let's keep it consistent with the previous structure, but derived.
  initialRoomConfigs: Object.fromEntries(
    roomTypes.map((roomType) => [
      roomType.id,
      {
        roomName: roomType.name,
        roomIcon: roomType.icon,
        roomImage: roomType.image,
        selectedTier: "", // This might need to be set based on a default tier from room-tiers.ts
        selectedAddOns: [],
        selectedReductions: [],
        totalPrice: roomType.basePrice,
        estimatedDuration: "N/A", // Placeholder
        detailedTasks: [], // Placeholder
        notIncludedTasks: [], // Placeholder
        upsellMessage: "", // Placeholder
      },
    ]),
  ),
}
