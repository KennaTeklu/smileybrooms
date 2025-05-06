"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface CleanlinessSliderProps {
  onChange: (value: number) => void
}

export default function CleanlinessSlider({ onChange }: CleanlinessSliderProps) {
  const [value, setValue] = useState(7)

  const handleChange = (newValue: number[]) => {
    const cleanlinessValue = newValue[0]
    setValue(cleanlinessValue)
    onChange(cleanlinessValue)
  }

  // Determine which image to show based on cleanliness level
  const getCleanlinessImage = () => {
    if (value < 4) {
      return "/images/very-dirty-home.jpg" // Extremely dirty
    } else if (value < 7) {
      return "/images/medium-dirty-home.jpg" // Medium dirty
    } else {
      return "/images/clean-home.jpg" // Clean
    }
  }

  // Get cleanliness level description
  const getCleanlinessDescription = () => {
    if (value < 4) {
      return "Extremely Dirty - Service Unavailable"
    } else if (value < 7) {
      return "Moderately Dirty - Deep Cleaning Required"
    } else if (value < 9) {
      return "Lightly Dirty - Standard Cleaning"
    } else {
      return "Mostly Clean - Light Maintenance"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Current Cleanliness Level</h3>
        <p className="text-sm text-gray-500 mb-4">Adjust the slider to indicate how dirty your space currently is</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Slider defaultValue={[value]} max={10} min={1} step={1} onValueChange={handleChange} className="mb-6" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Extremely Dirty</span>
              <span>Very Clean</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full mr-2",
                  value < 4 ? "bg-red-500" : value < 7 ? "bg-yellow-500" : value < 9 ? "bg-green-500" : "bg-blue-500",
                )}
              ></div>
              <p className="font-medium">{getCleanlinessDescription()}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {value < 4
                ? "This level of dirtiness requires special assessment. Please contact us for a custom quote."
                : value < 7
                  ? "This level requires deep cleaning services with special equipment and techniques."
                  : value < 9
                    ? "This level can be handled with our standard cleaning services."
                    : "This level requires light maintenance cleaning to keep your space pristine."}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative rounded-lg overflow-hidden h-[200px] md:h-[250px] shadow-md">
            <img
              src={getCleanlinessImage() || "/placeholder.svg"}
              alt={`Cleanliness level ${value}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="font-medium">Cleanliness Level: {value}/10</p>
                <p className="text-sm opacity-90">{getCleanlinessDescription()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
