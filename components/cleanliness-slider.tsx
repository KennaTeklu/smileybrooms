"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import EnhancedTermsModal from "@/components/enhanced-terms-modal"

interface CleanlinessSliderProps {
  value?: number
  onChange?: (value: number) => void
  onAddToCart?: (cleanlinessData: any) => void
}

export function CleanlinessSlider({ value: externalValue, onChange, onAddToCart }: CleanlinessSliderProps) {
  const [value, setValue] = useState(externalValue || 50)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Check if terms have been accepted on mount
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (accepted) {
      setTermsAccepted(true)
    }
  }, [])

  // Update internal state when external prop changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue)
    }
  }, [externalValue])

  const getImagePath = () => {
    if (value < 33) {
      return "/images/very-dirty-home.jpg"
    } else if (value < 66) {
      return "/images/medium-dirty-home.jpg"
    } else {
      return "/images/clean-home.jpg"
    }
  }

  const getCleanlinessDescription = (level: number) => {
    if (level >= 1 && level <= 3) {
      return "Lightly Soiled - Standard cleaning will be sufficient"
    } else if (level >= 4 && level <= 7) {
      return "Moderately Soiled - Will require additional attention (+25%)"
    } else if (level >= 8 && level <= 10) {
      return "Heavily Soiled - Will require intensive cleaning (+50%)"
    }
    return ""
  }

  const getDescription = () => {
    if (value < 33) {
      return "Very dirty: Needs deep cleaning"
    } else if (value < 66) {
      return "Moderately dirty: Standard cleaning recommended"
    } else {
      return "Mostly clean: Light maintenance cleaning"
    }
  }

  const getRecommendation = () => {
    if (value < 33) {
      return "We recommend our Deep Cleaning service"
    } else if (value < 66) {
      return "We recommend our Regular Cleaning service"
    } else {
      return "We recommend our Light Maintenance Cleaning"
    }
  }

  const getPrice = () => {
    if (value < 33) {
      return 249.99
    } else if (value < 66) {
      return 179.99
    } else {
      return 129.99
    }
  }

  const handleChange = (newValue) => {
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  // FIX: Added missing openTermsModal function
  const openTermsModal = () => {
    setShowTermsModal(true)
  }

  const handleTermsAccept = () => {
    setTermsAccepted(true)
    localStorage.setItem("termsAccepted", "true")
    setShowTermsModal(false)
    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our terms and conditions.",
    })
  }

  const handleAddToCart = () => {
    if (!termsAccepted) {
      openTermsModal()
      return
    }

    const cleanlinessData = {
      level: value < 33 ? "deep" : value < 66 ? "standard" : "light",
      description: getDescription(),
      price: getPrice(),
      image: getImagePath(),
    }

    // If external handler provided, use it
    if (onAddToCart) {
      onAddToCart(cleanlinessData)
      return
    }

    // Otherwise add to cart directly
    addItem({
      id: `cleanliness-${cleanlinessData.level}-${Date.now()}`,
      name: `${cleanlinessData.level.charAt(0).toUpperCase() + cleanlinessData.level.slice(1)} Cleaning`,
      price: cleanlinessData.price,
      priceId: `price_${cleanlinessData.level}_cleaning`,
      image: cleanlinessData.image,
      quantity: 1,
      paymentFrequency: "per_service",
    })

    toast({
      title: "Added to cart!",
      description: `${cleanlinessData.level.charAt(0).toUpperCase() + cleanlinessData.level.slice(1)} Cleaning has been added to your cart.`,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="relative h-48 overflow-hidden rounded-md">
            <img
              src={getImagePath() || "/placeholder.svg"}
              alt="Cleanliness level"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
              <p>{getDescription()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="cleanliness" className="block text-sm font-medium">
              How clean is your space currently?
            </label>
            <input
              id="cleanliness"
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleChange(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Dirty</span>
              <span>Average</span>
              <span>Clean</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm">{getRecommendation()}</p>
          </div>

          {value >= 90 && (
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r">
              <strong>Note:</strong> For extremely soiled conditions, our standard service may not be sufficient. We
              recommend selecting the Premium Detailing option for best results.
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="font-bold">${getPrice().toFixed(2)}</span>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      </CardContent>

      {/* Terms Modal */}
      <EnhancedTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        initialTab="terms"
      />
    </Card>
  )
}
