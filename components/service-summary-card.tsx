"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ServiceSummaryProps {
  basePrice?: number
  tierUpgrades?: Array<{ roomName: string; tierName: string; price: number }>
  addOns?: Array<{ roomName: string; name: string; price: number }>
  reductions?: Array<{ roomName: string; name: string; discount: number }>
  serviceFee?: number
  frequencyDiscount?: number
  totalPrice: number
  onBookNow?: () => void
}

export function ServiceSummaryCard({
  basePrice = 0,
  tierUpgrades = [],
  addOns = [],
  reductions = [],
  serviceFee = 0,
  frequencyDiscount = 0,
  totalPrice,
  onBookNow,
}: ServiceSummaryProps) {
  const { cart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate subtotal
  const subtotal =
    basePrice +
    tierUpgrades.reduce((sum, item) => sum + item.price, 0) +
    addOns.reduce((sum, item) => sum + item.price, 0) -
    reductions.reduce((sum, item) => sum + item.discount, 0)

  // Calculate discount amount
  const discountAmount = subtotal * (frequencyDiscount / 100)

  // Handle booking action
  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow()
      return
    }

    setIsLoading(true)

    // If cart is empty, show a message
    if (cart.items.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select services before booking",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Navigate to checkout
    router.push("/checkout")
  }

  return (
    <Card className="shadow-sm border-2 border-blue-100">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="flex justify-between items-center">
          <span>Service Summary</span>
          <span className="text-2xl font-bold">{formatCurrency(totalPrice)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {basePrice > 0 && (
          <div className="flex justify-between items-center">
            <span>Base Services</span>
            <span>{formatCurrency(basePrice)}</span>
          </div>
        )}

        {tierUpgrades.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span>Tier Upgrades</span>
              <span>+{formatCurrency(tierUpgrades.reduce((sum, item) => sum + item.price, 0))}</span>
            </div>
            <div className="pl-4 text-sm text-gray-500 space-y-1">
              {tierUpgrades.map((upgrade, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {upgrade.roomName} ({upgrade.tierName})
                  </span>
                  <span>+{formatCurrency(upgrade.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {addOns.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span>Add-ons</span>
              <span>+{formatCurrency(addOns.reduce((sum, item) => sum + item.price, 0))}</span>
            </div>
            <div className="pl-4 text-sm text-gray-500 space-y-1">
              {addOns.map((addon, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {addon.name} ({addon.roomName})
                  </span>
                  <span>+{formatCurrency(addon.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {reductions.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span>Reductions</span>
              <span className="text-red-500">
                -{formatCurrency(reductions.reduce((sum, item) => sum + item.discount, 0))}
              </span>
            </div>
            <div className="pl-4 text-sm text-gray-500 space-y-1">
              {reductions.map((reduction, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {reduction.name} ({reduction.roomName})
                  </span>
                  <span className="text-red-500">-{formatCurrency(reduction.discount)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {serviceFee > 0 && (
          <div className="flex justify-between items-center">
            <span>Service Fee</span>
            <span>+{formatCurrency(serviceFee)}</span>
          </div>
        )}

        {frequencyDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span>Frequency Discount ({frequencyDiscount}%)</span>
            <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-center font-bold">
          <span>Total</span>
          <span className="text-xl">{formatCurrency(totalPrice)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button size="lg" className="w-full text-lg py-6" onClick={handleBookNow} disabled={isLoading}>
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              Book Now <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/cart")}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
