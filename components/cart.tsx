"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

export function Cart() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (cart.items.length === 0) return

    setIsCheckingOut(true)
    try {
      // Separate regular items from custom cleaning items
      const regularItems = cart.items.filter((item) => item.priceId !== "price_custom_cleaning")
      const customItems = cart.items.filter((item) => item.priceId === "price_custom_cleaning")

      // Create line items for regular products
      const lineItems = regularItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      }))

      // Create custom line items for custom cleaning services
      const customLineItems = customItems.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        metadata: item.metadata,
      }))

      // Get customer data from the first custom item with customer metadata
      const customerItem = customItems.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      const checkoutUrl = await createCheckoutSession({
        lineItems,
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerData?.email,
        customerData: customerData
          ? {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address,
                city: customerData.city,
                state: customerData.state,
                postal_code: customerData.zipCode,
                country: "US",
              },
            }
          : undefined,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cart.totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to your cart to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <div className="h-16 w-16 overflow-hidden rounded-md">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                      {item.metadata?.customer?.allowVideoRecording && (
                        <span className="text-xs text-green-600 font-medium">Includes video recording discount</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
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
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between py-2 font-medium">
              <span>Total</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>

            <SheetFooter className="flex-col gap-2 pt-4">
              <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
