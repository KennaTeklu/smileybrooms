"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { Tag, XCircle } from "lucide-react"

export default function CouponInput() {
  const { cart, applyCoupon, removeCoupon } = useCart()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter a coupon code",
        description: "Please enter a coupon code before applying.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await applyCoupon(couponCode.trim())
      if (success) {
        toast({
          title: "Coupon Applied!",
          description: `"${couponCode}" has been successfully applied.`,
          variant: "default",
        })
        setCouponCode("") // Clear input after successful application
      } else {
        toast({
          title: "Invalid Coupon",
          description: `The coupon code "${couponCode}" is not valid or has expired.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCoupon = async () => {
    setIsLoading(true)
    try {
      await removeCoupon()
      toast({
        title: "Coupon Removed",
        description: "The coupon has been successfully removed.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error removing coupon:", error)
      toast({
        title: "Error",
        description: "Failed to remove coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="coupon-code" className="text-base flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Coupon Code
      </Label>
      {cart.appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-700">
          <span className="font-medium text-green-700 dark:text-green-300">Coupon Applied: {cart.appliedCoupon}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            disabled={isLoading}
            className="text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800"
          >
            <XCircle className="h-4 w-4 mr-1" /> Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            id="coupon-code"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 h-10"
            disabled={isLoading}
          />
          <Button onClick={handleApplyCoupon} disabled={isLoading}>
            {isLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
      )}
    </div>
  )
}
