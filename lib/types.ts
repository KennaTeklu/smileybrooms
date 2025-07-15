// Define the structure for a single room configuration
export type RoomType =
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "living_room"
  | "dining_room"
  | "home_office"
  | "laundry_room"
  | "hallway"
  | "entryway"
  | "stairs"

export interface RoomTier {
  value: "standard_clean" | "deep_clean" | "move_in_out"
  label: string
  priceMultiplier: number
  tasks: string[]
}

export interface AddOn {
  value: string
  label: string
  price: number
  tasks: string[]
}

export interface Reduction {
  value: string
  label: string
  price: number
  tasks: string[]
}

export interface RoomConfig {
  roomType: RoomType
  selectedTier: RoomTier["value"]
  selectedAddOns: AddOn["value"][]
  selectedReductions: Reduction["value"][]
  image?: string // Optional image for the room
  timeEstimate?: string // Optional time estimate for the room
}

// Define the structure for a cart item
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  metadata?: {
    roomType?: RoomType
    selectedTier?: RoomTier["value"]
    selectedAddOns?: AddOn["value"][]
    selectedReductions?: Reduction["value"][]
    timeEstimate?: string
    frequency?: string
    rooms?: string
    discountApplied?: boolean
  }
  paymentType?: "online" | "in_person" // Indicates if this item requires email for pricing
}

// Define the structure for checkout data
export interface CheckoutData {
  contact: {
    fullName: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    state: string
    zip: string
    unit?: string
    fullName?: string // Added for convenience, populated from contact
    email?: string // Added for convenience, populated from contact
    phone?: string // Added for convenience, populated from contact
  }
  billingAddressSameAsService: boolean
  billingAddress: {
    street: string
    city: string
    state: string
    zip: string
    unit?: string
  }
  paymentMethod: "credit_card" | "paypal" | "in_person"
  cardDetails: {
    cardNumber: string
    expiryDate: string
    cvc: string
    cardholderName: string
  }
  notes?: string
}
