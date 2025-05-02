"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
}: ServiceDetailsModalProps) {
  const [selectedTab, setSelectedTab] = useState(serviceType)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

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

  const handleBookNow = () => {
    window.location.href = "/pricing" // Fixed to redirect to pricing page
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Selected Service Details</DialogTitle>
          <DialogDescription>
            Review what's included in your {serviceType === "standard" ? "Standard" : "Premium Detailing"} cleaning
            service
          </DialogDescription>
        </DialogHeader>

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
                  <Badge variant="outline" className="px-3 py-1 text-sm ml-2 bg-blue-50 text-blue-700 border-blue-200">
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
                  Get a more thorough cleaning with our Premium Detailing service. Includes deep cleaning of appliances,
                  inside cabinets, windows, baseboards, and more!
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
                <Check className="h-5 w-5 mr-2" />
                You've Selected Our Best Service
              </h3>
              <p className="mt-2 text-green-700">
                Premium Detailing is our most comprehensive cleaning service, perfect for deep cleaning and detailed
                attention to every corner of your home.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-between space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex space-x-2">
            {addToCart && service && (
              <Button variant="outline" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            )}

            {serviceType === "standard" ? (
              <Button onClick={handleUpgrade}>
                Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleBookNow} className="bg-primary hover:bg-primary/90">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
