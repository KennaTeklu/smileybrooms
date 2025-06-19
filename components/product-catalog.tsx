"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceId: product.priceId,
      image: product.image,
      sourceSection: "Product Catalog", // Add source section for analytics
    })
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
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
