"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { useState } from "react"

interface ServiceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceType: "standard" | "detailing"
  frequency: string
  cleanlinessLevel: number
  totalPrice: number
  onUpgrade: () => void
  onAddToCart: () => void
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  addToCart?: (item: any, source: string) => void
  service?: any
  rooms?: Record<string, number>
  customerInfo?: {
    name?: string
    address?: string
    phone?: string
    email?: string
  }
}

export function ServiceDetailsModal({
  open,
  onOpenChange,
  serviceType,
  frequency,
  cleanlinessLevel,
  totalPrice,
  onUpgrade,
  onAddToCart,
  paymentFrequency,
  addToCart,
  service,
  rooms = {},
  customerInfo,
}: ServiceDetailsModalProps) {
  const [selectedTab, setSelectedTab] = useState(serviceType)
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true)
  const [customerInfoExpanded, setCustomerInfoExpanded] = useState(false)

  // Calculate premium price (3.5x standard)
  const premiumPrice = serviceType === "standard" ? totalPrice * 3.5 : totalPrice

  // Service features
  const standardFeatures = {
    included: [
      "Basic dusting of accessible surfaces",
      "Vacuuming of floors",
      "Mopping of hard floors",
      "Bathroom cleaning (toilet, sink, shower)",
      "Kitchen countertop cleaning",
      "Trash removal",
      "Bed making",
    ],
    excluded: [
      "Deep cleaning of appliances",
      "Inside cabinet cleaning",
      "Window washing",
      "Baseboards and crown molding",
      "Furniture moving for cleaning underneath",
      "Stain removal",
      "Sanitization of high-touch surfaces",
      "Detailed corner and edge cleaning",
    ],
  }

  const detailingFeatures = {
    included: [
      ...standardFeatures.included,
      "Deep cleaning of appliances",
      "Inside cabinet cleaning",
      "Window washing",
      "Baseboards and crown molding",
      "Furniture moving for cleaning underneath",
      "Stain removal",
      "Sanitization of high-touch surfaces",
      "Detailed corner and edge cleaning",
    ],
    excluded: ["Carpet shampooing", "Wall washing", "Chandelier cleaning"],
  }

  // Format frequency for display
  const formatFrequency = (freq: string) => {
    return freq.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getCleanlinessDescription = (level: number) => {
    if (level >= 8) return "Very Clean"
    if (level >= 6) return "Clean"
    if (level >= 4) return "Somewhat Dirty"
    return "Very Dirty"
  }

  const shouldRecommendUpgrade = serviceType === "standard" && (cleanlinessLevel < 7 || frequency === "one_time")

  // Get cleanliness level text
  const getCleanlinessLevelText = (level: number) => {
    if (level < 4) return "Extremely Dirty (Contact Required)"
    if (level < 7) return "Moderately Dirty (Extra Cleaning Required)"
    return "Lightly Soiled (Standard Cleaning)"
  }

  // Count total rooms
  const totalRoomCount = Object.values(rooms).reduce((sum, count) => sum + count, 0)

  // Format room type for display
  const formatRoomType = (roomType: string) => {
    return roomType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Estimate cleaning duration based on room count and service type
  const estimateCleaningDuration = () => {
    // Base time: 30 min per room for standard, 60 min for detailing
    const baseTimePerRoom = serviceType === "standard" ? 30 : 60

    // Calculate total minutes
    const totalMinutes = totalRoomCount * baseTimePerRoom

    // Apply cleanliness modifier
    const cleanlinessModifier = cleanlinessLevel < 4 ? 2 : cleanlinessLevel < 7 ? 1.5 : 1

    const adjustedMinutes = totalMinutes * cleanlinessModifier

    // Convert to hours and minutes
    const hours = Math.floor(adjustedMinutes / 60)
    const minutes = Math.round(adjustedMinutes % 60)

    return `${hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : ""} ${minutes > 0 ? `${minutes} minutes` : ""}`
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    }
    onOpenChange(false)
  }

  const handleAddToCart = () => {
    if (addToCart && service) {
      addToCart(
        {
          name: service.name,
          price: service.price,
          quantity: 1,
          serviceType: service.type,
        },
        "Service Details Modal",
      )
      onOpenChange(false) // Close the modal after adding to cart
    }
  }

  // Payment frequency label
  const getPaymentFrequencyLabel = () => {
    if (!paymentFrequency || paymentFrequency === "per_service") return "Pay Per Service"
    if (paymentFrequency === "monthly") return "Monthly Payment Plan"
    return "Yearly Payment Plan"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
          <DialogDescription>Review your cleaning service details before adding to cart</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Service Type:</span>
              <span className="text-right">
                {serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Frequency:</span>
              <span className="text-right">{formatFrequency(frequency)}</span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Cleanliness Level:</span>
              <span className="text-right">{getCleanlinessDescription(cleanlinessLevel)}</span>
            </div>

            <div className="flex justify-between items-center font-bold">
              <span>Total Price:</span>
              <span className="text-right">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {shouldRecommendUpgrade && (
            <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800">Recommendation</h4>
                  <p className="text-sm text-amber-700 mb-2">
                    {cleanlinessLevel < 7
                      ? "For your current cleanliness level, we recommend upgrading to our Premium Detailing service for better results."
                      : "For one-time cleanings, our Premium Detailing service provides a more thorough cleaning experience."}
                  </p>
                  <Button variant="outline" size="sm" onClick={onUpgrade}>
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          )}

          {serviceType === "detailing" && (
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800">Premium Service Selected</h4>
                  <p className="text-sm text-green-700">
                    You've selected our most thorough cleaning service. Our team will take extra care to ensure your
                    space is spotless.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1">
            Go Back
          </Button>
          <Button onClick={onAddToCart} className="sm:flex-1">
            Add to Cart <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
