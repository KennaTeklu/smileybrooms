"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useState } from "react" // Import useState

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
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_2",
    name: "Premium Plan",
    description: "Advanced features for growing businesses",
    price: 49.99,
    priceId: "price_premium123", // Replace with your actual Stripe price ID
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_3",
    name: "Enterprise Plan",
    description: "Complete solution for large organizations",
    price: 99.99,
    priceId: "price_enterprise123", // Replace with your actual Stripe price ID
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function ProductCatalog() {
  const { addItem } = useCart()
  const [addingProductId, setAddingProductId] = useState<string | null>(null) // State to track which product is being added

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id) // Set loading state for this product
    try {
      // Simulate an async operation, e.g., API call to add to cart
      await new Promise((resolve) => setTimeout(resolve, 500))
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        priceId: product.priceId,
        image: product.image,
        sourceSection: "Product Catalog", // Add source section for analytics
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      // Optionally show an error toast here if addItem doesn't handle it
    } finally {
      setAddingProductId(null) // Reset loading state
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-32 w-32 object-contain" />
            </div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleAddToCart(product)}
              disabled={addingProductId === product.id} // Disable if this product is being added
            >
              {addingProductId === product.id ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
