"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuickCheckoutButton } from "@/components/quick-checkout-button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Check } from "lucide-react"
import Image from "next/image"

interface EnhancedServiceCardProps {
  id: string
  name: string
  description: string
  price: number
  frequency?: string
  image?: string
  popular?: boolean
  features: string[]
  metadata?: Record<string, any>
}

export function EnhancedServiceCard({
  id,
  name,
  description,
  price,
  frequency,
  image,
  popular = false,
  features,
  metadata = {},
}: EnhancedServiceCardProps) {
  const { addItem, cart } = useCart()
  const [isInCart, setIsInCart] = useState(() => cart.items.some((item) => item.id === id))

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
      paymentFrequency: frequency,
      metadata,
    })
    setIsInCart(true)
  }

  return (
    <Card className={`overflow-hidden ${popular ? "border-blue-500 shadow-lg" : ""}`}>
      {popular && <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium">MOST POPULAR</div>}
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {frequency && (
            <Badge variant="outline" className="ml-2 flex-shrink-0">
              {frequency.replace(/_/g, " ")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end mb-6">
          <span className="text-3xl font-bold">{formatCurrency(price)}</span>
          {frequency && <span className="text-muted-foreground ml-1 mb-1">/{frequency.split("_")[0]}</span>}
        </div>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <QuickCheckoutButton
          serviceName={name}
          price={price}
          metadata={metadata}
          className="w-full"
          buttonText="Book Now"
        />
        {isInCart ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="mr-2 h-4 w-4" /> Added to Cart
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
