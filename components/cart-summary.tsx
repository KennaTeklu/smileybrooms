"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CartProvider } from "@/lib/cart-context"

interface CartSummaryProps {
  showCheckoutButton?: boolean
  standalone?: boolean
}

export function CartSummary({ showCheckoutButton = true, standalone = false }: CartSummaryProps) {
  if (standalone) {
    return (
      <CartProvider>
        <CartSummaryContent showCheckoutButton={showCheckoutButton} />
      </CartProvider>
    )
  }

  return <CartSummaryContent showCheckoutButton={showCheckoutButton} />
}

function CartSummaryContent({ showCheckoutButton }: { showCheckoutButton: boolean }) {
  const { cart, removeItem, updateQuantity } = useCart()
  const router = useRouter()

  if (cart.items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border text-center">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Cart Items</h2>
      <div className="divide-y">
        {cart.items.map((item) => (
          <div key={item.id} className="py-4 flex items-center gap-4">
            {item.image && (
              <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.name}</h3>
              <div className="flex items-center mt-1">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm mr-2"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8 mt-1" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Button className="w-full mt-6" onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </Button>
      )}
    </div>
  )
}
