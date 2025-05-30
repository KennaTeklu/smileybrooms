"use client"

import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { SidepanelHeader } from "@/components/sidepanel/sidepanel-header"
import { SidepanelContent } from "@/components/sidepanel/sidepanel-content"
import { SidepanelFooter } from "@/components/sidepanel/sidepanel-footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2 } from "lucide-react"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart()

  return (
    <AdvancedSidePanel isOpen={isOpen} onClose={onClose} side="right">
      <SidepanelHeader title="Your Cart" onClose={onClose} />
      <SidepanelContent className="flex flex-col gap-4 p-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SidepanelContent>
      <SidepanelFooter className="flex flex-col gap-2 p-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Button className="w-full" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </Button>
        {cartItems.length > 0 && (
          <Button variant="outline" className="w-full" onClick={clearCart}>
            Clear Cart
          </Button>
        )}
      </SidepanelFooter>
    </AdvancedSidePanel>
  )
}
