"use client"

import type React from "react"

import { useState } from "react"
import { Home, Sparkles, Settings } from "lucide-react"

interface ServiceOption {
  id: string
  name: string
  price: number
  description: string
}

interface RoomType {
  id: string
  name: string
  basePrice: number
  icon: React.ElementType
  options: ServiceOption[]
}

const roomTypes: RoomType[] = [
  {
    id: "bedroom",
    name: "Bedroom",
    basePrice: 30,
    icon: Home,
    options: [
      { id: "bed-linen", name: "Change Bed Linens", price: 10, description: "Replace and make bed with fresh linens." },
      {
        id: "closet-organize",
        name: "Closet Organization",
        price: 40,
        description: "Light organization of closet contents.",
      },
      { id: "window-interior", name: "Interior Window Cleaning", price: 15, description: "Clean inside of windows." },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    basePrice: 40,
    icon: Sparkles,
    options: [
      { id: "grout-scrub", name: "Grout Scrubbing", price: 25, description: "Deep cleaning of tile grout." },
      {
        id: "cabinet-interior",
        name: "Cabinet Interior Cleaning",
        price: 30,
        description: "Clean inside of bathroom cabinets.",
      },
      {
        id: "shower-glass",
        name: "Shower Glass Descaling",
        price: 20,
        description: "Remove hard water stains from shower glass.",
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    basePrice: 50,
    icon: Settings,
    options: [
      {
        id: "oven-interior",
        name: "Inside Oven Cleaning",
        price: 35,
        description: "Thorough cleaning of oven interior.",
      },
      {
        id: "fridge-interior",
        name: "Inside Refrigerator Cleaning",
        price: 30,
        description: "Clean inside of refrigerator.",
      },
      { id: "dishwasher-clean", name: "Dishwasher Cleaning", price: 15, description: "Clean and sanitize dishwasher." },
    ],
  },
]

export default function CustomizationMatrix() {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>({
    bedroom: 1,
    bathroom: 1,
    kitchen: 1,
  })
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({
    bedroom: [],
    bathroom: [],
    kitchen: [],
  })

  const handleRoomCountChange = (roomId: string, delta: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: Math.max(0, (prev[roomId] || 0) + delta),
    }))
  }

  const handleOptionToggle = (roomId: string, optionId: string, isChecked: boolean) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[roomId] || []
      if (isChecked) {
        return { ...prev, [roomId]: [...currentOptions, optionId] }
      } else {
        return { ...prev, [roomId]: currentOptions.filter
