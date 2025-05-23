export const matrixServices = {
  addServices: [
    {
      id: "deep_dust",
      name: "Deep Dusting",
      price: 15,
      description: "Thorough dusting of all surfaces including hard-to-reach areas",
      category: "add",
      roomTypes: ["bedroom", "living_room", "dining_room", "office"],
      compatibility: {
        recommendedWith: ["ceiling_fans"],
      },
    },
    {
      id: "ceiling_fans",
      name: "Ceiling Fans",
      price: 10,
      description: "Cleaning of ceiling fans",
      category: "add",
      roomTypes: ["bedroom", "living_room", "dining_room", "office"],
    },
    {
      id: "window_cleaning",
      name: "Window Cleaning",
      price: 20,
      description: "Interior window cleaning",
      category: "add",
      roomTypes: ["bedroom", "living_room", "dining_room", "office", "kitchen"],
    },
  ],
  removeServices: [
    {
      id: "skip_baseboards",
      name: "Skip Baseboards",
      price: 10,
      description: "Skip cleaning of baseboards",
      category: "remove",
      roomTypes: ["bedroom", "bathroom", "kitchen", "living_room", "dining_room", "hallway", "staircase", "office"],
    },
    {
      id: "skip_oven",
      name: "Skip Oven",
      price: 15,
      description: "Skip cleaning of the oven",
      category: "remove",
      roomTypes: ["kitchen"],
    },
    {
      id: "skip_fridge",
      name: "Skip Fridge",
      price: 15,
      description: "Skip cleaning inside the fridge",
      category: "remove",
      roomTypes: ["kitchen"],
    },
  ],
}
