"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const router = useRouter()

  // Redirect to pricing if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
    }
  }, [cart.items.length, router])

  // Handle quantity changes
  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items.find((item) => item.id === itemId)
    if (currentItem) {
      updateQuantity(itemId, currentItem.quantity + change)
    }
  }

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  // Handle checkout
  const handleCheckout = () => {
    router.push("/checkout")
  }

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/pricing")
  }

  // Handle clear cart
  const handleClearCart = () => {
    clearCart()
  }

  // Animation variants for individual cart items
  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  }

  // Don't render anything if cart is empty (will redirect)
  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-128px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleContinueShopping} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Your Cart</h1>
          {cart.totalItems > 0 && (
            <Badge variant="secondary" className="ml-2 text-base">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 flex-1">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout // Enable layout animations for smooth reordering
                    className="group relative bg-card rounded-lg p-4 border hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
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
                        <h4 className="font-medium text-lg leading-tight mb-1">{item.name}</h4>
                        {item.sourceSection && (
                          <p className="text-sm text-muted-foreground mb-2">{item.sourceSection}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-base font-medium min-w-[3ch] text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-1 bg-card p-6 rounded-lg shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <Separator className="mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            {/* Add more summary lines if needed, e.g., tax, discount */}
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
            <Button onClick={handleClearCart} variant="outline" className="w-full">
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
