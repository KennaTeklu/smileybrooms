"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import EnhancedTermsModal from "@/components/enhanced-terms-modal"

interface ServiceTypeSelectorProps {
  selectedService?: string
  onSelectService?: (service: string) => void
}

export function ServiceTypeSelector({
  selectedService: externalSelectedService,
  onSelectService,
}: ServiceTypeSelectorProps) {
  const [selectedService, setSelectedService] = useState(externalSelectedService || "")
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
    if (externalSelectedService) {
      setSelectedService(externalSelectedService)
    }
  }, [externalSelectedService])

  const services = [
    {
      id: "standard",
      name: "Standard Cleaning",
      description: "Regular cleaning service for maintenance",
      image: "/home-cleaning.png",
      price: "Base Price",
    },
    {
      id: "detailing",
      name: "Premium Detailing",
      description: "Deep cleaning with extra attention to details",
      image: "/deep-cleaning-tools.png",
      price: "+50%",
    },
  ]

  const handleSelectService = (serviceId) => {
    setSelectedService(serviceId)
    if (onSelectService) {
      onSelectService(serviceId)
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

  const handleAddToCart = (serviceId) => {
    if (!termsAccepted) {
      openTermsModal()
      return
    }

    const service = services.find((s) => s.id === serviceId)
    if (!service) return

    addItem({
      id: `service-${service.id}`,
      name: service.name,
      price: service.price,
      priceId: `price_${service.id}_cleaning`,
      image: service.image,
      quantity: 1,
      paymentFrequency: "per_service",
    })

    toast({
      title: "Added to cart!",
      description: `${service.name} has been added to your cart.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService === service.id ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => handleSelectService(service.id)}
          >
            <CardContent className="p-4">
              <div className="relative h-32 mb-4 rounded-md overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">{service.price}</span>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(service.id)
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Terms Modal */}
      <EnhancedTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        initialTab="terms"
      />
    </div>
  )
}
