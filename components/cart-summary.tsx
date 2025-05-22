"use client"

import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CartProvider } from "@/lib/cart-context"

interface CartSummaryProps {
  showControls?: boolean
  showCheckoutButton?: boolean
  onCheckout?: () => void
  className?: string
  standalone?: boolean
}

export function CartSummary({
  showControls = true,
  showCheckoutButton = false,
  onCheckout,
  className = "",
  standalone = false,
}: CartSummaryProps) {
  if (standalone) {
    return (
      <CartProvider>
        <CartSummaryContent
          showControls={showControls}
          showCheckoutButton={showCheckoutButton}
          onCheckout={onCheckout}
          className={className}
        />
      </CartProvider>
    )
  }

  return (
    <CartSummaryContent
      showControls={showControls}
      showCheckoutButton={showCheckoutButton}
      onCheckout={onCheckout}
      className={className}
    />
  )
}

function CartSummaryContent({
  showControls = true,
  showCheckoutButton = false,
  onCheckout,
  className = "",
}: CartSummaryProps) {
  const { cart, removeItem, updateItemQuantity, getCartTotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate values safely
  const subtotal = getCartTotal()
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  const handleCheckout = () => {
    if (onCheckout) {
      setIsLoading(true)
      onCheckout()
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Cart ({cart.items.length} items)</span>
          {showControls && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
            {item.image && (
              <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center space-x-2">
              {showControls && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </>
              )}
              {!showControls && <span className="text-sm">Qty: {item.quantity}</span>}
              <div className="text-right w-20 font-medium">{formatCurrency(item.price * item.quantity)}</div>
              {showControls && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="space-y-2 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8.25%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>

      {showCheckoutButton && (
        <CardFooter>
          <Button
            className="w-full py-6 text-lg"
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading || cart.items.length === 0}
          >
            {isLoading ? "Processing..." : `Checkout ${formatCurrency(total)}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
