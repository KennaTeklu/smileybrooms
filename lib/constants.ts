export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 35,
    bedroom: 25,
    bathroom: 30,
    kitchen: 45,
    living_room: 35,
    dining_room: 25,
    office: 25,
    playroom: 30,
    mudroom: 20,
    laundry_room: 20,
    sunroom: 25,
    guest_room: 25,
    garage: 40,
  },
  frequencyMultipliers: {
    one_time: 1,
    weekly: 0.8,
    biweekly: 0.85,
    monthly: 0.9,
    semi_annual: 0.95,
    annually: 0.98,
    vip_daily: 0.7,
  },
  serviceFee: 25,
}

export const SERVICES = [
  {
    id: "standard-cleaning",
    name: "Standard Cleaning",
    description: "Regular cleaning service for maintained homes",
    price: 120,
    image: "/sparkling-clean-home.png",
    features: [
      "Dusting all accessible surfaces",
      "Vacuuming carpets and floors",
      "Mopping hard floors",
      "Cleaning bathrooms",
      "Kitchen cleaning",
      "Making beds",
      "Emptying trash",
    ],
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    description: "Thorough cleaning for homes needing extra attention",
    price: 220,
    image: "/deep-cleaning-tools.png",
    features: [
      "All standard cleaning services",
      "Inside cabinet cleaning",
      "Inside oven and refrigerator",
      "Baseboards and crown molding",
      "Window sills and tracks",
      "Light fixtures",
      "Detailed bathroom cleaning",
    ],
  },
  {
    id: "move-in-out",
    name: "Move In/Out Cleaning",
    description: "Comprehensive cleaning for moving transitions",
    price: 320,
    image: "/moving-cleaning.png",
    features: [
      "All deep cleaning services",
      "Inside all cabinets and drawers",
      "Closet cleaning",
      "Wall spot cleaning",
      "Appliance cleaning",
      "Window cleaning",
      "Garage sweeping",
    ],
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    content: "The cleaning team was professional, thorough, and friendly. My home has never looked better!",
    image: "/woman-portrait.png",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    rating: 5,
    content:
      "We've been using their services for our office for over a year now. Always reliable and excellent quality.",
    image: "/thoughtful-man-portrait.png",
  },
  {
    id: 3,
    name: "Robert Williams",
    role: "Property Manager",
    rating: 4,
    content: "Great service for our rental properties. Tenants are always happy with the move-in condition.",
    image: "/confident-businessman.png",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Working Professional",
    rating: 5,
    content: "As a busy professional, having a clean home without the stress is priceless. Highly recommend!",
    image: "/professional-woman.png",
  },
]

export const FAQ_ITEMS = [
  {
    question: "How do I schedule a cleaning service?",
    answer:
      "You can schedule a cleaning service by visiting our booking page or calling our customer service. We offer flexible scheduling options to fit your needs.",
  },
  {
    question: "What cleaning products do you use?",
    answer:
      "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets. If you have specific product preferences or allergies, please let us know.",
  },
  {
    question: "How long does a typical cleaning service take?",
    answer:
      "The duration depends on the size of your home and the type of service. A standard cleaning for a 2-bedroom home typically takes 2-3 hours, while deep cleaning may take 4-5 hours.",
  },
  {
    question: "Do I need to be home during the cleaning?",
    answer:
      "No, you don't need to be home. Many of our clients provide a key or access code. We ensure all our staff are background-checked and trustworthy.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "We require 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may be subject to a cancellation fee.",
  },
]
