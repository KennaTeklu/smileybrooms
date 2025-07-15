"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ROOM_TYPES, ROOM_TIERS, requiresEmailPricing } from "@/lib/room-tiers"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const totalOnlinePrice = useMemo(() => {
    return cart.items
      .filter((item) => item.paymentType !== "in_person")
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart.items])

  const totalInPersonPrice = useMemo(() => {
    return cart.items
      .filter((item) => item.paymentType === "in_person")
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart.items])

  const handleClearCartClick = async () => {
    setIsClearing(true)
    // Simulate an async operation if needed, e.g., API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    clearCart()
    setIsClearing(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            Your Cart ({cart.totalItems} items)
          </CardTitle>
          <CardDescription>Review your selected cleaning services before proceeding to checkout.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-end p-6 border-b border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0 || isClearing}>
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Items
                </>
              )}
            </Button>
          </div>
          <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
            <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Your cart is empty.</p>
                  <Link href="/pricing" className="text-blue-600 hover:underline mt-4 block">
                    Start building your cleaning service!
                  </Link>
                </div>
              ) : (
                cart.items.map((item) => {
                  const roomTypeLabel =
                    ROOM_TYPES.find((r) => r.value === item.metadata?.roomType)?.label ||
                    item.metadata?.roomType ||
                    "N/A"
                  const tierLabel =
                    ROOM_TIERS.find((t) => t.value === item.metadata?.selectedTier)?.label ||
                    item.metadata?.selectedTier ||
                    "N/A"

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-lg">{roomTypeLabel}</p>
                          <p className="text-sm text-gray-600">{tierLabel} Cleaning</p>
                          {item.metadata?.selectedReductions && item.metadata.selectedReductions.length > 0 && (
                            <p className="text-sm text-gray-500">
                              Reductions: {item.metadata.selectedReductions.map((r) => r.replace(/-/g, " ")).join(", ")}
                            </p>
                          )}
                          {requiresEmailPricing(item.metadata?.roomType || "") && (
                            <p className="text-sm text-orange-500 font-medium">Pricing via email consultation</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-lg">
                          {requiresEmailPricing(item.metadata?.roomType || "")
                            ? "Email for Pricing"
                            : formatCurrency(item.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between text-xl font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(totalOnlinePrice + totalInPersonPrice)}</span>
            </div>
            {totalOnlinePrice > 0 && (
              <div className="flex justify-between text-lg text-gray-700 dark:text-gray-300">
                <span>Online Payment Total:</span>
                <span>{formatCurrency(totalOnlinePrice)}</span>
              </div>
            )}
            {totalInPersonPrice > 0 && (
              <div className="flex justify-between text-lg text-orange-600 font-semibold">
                <span>In-Person Payment Total:</span>
                <span>{formatCurrency(totalInPersonPrice)}</span>
              </div>
            )}
            <Button asChild className="w-full text-lg py-3 mt-4">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full text-lg py-3 mt-2">
              <Link href="/pricing">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
