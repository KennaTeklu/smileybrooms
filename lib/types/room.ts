export type ViewType = "ocean" | "garden" | "city" | "mountain" | "lake" | "street"

export interface RoomAddOn {
  id: string
  name: string
  price: number
}

export interface RoomDetails {
  size: string
  capacity: number
  amenities: string[]
  viewType: ViewType
  addOns: RoomAddOn[]
}

export interface Room {
  id: string
  name: string
  imageUrl: string
  description: string
  basePrice: number
  details: RoomDetails
}
