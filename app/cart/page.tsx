"use client"

import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const router = useRouter()

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = currentItem.quantity + change
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity)
      } else {
        removeItem(itemId) // Remove item if quantity drops to 0
      }
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleCheckout = () => {
    console.log("Proceeding to checkout from cart page")
    router.push("/checkout") // Navigate to your checkout page
  }

  const handleClearCart = () => {
    clearCart()
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-card rounded-lg shadow-sm">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mb-6" />
          <h3 className="text-xl font-medium mb-3">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 flex-1">
          {/* Cart Items List */}
          <div className="md:col-span-2 bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Items in Cart ({cart.totalItems})</h2>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-background rounded-lg p-4 border hover:shadow-md transition-shadow flex gap-4 items-center"
                  >
                    {/* Item image */}
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base leading-tight mb-1">{item.name}</h4>
                      {item.sourceSection && <p className="text-sm text-muted-foreground mb-2">{item.sourceSection}</p>}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-base font-medium min-w-[2ch] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end mt-6">
              <Button variant="ghost" onClick={handleClearCart} disabled={cart.items.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="md:col-span-1 bg-card rounded-lg shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              {/* Add more summary lines like tax, shipping if applicable */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full" size="lg" disabled={cart.items.length === 0}>
              Proceed to Checkout
            </Button>
            <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
