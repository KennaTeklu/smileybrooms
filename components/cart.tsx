"use client"

import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { SidepanelHeader } from "@/components/sidepanel/sidepanel-header"
import { SidepanelContent } from "@/components/sidepanel/sidepanel-content"
import { SidepanelFooter } from "@/components/sidepanel/sidepanel-footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { CheckoutButton } from "./checkout-button" // Import CheckoutButton

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity)
  }

  const handleClearCart = () => {
    clearCart()
  }

  return (
    <AdvancedSidePanel isOpen={isOpen} onClose={onClose} side="right">
      <SidepanelHeader title="Your Cart" onClose={onClose} />
      <SidepanelContent className="flex flex-col gap-4 p-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <ShoppingCart className="mb-4 h-16 w-16" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
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
        <CheckoutButton
          items={cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            description: item.metadata?.description, // Pass description if available
            recurring: item.metadata?.recurring, // Pass recurring info if available
          }))}
          mode="payment" // Default to payment mode
          customerEmail="customer@example.com" // Replace with actual customer email if available
          metadata={{ cartId: "some_unique_cart_id" }} // Example metadata
        />
        {cartItems.length > 0 && (
          <Button variant="outline" className="w-full" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </SidepanelFooter>
    </AdvancedSidePanel>
  )
}
