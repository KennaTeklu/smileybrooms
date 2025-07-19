import type React from "react"
import type { RoomTier } from "@/lib/room-tiers"
import {
  Home,
  Bath,
  Bed,
  CookingPotIcon as Kitchen,
  WashingMachineIcon as Laundry,
  ComputerIcon as Office,
  MapPin,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react"

// Define types for the pricing engine inputs and outputs
export type RoomInput = {
  room: string
  quantity: number
  selectedTier?: RoomTier
  selectedAddOns?: string[]
  selectedReductions?: string[]
  unitPrice: number // Base price for the room type
}

export type AddOnInput = {
  name: string
  quantity: number
  price: number
}

export type PricingInput = {
  rooms: RoomInput[]
  addOns: AddOnInput[]
  frequency: "one-time" | "weekly" | "bi-weekly" | "monthly"
  cleanlinessMultiplier: number // e.g., 1 for standard, 1.2 for deep clean
  discountCodes?: string[]
  paymentMethod?: string
}

export type RoomDisplay = {
  room: string
  quantity: number
  baseRate: number
  adjustedRate: number
  description?: string
  image?: string
  icon?: React.ReactNode
}

export type AddOnDisplay = {
  name: string
  quantity: number
  price: number
  badge?: string
  icon?: React.ReactNode
}

export type DiscountDisplay = {
  name: string
  amount: number
  code?: string
}

export type PricingOutput = {
  subtotal: number
  total: number
  roomDisplay?: RoomDisplay[]
  addOnDisplay?: AddOnDisplay[]
  discounts?: DiscountDisplay[]
  frequencyDiscount?: number
  couponDiscount?: number
  cleanlinessAdjustment?: number
  tax?: number
  finalPricePerService?: number
}

// Mock data for demonstration purposes
const MOCK_ROOM_PRICES: Record<
  string,
  { basePrice: number; description: string; image: string; icon: React.ReactNode }
> = {
  "Living Room": {
    basePrice: 50,
    description: "Spacious area for relaxation",
    image: "/images/living-room-professional.png",
    icon: <Home className="h-6 w-6 text-blue-600" />,
  },
  Bedroom: {
    basePrice: 40,
    description: "Cozy space for rest",
    image: "/images/bedroom-professional.png",
    icon: <Bed className="h-6 w-6 text-blue-600" />,
  },
  Bathroom: {
    basePrice: 60,
    description: "Sanitized and sparkling clean",
    image: "/images/bathroom-professional.png",
    icon: <Bath className="h-6 w-6 text-blue-600" />,
  },
  Kitchen: {
    basePrice: 70,
    description: "Grease-free and hygienic",
    image: "/images/kitchen-professional.png",
    icon: <Kitchen className="h-6 w-6 text-blue-600" />,
  },
  "Dining Room": {
    basePrice: 45,
    description: "Perfect for family meals",
    image: "/images/dining-room-professional.png",
    icon: <Home className="h-6 w-6 text-blue-600" />,
  },
  "Home Office": {
    basePrice: 35,
    description: "Productive and organized",
    image: "/images/home-office-professional.png",
    icon: <Office className="h-6 w-6 text-blue-600" />,
  },
  "Laundry Room": {
    basePrice: 30,
    description: "Fresh and tidy",
    image: "/images/laundry-room-professional.png",
    icon: <Laundry className="h-6 w-6 text-blue-600" />,
  },
  Hallway: {
    basePrice: 20,
    description: "Clean passage areas",
    image: "/images/hallway-professional.png",
    icon: <MapPin className="h-6 w-6 text-blue-600" />,
  },
  Stairs: {
    basePrice: 25,
    description: "Step-by-step clean",
    image: "/images/stairs-professional.png",
    icon: <Home className="h-6 w-6 text-blue-600" />,
  },
  Entryway: {
    basePrice: 20,
    description: "Welcoming first impression",
    image: "/images/entryway-professional.png",
    icon: <Home className="h-6 w-6 text-blue-600" />,
  },
}

const MOCK_ADDON_PRICES: Record<string, { price: number; description: string; icon: React.ReactNode }> = {
  "Window Cleaning": {
    price: 25,
    description: "Sparkling windows",
    icon: <Sparkles className="h-5 w-5 text-purple-600" />,
  },
  "Carpet Shampoo": { price: 40, description: "Deep carpet clean", icon: <Plus className="h-5 w-5 text-purple-600" /> },
  "Oven Cleaning": {
    price: 30,
    description: "Thorough oven degreasing",
    icon: <Kitchen className="h-5 w-5 text-purple-600" />,
  },
  "Fridge Cleaning": {
    price: 20,
    description: "Inside fridge sanitation",
    icon: <Minus className="h-5 w-5 text-purple-600" />,
  },
}

const FREQUENCY_DISCOUNTS: Record<string, number> = {
  "one-time": 0,
  weekly: 0.2, // 20% discount
  "bi-weekly": 0.15, // 15% discount
  monthly: 0.1, // 10% discount
}

const COUPON_CODES: Record<string, number> = {
  SAVE10: 0.1, // 10% off
  FIRSTCLEAN: 0.15, // 15% off
}

export class PricingEngine {
  static calculate(input: PricingInput): PricingOutput {
    let subtotal = 0
    const roomDisplay: RoomDisplay[] = []
    const addOnDisplay: AddOnDisplay[] = []
    const discounts: DiscountDisplay[] = []

    // Calculate room charges
    input.rooms.forEach((roomInput) => {
      const mockRoom = MOCK_ROOM_PRICES[roomInput.room]
      if (mockRoom) {
        let roomRate = mockRoom.basePrice
        // Apply tier adjustments if any (mocked for now)
        if (roomInput.selectedTier === "premium") {
          roomRate *= 1.2 // 20% more for premium
        } else if (roomInput.selectedTier === "basic") {
          roomRate *= 0.8 // 20% less for basic
        }

        // Apply add-ons/reductions specific to rooms (mocked)
        if (roomInput.selectedAddOns?.includes("extra-shine")) {
          roomRate += 10
        }
        if (roomInput.selectedReductions?.includes("no-windows")) {
          roomRate -= 5
        }

        const adjustedRate = roomRate * roomInput.quantity
        subtotal += adjustedRate

        roomDisplay.push({
          room: `${roomInput.quantity}x ${roomInput.room}`,
          quantity: roomInput.quantity,
          baseRate: mockRoom.basePrice * roomInput.quantity,
          adjustedRate: adjustedRate,
          description: mockRoom.description,
          image: mockRoom.image,
          icon: mockRoom.icon,
        })
      }
    })

    // Calculate add-on charges
    input.addOns.forEach((addOnInput) => {
      const mockAddOn = MOCK_ADDON_PRICES[addOnInput.name]
      if (mockAddOn) {
        const addOnTotal = mockAddOn.price * addOnInput.quantity
        subtotal += addOnTotal
        addOnDisplay.push({
          name: `${addOnInput.quantity}x ${addOnInput.name}`,
          quantity: addOnInput.quantity,
          price: addOnTotal,
          description: mockAddOn.description,
          icon: mockAddOn.icon,
        })
      }
    })

    let total = subtotal

    // Apply cleanliness multiplier
    if (input.cleanlinessMultiplier && input.cleanlinessMultiplier !== 1) {
      total *= input.cleanlinessMultiplier
      // This could be added to discounts or a separate adjustment display
    }

    // Apply frequency discount
    let frequencyDiscountAmount = 0
    if (input.frequency && FREQUENCY_DISCOUNTS[input.frequency]) {
      frequencyDiscountAmount = total * FREQUENCY_DISCOUNTS[input.frequency]
      total -= frequencyDiscountAmount
      discounts.push({
        name: `${input.frequency.charAt(0).toUpperCase() + input.frequency.slice(1)} Discount`,
        amount: frequencyDiscountAmount,
      })
    }

    // Apply coupon codes
    let couponDiscountAmount = 0
    if (input.discountCodes && input.discountCodes.length > 0) {
      input.discountCodes.forEach((code) => {
        if (COUPON_CODES[code]) {
          const discount = total * COUPON_CODES[code]
          couponDiscountAmount += discount
          total -= discount
          discounts.push({
            name: `Coupon: ${code}`,
            amount: discount,
            code: code,
          })
        }
      })
    }

    // Add a mock tax (e.g., 5%)
    const taxRate = 0.05
    const taxAmount = total * taxRate
    total += taxAmount

    return {
      subtotal: Number.parseFloat(subtotal.toFixed(2)),
      total: Number.parseFloat(total.toFixed(2)),
      roomDisplay: roomDisplay,
      addOnDisplay: addOnDisplay,
      discounts: discounts,
      frequencyDiscount: Number.parseFloat(frequencyDiscountAmount.toFixed(2)),
      couponDiscount: Number.parseFloat(couponDiscountAmount.toFixed(2)),
      cleanlinessAdjustment: Number.parseFloat(((input.cleanlinessMultiplier || 1) * subtotal - subtotal).toFixed(2)),
      tax: Number.parseFloat(taxAmount.toFixed(2)),
      finalPricePerService: Number.parseFloat(total.toFixed(2)),
    }
  }

  static formatForDisplay(
    output: PricingOutput,
    options?: { showDetailed?: boolean; includeImages?: boolean },
  ): PricingOutput {
    // This method can be used to further format the output for UI display,
    // e.g., adding currency symbols, descriptions, etc.
    // For now, it just returns the output as is, assuming the calculation already
    // provides display-ready numbers.
    return output
  }
}
