"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface CleanlinessSliderProps {
  value?: number
  onChange: (value: number[]) => void
}

export default function CleanlinessSlider({ value = 7, onChange }: CleanlinessSliderProps) {
  const [sliderValue, setSliderValue] = useState(value)

  useEffect(() => {
    setSliderValue(value)
  }, [value])

  const handleChange = (newValue: number[]) => {
    const cleanlinessValue = newValue[0]
    setSliderValue(cleanlinessValue)
    onChange(newValue)
  }

  // Determine which image to show based on cleanliness level
  const getCleanlinessImage = () => {
    if (sliderValue < 4) {
      return "/images/very-dirty-home.jpg" // Extremely dirty
    } else if (sliderValue < 7) {
      return "/images/medium-dirty-home.jpg" // Medium dirty
    } else {
      return "/images/clean-home.jpg" // Clean
    }
  }

  // Get cleanliness level description
  const getCleanlinessDescription = () => {
    if (sliderValue < 4) {
      return "Extremely Dirty - Service Unavailable"
    } else if (sliderValue < 7) {
      return "Moderately Dirty - Deep Cleaning Required"
    } else if (sliderValue < 9) {
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
            <Slider
              defaultValue={[sliderValue]}
              max={10}
              min={1}
              step={1}
              onValueChange={handleChange}
              className="mb-6"
            />
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
                  sliderValue < 4
                    ? "bg-red-500"
                    : sliderValue < 7
                      ? "bg-yellow-500"
                      : sliderValue < 9
                        ? "bg-green-500"
                        : "bg-blue-500",
                )}
              ></div>
              <p className="font-medium">{getCleanlinessDescription()}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {sliderValue < 4
                ? "This level of dirtiness requires special assessment. Please contact us for a custom quote."
                : sliderValue < 7
                  ? "This level requires deep cleaning services with special equipment and techniques."
                  : sliderValue < 9
                    ? "This level can be handled with our standard cleaning services."
                    : "This level requires light maintenance cleaning to keep your space pristine."}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative rounded-lg overflow-hidden h-[200px] md:h-[250px] shadow-md">
            <img
              src={getCleanlinessImage() || "/placeholder.svg"}
              alt={`Cleanliness level ${sliderValue}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="font-medium">Cleanliness Level: {sliderValue}/10</p>
                <p className="text-sm opacity-90">{getCleanlinessDescription()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
