"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Check,
  X,
  ArrowRight,
  Info,
  Clipboard,
  CheckCircle,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

interface ServiceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceType: "standard" | "detailing"
  frequency: string
  cleanlinessLevel: number
  totalPrice: number
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  onUpgrade?: () => void
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
  paymentFrequency,
  onUpgrade,
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
    return freq.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Clipboard className="mr-2 h-5 w-5 text-primary" />
            Order Summary & Service Details
          </DialogTitle>
          <DialogDescription>
            Please review your selections before proceeding to add this service to your cart
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Order Summary Section */}
          <div className="md:col-span-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <div
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
            >
              <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">Your Selections</h3>
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                {orderSummaryExpanded ? (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            </div>

            {orderSummaryExpanded && (
              <div className="space-y-3 text-blue-700 dark:text-blue-300">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Service Type:</span>
                  <Badge
                    variant={serviceType === "standard" ? "outline" : "secondary"}
                    className={
                      serviceType === "standard"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }
                  >
                    {serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Frequency:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {formatFrequency(frequency)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment:</span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    {getPaymentFrequencyLabel()}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Cleanliness:</span>
                  <span className="text-sm">{getCleanlinessLevelText(cleanlinessLevel)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Estimated Duration:</span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="text-sm">{estimateCleaningDuration()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Rooms:</span>
                  <span className="text-sm font-semibold">{totalRoomCount} rooms total</span>
                </div>

                <Separator className="my-3 bg-blue-200" />

                {/* Room Breakdown */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Room Breakdown:</h4>
                  {Object.entries(rooms)
                    .filter(([_, count]) => count > 0)
                    .map(([roomType, count]) => (
                      <div key={roomType} className="flex justify-between text-sm">
                        <span>{formatRoomType(roomType)}:</span>
                        <span>{count}</span>
                      </div>
                    ))}
                </div>

                <Separator className="my-3 bg-blue-200" />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Customer Information Section */}
            {customerInfo && (
              <>
                <div
                  className="flex items-center justify-between cursor-pointer mb-3 mt-6"
                  onClick={() => setCustomerInfoExpanded(!customerInfoExpanded)}
                >
                  <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">Customer Information</h3>
                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                    {customerInfoExpanded ? (
                      <ChevronDown className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    )}
                  </Button>
                </div>

                {customerInfoExpanded && (
                  <div className="space-y-3 text-blue-700 dark:text-blue-300">
                    {customerInfo.name && (
                      <div className="flex items-start">
                        <User className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Name:</span> {customerInfo.name}
                        </div>
                      </div>
                    )}
                    {customerInfo.address && (
                      <div className="flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Address:</span> {customerInfo.address}
                        </div>
                      </div>
                    )}
                    {customerInfo.phone && (
                      <div className="flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Phone:</span> {customerInfo.phone}
                        </div>
                      </div>
                    )}
                    {customerInfo.email && (
                      <div className="flex items-start">
                        <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Email:</span> {customerInfo.email}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Service Details Tabs */}
          <div className="md:col-span-2">
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "standard" | "detailing")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">Standard Cleaning</TabsTrigger>
                <TabsTrigger value="detailing">Premium Detailing</TabsTrigger>
              </TabsList>
              <TabsContent value="standard" className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      {frequency.replace("_", " ").toUpperCase()}
                    </Badge>
                    {paymentFrequency && paymentFrequency !== "per_service" && (
                      <Badge
                        variant="outline"
                        className="px-3 py-1 text-sm ml-2 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {paymentFrequency.toUpperCase()} PAYMENT
                      </Badge>
                    )}
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {standardFeatures.included.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-2">
                      {standardFeatures.excluded.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {serviceType === "standard" && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-lg flex items-center text-blue-800">
                      <Info className="h-5 w-5 mr-2" />
                      Upgrade to Premium Detailing
                    </h3>
                    <p className="mt-2 text-blue-700">
                      Get a more thorough cleaning with our Premium Detailing service. Includes deep cleaning of
                      appliances, inside cabinets, windows, baseboards, and more!
                    </p>
                    <Button onClick={handleUpgrade} className="mt-3" variant="outline">
                      Upgrade to Premium {formatCurrency(premiumPrice)} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="detailing" className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 border-indigo-200">
                    {frequency.replace("_", " ").toUpperCase()} - PREMIUM
                  </Badge>
                  <span className="text-xl font-bold">{formatCurrency(premiumPrice)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {detailingFeatures.included.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-lg flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-2">
                      {detailingFeatures.excluded.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-lg flex items-center text-green-800">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    You've Selected Our Best Service
                  </h3>
                  <p className="mt-2 text-green-700">
                    Premium Detailing is our most comprehensive cleaning service, perfect for deep cleaning and detailed
                    attention to every corner of your home.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {serviceType === "standard" ? (
            <Button onClick={handleUpgrade} variant="secondary">
              Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
          <Button onClick={handleAddToCart} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
