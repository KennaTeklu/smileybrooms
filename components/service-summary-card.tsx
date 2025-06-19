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
"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface TierUpgrade {
  roomName: string
  tierName: string
  price: number
  multiplier?: number
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
  basePrice = 0,
  tierUpgrades = [],
  addOns = [],
  reductions = [],
  serviceFee = 0,
  frequencyDiscount = 0,
  totalPrice = 0,
  onAddToCart,
  hasItems = false,
  serviceName = "Cleaning Service",
  frequency = "one_time",
}: ServiceSummaryCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate subtotal before discount using the passed values
  const tierUpgradesTotal = tierUpgrades.reduce((sum, item) => sum + (item.price || 0), 0)
  const addOnsTotal = addOns.reduce((sum, item) => sum + (item.price || 0), 0)
  const reductionsTotal = reductions.reduce((sum, item) => sum + (item.discount || 0), 0)

  const subtotal = (basePrice || 0) + tierUpgradesTotal + addOnsTotal - reductionsTotal + (serviceFee || 0)

  // Calculate discount amount
  const discountAmount = subtotal * ((frequencyDiscount || 0) / 100)

  const handleAddToCart = () => {
    if (!hasItems) {
      return
    }

    setIsLoading(true)

    if (onAddToCart) {
      onAddToCart()
    }

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
          {basePrice > 0 && (
            <div className="flex justify-between">
              <span>Base Price (Essential Clean)</span>
              <span>{formatCurrency(basePrice)}</span>
            </div>
          )}

          {tierUpgrades.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Tier Upgrades:</div>
              {tierUpgrades.map((upgrade, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {upgrade.roomName} ({upgrade.tierName})
                    {upgrade.multiplier && upgrade.multiplier > 1 && ` (${upgrade.multiplier}x)`}
                  </span>
                  <span>+{formatCurrency(upgrade.price || 0)}</span>
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
                  <span>+{formatCurrency(addon.price || 0)}</span>
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
                  <span>-{formatCurrency(reduction.discount || 0)}</span>
                </div>
              ))}
            </>
          )}

          {serviceFee > 0 && (
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
          )}

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
          <span>{formatCurrency(totalPrice || 0)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full py-6 text-lg"
          size="lg"
          onClick={handleAddToCart}
          disabled={isLoading || !hasItems}
          aria-label={isLoading ? "Adding to cart..." : hasItems ? "Add to cart" : "No services selected"}
        >
          {isLoading ? "Adding..." : hasItems ? "Add to Cart" : "No Services Selected"}
          {!isLoading && hasItems && <Plus className="ml-2 h-4 w-4" aria-hidden="true" />}
        </Button>
        <Button variant="outline" className="w-full" onClick={handleViewCart} aria-label="View shopping cart">
          <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" /> View Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
