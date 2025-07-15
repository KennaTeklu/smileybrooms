"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import type { CartItem } from "@/lib/cart/types"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()

  const handleClearCartClick = () => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta
    if (newQuantity <= 0) {
      removeItem(item.id)
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your cart.`,
      })
    } else {
      updateQuantity(item.id, newQuantity)
      toast({
        title: "Quantity Updated",
        description: `Quantity for ${item.name} updated to ${newQuantity}.`,
      })
    }
  }

  const cartIsEmpty = useMemo(() => cart.items.length === 0, [cart.items.length])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-7 w-7" />
            Your Cart ({cart.totalItems} items)
          </CardTitle>
          <CardDescription>Review your selected cleaning services before proceeding to checkout.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-end p-6 border-b border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Items
            </Button>
          </div>
          <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
            <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnimatePresence mode="wait">
                {cartIsEmpty ? (
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    <p className="text-lg mb-2">Your cart is empty.</p>
                    <p>Add some cleaning services to get started!</p>
                  </motion.div>
                ) : (
                  cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                            width={64}
                            height={64}
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {formatCurrency(item.price)} per item
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <Separator className="my-6" />
          <div className="p-6 pt-0">
            <div className="flex justify-between items-center text-xl font-bold mb-4">
              <span>Total:</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
            <Button className="w-full py-3 text-lg" disabled={cartIsEmpty}>
              Proceed to Checkout
            </Button>
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Suggestions for you:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>Consider adding a deep cleaning service for a more thorough clean.</li>
                <li>Check out our recurring service plans for discounted rates.</li>
                <li>Don't forget to add any special instructions for our cleaning team.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
