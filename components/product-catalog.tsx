"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Check, Star, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Product = {
  id: string
  name: string
  description: string
  price: number
  priceId: string
  image: string
  category: string
  features?: string[]
  rating?: number
  popular?: boolean
  new?: boolean
}

// Enhanced product data with more details
const products: Product[] = [
  {
    id: "prod_1",
    name: "Basic Plan",
    description: "Essential features for small businesses and startups",
    price: 29.99,
    priceId: "price_basic123", // Replace with your actual Stripe price ID
    image: "/placeholder.svg?height=200&width=200",
    category: "subscription",
    features: ["5 user accounts", "10GB storage", "Basic analytics", "Email support"],
    rating: 4.2,
    popular: true,
  },
  {
    id: "prod_2",
    name: "Premium Plan",
    description: "Advanced features for growing businesses",
    price: 49.99,
    priceId: "price_premium123", // Replace with your actual Stripe price ID
    image: "/placeholder.svg?height=200&width=200",
    category: "subscription",
    features: ["25 user accounts", "50GB storage", "Advanced analytics", "Priority support", "API access"],
    rating: 4.7,
    popular: true,
  },
  {
    id: "prod_3",
    name: "Enterprise Plan",
    description: "Complete solution for large organizations",
    price: 99.99,
    priceId: "price_enterprise123", // Replace with your actual Stripe price ID
    image: "/placeholder.svg?height=200&width=200",
    category: "subscription",
    features: [
      "Unlimited users",
      "500GB storage",
      "Custom analytics",
      "24/7 dedicated support",
      "API access",
      "Custom integrations",
    ],
    rating: 4.9,
  },
  {
    id: "prod_4",
    name: "Data Migration Tool",
    description: "Seamlessly transfer your data from other platforms",
    price: 149.99,
    priceId: "price_migration123",
    image: "/placeholder.svg?height=200&width=200",
    category: "tool",
    features: ["One-time purchase", "All data formats supported", "Automated mapping", "Expert assistance"],
    rating: 4.5,
    new: true,
  },
  {
    id: "prod_5",
    name: "Security Add-on",
    description: "Enhanced security features for your account",
    price: 19.99,
    priceId: "price_security123",
    image: "/placeholder.svg?height=200&width=200",
    category: "addon",
    features: ["Advanced encryption", "Two-factor authentication", "Security audits", "Compliance reports"],
    rating: 4.8,
  },
  {
    id: "prod_6",
    name: "API Access Package",
    description: "Full API access with increased rate limits",
    price: 39.99,
    priceId: "price_api123",
    image: "/placeholder.svg?height=200&width=200",
    category: "addon",
    features: ["10,000 requests/day", "Webhook support", "Developer support", "Custom endpoints"],
    rating: 4.6,
    new: true,
  },
]

export default function ProductCatalog() {
  const { addItem, isItemInCart } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({})

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceId: product.priceId,
      image: product.image,
      description: product.description,
    })

    // Show the added animation
    setAddedProducts((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  const categories = [
    { id: "all", name: "All Products" },
    { id: "subscription", name: "Subscriptions" },
    { id: "addon", name: "Add-ons" },
    { id: "tool", name: "Tools" },
  ]

  return (
    <div className="space-y-8">
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Our Products</h2>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="relative mb-2">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          {product.popular && (
                            <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                              Popular
                            </Badge>
                          )}
                          {product.new && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription className="mt-1">{product.description}</CardDescription>
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded text-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {product.features && (
                        <ul className="space-y-1 text-sm">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4 border-t">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">
                                {product.category === "subscription"
                                  ? "Billed monthly. Cancel anytime."
                                  : "One-time purchase"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                        disabled={isItemInCart(product.id) || addedProducts[product.id]}
                        variant={isItemInCart(product.id) ? "secondary" : "default"}
                      >
                        {isItemInCart(product.id) ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Added to Cart
                          </>
                        ) : addedProducts[product.id] ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
