"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { RoomCustomizationPanel } from "./room-customization-panel"
import { useToast } from "@/components/ui/use-toast"
import { LoadingAnimation } from "./loading-animation" // Ensure correct import

interface ServiceOption {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  isPopular?: boolean
  frequencyOptions?: { label: string; value: string; multiplier: number }[]
  isCustomizable?: boolean
  basePriceId?: string // Stripe Price ID for the base service
}

const serviceOptions: ServiceOption[] = [
  {
    id: "basic-clean",
    name: "Basic Clean",
    price: 99,
    description: "Perfect for regular upkeep.",
    features: [
      "Dusting surfaces",
      "Vacuuming carpets",
      "Mopping floors",
      "Bathroom wipe-down",
      "Kitchen surface clean",
    ],
    basePriceId: "price_12345", // Example Stripe Price ID
  },
  {
    id: "deep-clean",
    name: "Deep Clean",
    price: 149,
    description: "Thorough cleaning for a spotless home.",
    features: [
      "All Basic Clean features",
      "Detailed dusting (baseboards, blinds)",
      "Scrubbing bathrooms",
      "Deep kitchen cleaning (appliances exterior)",
      "Window sills cleaned",
    ],
    isPopular: true,
    basePriceId: "price_67890", // Example Stripe Price ID
  },
  {
    id: "move-in-out",
    name: "Move-in/out Clean",
    price: 249,
    description: "Comprehensive cleaning for empty homes.",
    features: [
      "All Deep Clean features",
      "Inside cabinets and drawers",
      "Inside oven and refrigerator",
      "Wall spot cleaning",
      "Baseboards and trim detailed",
    ],
    basePriceId: "price_abcde", // Example Stripe Price ID
  },
  {
    id: "custom-clean",
    name: "Custom Clean",
    price: 0, // Price will be determined by customization
    description: "Tailored to your specific needs.",
    features: [
      "Personalized service",
      "Choose specific rooms",
      "Select desired add-ons",
      "Flexible scheduling",
      "Quote based on requirements",
    ],
    isCustomizable: true,
    basePriceId: "price_custom_cleaning", // Special Price ID for custom services
  },
]

export default function PricingContent() {
  const { addItem, cart } = useCart()
  const { toast } = useToast()
  const [isCustomPanelOpen, setIsCustomPanelOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // 1 second loading animation
    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (service: ServiceOption, price: number, quantity = 1, metadata?: any) => {
    const itemToAdd = {
      id: service.id,
      name: service.name,
      price: price,
      quantity: quantity,
      priceId: service.basePriceId, // Use the basePriceId for Stripe
      metadata: metadata,
    }
    addItem(itemToAdd)
    toast({
      title: "Added to cart",
      description: `${service.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const handleCustomizeClick = (service: ServiceOption) => {
    setSelectedService(service)
    setIsCustomPanelOpen(true)
  }

  const handleCustomizationComplete = (customizedItem: any) => {
    if (customizedItem) {
      handleAddToCart(
        {
          id: customizedItem.id,
          name: customizedItem.name,
          price: customizedItem.price,
          description: "Customized cleaning service",
          features: [],
          basePriceId: "price_custom_cleaning", // Ensure this matches the special price ID
        },
        customizedItem.price,
        1,
        customizedItem.metadata,
      )
    }
    setIsCustomPanelOpen(false)
    setSelectedService(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Cleaning Plans</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the perfect cleaning plan for your home or customize your own.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-4 lg:gap-8">
          {serviceOptions.map((option) => (
            <Card
              key={option.id}
              className={`flex flex-col ${option.isPopular ? "border-blue-500 ring-2 ring-blue-500" : ""}`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  {option.name}
                  {option.isPopular && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-sm">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {option.price === 0 && option.isCustomizable ? (
                  <div className="text-3xl font-bold">Custom Quote</div>
                ) : (
                  <div className="text-3xl font-bold">{formatCurrency(option.price)}</div>
                )}
                <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                {option.isCustomizable ? (
                  <Button className="w-full" onClick={() => handleCustomizeClick(option)}>
                    Customize & Get Quote
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleAddToCart(option, option.price)}>
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {selectedService && (
        <RoomCustomizationPanel
          isOpen={isCustomPanelOpen}
          onClose={() => setIsCustomPanelOpen(false)}
          onSave={handleCustomizationComplete}
          initialService={selectedService}
        />
      )}
    </section>
  )
}
