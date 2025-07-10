import { defaultTiers } from "./room-tiers"

export interface ServiceFeature {
  feature: string
  essential: boolean
  advanced: boolean
  premium: boolean
}

// Define service features for each room type
const serviceFeaturesData: Record<string, ServiceFeature[]> = {
  bedroom: [
    {
      feature: "Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Vacuuming/Sweeping",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Mirror/Glass Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Under-Bed Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Baseboard Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Closet Organization",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Mattress Steaming/Sanitization",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Light Fixture Detailed Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Wall Spot Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  bathroom: [
    {
      feature: "Sink & Counter Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Toilet Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Shower/Tub Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Mopping",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Grout Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Cabinet Exterior Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Cabinet Interior Organization",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Exhaust Fan Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Fixture Polishing",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  kitchen: [
    {
      feature: "Countertop Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Sink & Faucet Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Stovetop & Microwave Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Appliance Exterior Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Oven Interior Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Refrigerator Interior Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Cabinet Fronts Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Pantry Organization",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  livingRoom: [
    {
      feature: "Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Vacuuming",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Coffee/End Table Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Furniture Vacuuming",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Under Furniture Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Baseboard Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Electronics Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Upholstery Spot Treatment",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Ceiling Fan Detailed Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  diningRoom: [
    {
      feature: "Table & Chair Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Vacuum/Sweep",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Light Fixture Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Table Polishing",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Chair Detailed Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "China Cabinet Exterior Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "China/Glassware Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Chandelier Detailed Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  homeOffice: [
    {
      feature: "Desk Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Vacuuming",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Trash Emptying",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Electronics Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Bookshelf Organization",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Keyboard & Peripheral Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Cable Management",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Filing Cabinet Organization",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  laundryRoom: [
    {
      feature: "Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Floor Sweep/Vacuum",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Sink Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Washer/Dryer Exterior Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Lint Trap Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Washer Drum Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Dryer Vent Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  entryway: [
    {
      feature: "Floor Sweep/Vacuum",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Door & Handle Cleaning",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Baseboard Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Mirror Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Shoe Organization",
      essential: false,
      advanced: false,
      premium: true,
    },
    {
      feature: "Coat Closet Organization",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  hallway: [
    {
      feature: "Floor Vacuum/Sweep",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Light Fixture Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Baseboard Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Wall Spot Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Picture Frame Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Runner/Carpet Deep Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
  stairs: [
    {
      feature: "Step Vacuum/Sweep",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Handrail Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Visible Surface Dusting",
      essential: true,
      advanced: true,
      premium: true,
    },
    {
      feature: "Step Detailed Cleaning",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Baseboard Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Spindle Dusting",
      essential: false,
      advanced: true,
      premium: true,
    },
    {
      feature: "Carpet Deep Cleaning",
      essential: false,
      advanced: false,
      premium: true,
    },
  ],
}

export function getServiceFeatures(roomType: string): ServiceFeature[] {
  const tiers = defaultTiers[roomType] || defaultTiers.default

  if (tiers.length === 0) {
    return []
  }

  // Collect all unique detailed tasks from all tiers for the given room type
  const allTasks = new Set<string>()
  tiers.forEach((tier) => {
    tier.detailedTasks.forEach((task) => allTasks.add(task))
  })

  // Create a map to easily check if a task is included in a specific tier
  const tierTaskMap: Record<string, Set<string>> = {}
  tiers.forEach((tier) => {
    tierTaskMap[tier.id] = new Set(tier.detailedTasks)
  })

  const features: ServiceFeature[] = Array.from(allTasks).map((task) => ({
    feature: task,
    essential: tierTaskMap[tiers[0]?.id]?.has(task) || false, // Assuming tiers[0] is essential
    advanced: tiers[1] ? tierTaskMap[tiers[1].id]?.has(task) || false : false, // Assuming tiers[1] is advanced
    premium: tiers[2] ? tierTaskMap[tiers[2].id]?.has(task) || false : false, // Assuming tiers[2] is premium
  }))

  return features
}
