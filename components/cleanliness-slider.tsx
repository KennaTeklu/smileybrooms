/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/* Don't modify beyond what is requested ever. */
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

  // Get professional cinematic image based on cleanliness level
  const getCleanlinessImage = () => {
    if (sliderValue < 3) {
      return "/images/bathroom-dirty-vs-clean.png" // Most dramatic transformation
    } else if (sliderValue < 5) {
      return "/images/kitchen-dirty-vs-clean.png" // Heavy cleaning needed
    } else if (sliderValue < 7) {
      return "/images/living-room-dirty-vs-clean.png" // Standard cleaning
    } else if (sliderValue < 9) {
      return "/images/bedroom-dirty-vs-clean.png" // Light cleaning
    } else {
      return "/images/mr-clean-hero.png" // Hero shot for pristine spaces
    }
  }

  // Professional descriptions matching the cinematic quality
  const getCleanlinessDescription = () => {
    if (sliderValue < 3) {
      return "Extreme Restoration Required"
    } else if (sliderValue < 5) {
      return "Deep Cleaning Transformation"
    } else if (sliderValue < 7) {
      return "Professional Standard Cleaning"
    } else if (sliderValue < 9) {
      return "Maintenance & Perfection"
    } else {
      return "Luxury Preservation Service"
    }
  }

  // Professional service descriptions
  const getServiceDescription = () => {
    if (sliderValue < 3) {
      return "Our restoration specialists will transform your space from neglected to magnificent using professional-grade equipment and techniques."
    } else if (sliderValue < 5) {
      return "Deep cleaning protocol with specialized tools to eliminate grime, stains, and restore surfaces to pristine condition."
    } else if (sliderValue < 7) {
      return "Comprehensive cleaning service that brings your space to professional standards with attention to every detail."
    } else if (sliderValue < 9) {
      return "Precision maintenance cleaning to preserve and enhance your already well-maintained space."
    } else {
      return "Luxury preservation service maintaining your pristine environment to the highest standards."
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Current Space Assessment</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Adjust the slider to indicate your space's current condition
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="relative">
            <Slider
              defaultValue={[sliderValue]}
              max={10}
              min={1}
              step={1}
              onValueChange={handleChange}
              className="mb-6"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="font-medium">Needs Restoration</span>
              <span className="font-medium">Pristine Condition</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div
                className={cn(
                  "w-4 h-4 rounded-full mr-3 shadow-sm",
                  sliderValue < 3
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : sliderValue < 5
                      ? "bg-gradient-to-r from-orange-500 to-orange-600"
                      : sliderValue < 7
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : sliderValue < 9
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-blue-500 to-blue-600",
                )}
              ></div>
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{getCleanlinessDescription()}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{getServiceDescription()}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assessment Level:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{sliderValue}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="relative rounded-xl overflow-hidden h-[280px] lg:h-[320px] shadow-2xl border border-gray-200 dark:border-gray-700">
            <img
              src={getCleanlinessImage() || "/placeholder.svg"}
              alt={`Professional cleaning visualization - ${getCleanlinessDescription()}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4">
                  <h5 className="font-bold text-lg mb-1">Level {sliderValue} Assessment</h5>
                  <p className="text-sm opacity-90 font-medium">{getCleanlinessDescription()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
