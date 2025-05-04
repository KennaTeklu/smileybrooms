"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { Sparkles, Trash2, BrushIcon as Broom } from "lucide-react"

interface CleanlinessSliderProps {
  onChange: (value: number) => void
}

export default function CleanlinessSlider({ onChange }: CleanlinessSliderProps) {
  const [value, setValue] = useState(7)

  const handleChange = (newValue: number[]) => {
    setValue(newValue[0])
    onChange(newValue[0])
  }

  const getCleanlinessDescription = () => {
    if (value <= 3) {
      return {
        title: "Extremely Dirty",
        description: "Requires specialized deep cleaning services",
        icon: <Trash2 className="h-5 w-5 text-red-500" />,
        color: "text-red-500",
      }
    } else if (value <= 6) {
      return {
        title: "Moderately Dirty",
        description: "Requires extra attention and deep cleaning",
        icon: <Broom className="h-5 w-5 text-amber-500" />,
        color: "text-amber-500",
      }
    } else {
      return {
        title: "Lightly Soiled",
        description: "Standard cleaning will be sufficient",
        icon: <Sparkles className="h-5 w-5 text-green-500" />,
        color: "text-green-500",
      }
    }
  }

  const cleanlinessInfo = getCleanlinessDescription()

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Current Cleanliness Level</h3>
        <div className="flex items-center">
          {cleanlinessInfo.icon}
          <span className={`ml-2 font-medium ${cleanlinessInfo.color}`}>{cleanlinessInfo.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="relative h-24 w-full mb-2 rounded-lg overflow-hidden">
            <Image src="/images/very-dirty-home.jpg" alt="Very dirty home" fill className="object-cover" />
            <div
              className={`absolute inset-0 border-4 rounded-lg transition-all ${value <= 3 ? "border-red-500" : "border-transparent"}`}
            ></div>
          </div>
          <p className="text-sm font-medium">Extremely Dirty</p>
        </div>
        <div className="text-center">
          <div className="relative h-24 w-full mb-2 rounded-lg overflow-hidden">
            <Image src="/images/medium-dirty-home.jpg" alt="Moderately dirty home" fill className="object-cover" />
            <div
              className={`absolute inset-0 border-4 rounded-lg transition-all ${value > 3 && value <= 6 ? "border-amber-500" : "border-transparent"}`}
            ></div>
          </div>
          <p className="text-sm font-medium">Moderately Dirty</p>
        </div>
        <div className="text-center">
          <div className="relative h-24 w-full mb-2 rounded-lg overflow-hidden">
            <Image src="/images/clean-home.jpg" alt="Clean home" fill className="object-cover" />
            <div
              className={`absolute inset-0 border-4 rounded-lg transition-all ${value > 6 ? "border-green-500" : "border-transparent"}`}
            ></div>
          </div>
          <p className="text-sm font-medium">Lightly Soiled</p>
        </div>
      </div>

      <Slider defaultValue={[value]} max={10} min={1} step={1} onValueChange={handleChange} className="w-full" />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Extremely Dirty</span>
        <span>Moderately Dirty</span>
        <span>Lightly Soiled</span>
      </div>

      <p className="text-sm text-muted-foreground mt-2">{cleanlinessInfo.description}</p>

      {value <= 3 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 mt-4">
          <p className="font-medium">Special Service Required</p>
          <p>For extremely dirty conditions, please contact us directly for a custom quote.</p>
        </div>
      )}
    </div>
  )
}
