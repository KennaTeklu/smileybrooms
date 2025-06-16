"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { CheckoutButton } from "@/components/checkout-button"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import CartButton from "@/components/cart-button"

export function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close cart function
  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Open cart function
  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClearCart = useCallback(() => {
    clearCart()
  }, [clearCart])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

  // Cart content for the side panel
  const cartContent = (
    <div className="space-y-6">
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold text-muted-foreground">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground/80 mb-6">Add some cleaning services to get started!</p>
          <Button onClick={closeCart} variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border border-border/50 p-4 transition-all hover:border-border hover:shadow-sm"
              >
                {item.image && (
                  <div className="mb-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      {item.sourceSection && (
                        <p className="text-xs text-muted-foreground/70 mt-1">{item.sourceSection}</p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total ({cart.totalItems} items):</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <CheckoutButton />
              <Button variant="outline" onClick={handleClearCart} className="w-full" disabled={cart.items.length === 0}>
                Clear Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Enhanced Floating Cart Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <CartButton
          variant="floating"
          size="lg"
          position="floating"
          onOpenCart={openCart}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 bg-primary hover:bg-primary/90 border-2 border-background/20 backdrop-blur-sm"
        />
      </div>

      {/* Advanced Side Panel for Cart */}
      <AdvancedSidePanel
        isOpen={isOpen}
        onClose={closeCart}
        title="Shopping Cart"
        subtitle={cart.items.length > 0 ? `${cart.totalItems} items` : "Empty cart"}
        width="lg"
        position="right"
        preserveScrollPosition={true}
        scrollKey="cart-items"
        primaryAction={
          cart.items.length > 0
            ? {
                label: "Checkout",
                onClick: () => {
                  // Handle checkout logic
                  console.log("Proceeding to checkout")
                },
                disabled: false,
                loading: false,
              }
            : undefined
        }
        secondaryAction={
          cart.items.length > 0
            ? {
                label: "Clear Cart",
                onClick: handleClearCart,
                disabled: false,
              }
            : undefined
        }
        priceDisplay={
          cart.items.length > 0
            ? {
                label: "Total",
                amount: cart.totalPrice,
                currency: "$",
              }
            : undefined
        }
      >
        {cartContent}
      </AdvancedSidePanel>
    </>
  )
}
