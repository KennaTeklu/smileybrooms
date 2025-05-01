"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Product = {
  id: string
  name: string
  description: string
  price: number
  priceId: string
  image: string
}

const products: Product[] = [
  {
    id: "prod_1",
    name: "Basic Plan",
    description: "Essential features for small businesses",
    price: 29.99,
    priceId: "price_basic123", // Replace with your actual Stripe price ID
    image: "/basic-plan.png",
  },
  {
    id: "prod_2",
    name: "Premium Plan",
    description: "Advanced features for growing businesses",
    price: 49.99,
    priceId: "price_premium123", // Replace with your actual Stripe price ID
    image: "/premium-plan.png",
  },
  {
    id: "prod_3",
    name: "Enterprise Plan",
    description: "Complete solution for large organizations",
    price: 99.99,
    priceId: "price_enterprise123", // Replace with your actual Stripe price ID
    image: "/enterprise-plan.png",
  },
]

export default function ProductCatalog() {
  const { addItem, cart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({})

  // Initialize quantities from cart on component mount
  useEffect(() => {
    const initialQuantities: Record<string, number> = {}

    // Check if items are already in cart and set initial quantities
    products.forEach((product) => {
      const cartItem = cart.items.find((item) => item.id === product.id)
      if (cartItem) {
        initialQuantities[product.id] = cartItem.quantity
        setAddedToCart((prev) => ({ ...prev, [product.id]: true }))
      } else {
        initialQuantities[product.id] = 0
      }
    })

    setQuantities(initialQuantities)
  }, [cart.items])

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, (prev[productId] || 0) + change)
      return { ...prev, [productId]: newQuantity }
    })
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0

    if (quantity > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        priceId: product.priceId,
        image: product.image,
        quantity: quantity,
        sourceSection: "Product Catalog",
      })

      // Show success indicator
      setAddedToCart((prev) => ({ ...prev, [product.id]: true }))

      // Reset after a delay
      setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [product.id]: false }))
      }, 2000)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4 relative">
              <img
                src={product.image || "/placeholder.svg?height=100&width=100"}
                alt={product.name}
                className="h-32 w-32 object-contain"
              />
              <AnimatePresence>
                {addedToCart[product.id] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge className="bg-green-500 text-white">Added!</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center border rounded-md">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={!quantities[product.id]}
                        aria-label="Decrease quantity"
                      >
                        {quantities[product.id] > 1 ? <Minus className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{quantities[product.id] > 1 ? "Decrease quantity" : "Remove"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={quantities[product.id] || 0}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="w-10 text-center"
                    aria-live="polite"
                  >
                    {quantities[product.id] || 0}
                  </motion.div>
                </AnimatePresence>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Increase quantity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <AnimatePresence>
                {quantities[product.id] > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    Total: {formatCurrency(product.price * quantities[product.id])}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              className="w-full"
              onClick={() => handleAddToCart(product)}
              disabled={!quantities[product.id]}
              variant={quantities[product.id] ? "default" : "outline"}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {quantities[product.id] ? `Add ${quantities[product.id]} to Cart` : "Select Quantity"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
