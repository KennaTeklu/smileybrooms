"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function EnhancedCart() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  // Handle quantity changes
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  // Handle checkout process
  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add services to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)
    try {
      // Prepare line items for Stripe
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        metadata: item.metadata || {},
      }))

      // Get customer data from the first item with customer metadata
      const customerItem = cart.items.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: customerData
          ? {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address,
                city: customerData.city || "",
                state: customerData.state || "",
                postal_code: customerData.zipCode || "",
                country: "US",
              },
            }
          : undefined,
      })

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Calculate totals
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // Example tax rate
  const total = subtotal + tax

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left side - Cart items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shopping Cart</CardTitle>
          <div className="text-sm text-muted-foreground">
            You have {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in your cart
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border rounded-lg p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  {item.image && (
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          {cart.items.length > 0 && (
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Right side - Order summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8.25%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={isCheckingOut || cart.items.length === 0}
          >
            {isCheckingOut ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout {formatCurrency(total)}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
