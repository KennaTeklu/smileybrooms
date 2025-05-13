"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

export function ProductCatalog() {
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<string[]>([])

  const additionalServices = [
    {
      id: "carpet-cleaning",
      name: "Carpet Cleaning",
      description: "Deep clean your carpets",
      price: 79.99,
      priceId: "price_carpet_cleaning",
      image: "/professional-carpet-cleaning.png",
    },
    {
      id: "window-cleaning",
      name: "Window Cleaning",
      description: "Crystal clear windows",
      price: 49.99,
      priceId: "price_window_cleaning",
      image: "/window-cleaning-professional.png",
    },
    {
      id: "fridge-cleaning",
      name: "Fridge Cleaning",
      description: "Clean inside and out",
      price: 39.99,
      priceId: "price_fridge_cleaning",
      image: "/refrigerator-cleaning.png",
    },
    {
      id: "oven-cleaning",
      name: "Oven Cleaning",
      description: "Remove baked-on grease",
      price: 44.99,
      priceId: "price_oven_cleaning",
      image: "/oven-cleaning.png",
    },
  ]

  const handleAddToCart = (service) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      priceId: service.priceId,
      image: service.image,
      quantity: 1,
      paymentFrequency: "per_service",
    })

    // Show added state temporarily
    setAddedItems((prev) => [...prev, service.id])
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== service.id))
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {additionalServices.map((service) => (
        <Card key={service.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">{service.description}</p>
            <p className="font-bold mt-1">${service.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleAddToCart(service)}
              size="sm"
              className="w-full"
              disabled={addedItems.includes(service.id)}
            >
              {addedItems.includes(service.id) ? "Added!" : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
