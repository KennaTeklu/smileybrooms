import { roomDisplayNames, roomIcons, defaultTiers } from "./room-tiers"

export const roomConfig = {
  roomTypes: [
    {
      id: "bedroom",
      name: roomDisplayNames.bedroom,
      icon: roomIcons.bedroom,
      basePrice: defaultTiers.bedroom.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 125.0, // Updated
      description: "Sleeping areas, including master and guest bedrooms.",
    },
    {
      id: "bathroom",
      name: roomDisplayNames.bathroom,
      icon: roomIcons.bathroom,
      basePrice: defaultTiers.bathroom.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 100.0, // Updated
      description: "Full bathrooms, half baths, and powder rooms.",
    },
    {
      id: "kitchen",
      name: roomDisplayNames.kitchen,
      icon: roomIcons.kitchen,
      basePrice: defaultTiers.kitchen.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 150.0, // Updated
      description: "Main cooking and food preparation areas.",
    },
    {
      id: "living_room", // Changed from livingRoom to living_room for consistency with price-calculator
      name: roomDisplayNames.livingRoom,
      icon: roomIcons.livingRoom,
      basePrice: defaultTiers.livingRoom.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 130.0, // Updated
      description: "Main living and entertainment spaces.",
    },
    {
      id: "dining_room", // Changed from diningRoom to dining_room for consistency with price-calculator
      name: roomDisplayNames.diningRoom,
      icon: roomIcons.diningRoom,
      basePrice: defaultTiers.diningRoom.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 90.0, // Updated
      description: "Formal or informal dining areas.",
    },
    {
      id: "home_office", // Changed from homeOffice to home_office
      name: roomDisplayNames.homeOffice,
      icon: roomIcons.homeOffice,
      basePrice: defaultTiers.homeOffice.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 110.0, // Updated
      description: "Dedicated workspaces or studies.",
    },
    {
      id: "laundry_room", // Changed from laundryRoom to laundry_room
      name: roomDisplayNames.laundryRoom,
      icon: roomIcons.laundryRoom,
      basePrice: defaultTiers.laundryRoom.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 70.0, // Updated
      description: "Areas with washer and dryer.",
    },
    {
      id: "entryway",
      name: roomDisplayNames.entryway,
      icon: roomIcons.entryway,
      basePrice: defaultTiers.entryway.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 60.0, // Updated
      description: "Main entrance areas and foyers.",
    },
    {
      id: "hallway",
      name: roomDisplayNames.hallway,
      icon: roomIcons.hallway,
      basePrice: defaultTiers.hallway.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 50.0, // Updated
      description: "Connecting passages between rooms.",
    },
    {
      id: "stairs",
      name: roomDisplayNames.stairs,
      icon: roomIcons.stairs,
      basePrice: defaultTiers.stairs.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 80.0, // Updated
      description: "Staircases and landings.",
    },
    {
      id: "other",
      name: roomDisplayNames.other,
      icon: roomIcons.other,
      basePrice: defaultTiers.default.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 25.0, // Using default essential price
      description: "Any other custom space not listed.",
    },
  ],
}
