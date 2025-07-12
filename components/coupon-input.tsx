"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

export function CouponInput() {
  const [couponCode, setCouponCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const { cart, applyCoupon, removeCoupon } = useCart()
  const { toast } = useToast()

  const handleApply = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a coupon code to apply.",
        variant: "warning",
      })
      return
    }

    setIsApplying(true)
    const success = await applyCoupon(couponCode.trim())
    setIsApplying(false)

    if (success) {
      toast({
        title: "Coupon Applied!",
        description: `Coupon "${couponCode.toUpperCase()}" has been applied successfully.`,
        variant: "success",
      })
      setCouponCode("") // Clear input on success
    } else {
      toast({
        title: "Invalid Coupon",
        description: `The coupon code "${couponCode}" is not valid or has expired.`,
        variant: "destructive",
      })
    }
  }

  const handleRemove = async () => {
    setIsApplying(true)
    await removeCoupon()
    setIsApplying(false)
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your cart.",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Have a Coupon Code?</h3>
      {cart.appliedCoupon ? (
        <div className="flex items-center justify-between p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">Coupon Applied: {cart.appliedCoupon}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRemove} disabled={isApplying}>
            {isApplying ? "Removing..." : "Remove"}
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isApplying}
          />
          <Button onClick={handleApply} disabled={isApplying}>
            {isApplying ? "Applying..." : "Apply"}
          </Button>
        </div>
      )}
    </div>
  )
}
