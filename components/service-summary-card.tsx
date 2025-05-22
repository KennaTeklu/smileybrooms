"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"

interface TierUpgrade {
  roomName: string
  tierName: string
  price: number
}

interface AddOn {
  roomName: string
  name: string
  price: number
}

interface Reduction {
  roomName: string
  name: string
  discount: number
}

interface ServiceSummaryCardProps {
  basePrice: number
  tierUpgrades: TierUpgrade[]
  addOns: AddOn[]
  reductions: Reduction[]
  serviceFee: number
  frequencyDiscount: number
  totalPrice: number
  onAddToCart?: () => void
  hasItems: boolean
  serviceName?: string
  frequency?: string
}

export function ServiceSummaryCard({
  basePrice,
  tierUpgrades,
  addOns,
  reductions,
  serviceFee,
  frequencyDiscount,
  totalPrice,
  onAddToCart,
  hasItems,
  serviceName = "Cleaning Service",
  frequency = "one_time",
}: ServiceSummaryCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Use the cart context
  const { addItem } = useCart()

  // Calculate subtotal before discount
  const subtotal =
    basePrice +
    tierUpgrades.reduce((sum, item) => sum + item.price, 0) +
    addOns.reduce((sum, item) => sum + item.price, 0) -
    reductions.reduce((sum, item) => sum + item.discount, 0) +
    serviceFee

  // Calculate discount amount
  const discountAmount = subtotal * (frequencyDiscount / 100)

  const handleAddToCart = () => {
    if (!hasItems) {
      return
    }

    setIsLoading(true)

    // Create a cart item
    const cartItem = {
      id: `service-${Date.now()}`,
      name: serviceName,
      price: totalPrice,
      quantity: 1,
      type: "service",
      details: {
        rooms: tierUpgrades.map((upgrade) => ({
          type: upgrade.roomName,
          count: 1,
          tier: upgrade.tierName,
        })),
        addOns,
        reductions,
        frequency,
        serviceFee,
        frequencyDiscount,
      },
    }

    // Add the item to the cart
    addItem(cartItem)

    // Call the onAddToCart callback if provided
    if (onAddToCart) {
      onAddToCart()
    }

    // Show success notification
    toast({
      title: "Added to cart",
      description: `${serviceName} has been added to your cart`,
      duration: 3000,
    })

    setIsLoading(false)
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
        <CardTitle>Service Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Price</span>
            <span>{formatCurrency(basePrice)}</span>
          </div>

          {tierUpgrades.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Tier Upgrades:</div>
              {tierUpgrades.map((upgrade, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {upgrade.roomName} ({upgrade.tierName})
                  </span>
                  <span>+{formatCurrency(upgrade.price)}</span>
                </div>
              ))}
            </>
          )}

          {addOns.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Add-ons:</div>
              {addOns.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {addon.roomName} ({addon.name})
                  </span>
                  <span>+{formatCurrency(addon.price)}</span>
                </div>
              ))}
            </>
          )}

          {reductions.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Reductions:</div>
              {reductions.map((reduction, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {reduction.roomName} (No {reduction.name})
                  </span>
                  <span>-{formatCurrency(reduction.discount)}</span>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>

          {frequencyDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Frequency Discount ({frequencyDiscount}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full py-6 text-lg" size="lg" onClick={handleAddToCart} disabled={isLoading || !hasItems}>
          {isLoading ? "Adding..." : hasItems ? "Add to Cart" : "No Services Selected"}
          {!isLoading && hasItems && <Plus className="ml-2 h-4 w-4" />}
        </Button>
        <Button variant="outline" className="w-full" onClick={handleViewCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
