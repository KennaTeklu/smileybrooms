"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CleanlinessSliderProps {
  onChange: (value: number) => void
}

export default function CleanlinessSlider({ onChange }: CleanlinessSliderProps) {
  const [value, setValue] = useState(7)

  const handleValueChange = (newValue: number[]) => {
    const cleanlinessValue = newValue[0]
    setValue(cleanlinessValue)
    onChange(cleanlinessValue)
  }

  const getCleanlinessDescription = (level: number) => {
    if (level >= 7) {
      return {
        title: "Standard Cleaning",
        description: "Your home is in good condition and requires standard cleaning services.",
        priceMultiplier: 1,
        image: "/placeholder.svg?height=200&width=300&text=Clean+Home",
      }
    } else if (level >= 4) {
      return {
        title: "Deep Cleaning Required",
        description: "Your home needs more attention and thorough cleaning.",
        priceMultiplier: 3.5,
        image: "/placeholder.svg?height=200&width=300&text=Moderately+Dirty+Home",
      }
    } else {
      return {
        title: "Special Assessment Required",
        description: "Your home may require specialized cleaning services.",
        priceMultiplier: 0, // Special case
        image: "/placeholder.svg?height=200&width=300&text=Very+Dirty+Home",
      }
    }
  }

  const cleanlinessInfo = getCleanlinessDescription(value)
  const isCriticallyLow = value < 4

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Current Cleanliness Level</h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag the slider to indicate the current cleanliness level of your home
        </p>
        <Slider defaultValue={[7]} max={10} min={1} step={1} onValueChange={handleValueChange} className="py-4" />
        <div className="flex justify-between text-xs text-gray-500 px-2">
          <span>Very Dirty (1)</span>
          <span>Average (5)</span>
          <span>Very Clean (10)</span>
        </div>
      </div>

      <Card className={value < 4 ? "border-red-300" : value < 7 ? "border-yellow-300" : "border-green-300"}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-1/3 h-40">
              <Image
                src={cleanlinessInfo.image || "/placeholder.svg"}
                alt={`Cleanliness level ${value}`}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{cleanlinessInfo.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{cleanlinessInfo.description}</p>

              {value >= 7 ? (
                <p className="text-green-600 font-medium">Standard pricing applies</p>
              ) : value >= 4 ? (
                <p className="text-yellow-600 font-medium">3.5x price adjustment applies due to extra work required</p>
              ) : (
                <div>
                  <p className={cn("text-red-600 font-medium", isCriticallyLow ? "cleanliness-critical" : "")}>
                    Service requires custom assessment. Please contact us for a custom quote.
                  </p>
                  {isCriticallyLow && (
                    <p className="text-red-600 text-sm mt-2">
                      Booking is disabled for critically low cleanliness levels. Please contact us directly.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
