"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2, ShoppingCart, XCircle, AlertCircle, MinusCircle, PlusCircle } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { ROOM_TIERS, ADD_ONS, REDUCTIONS, requiresEmailPricing } from "@/lib/room-tiers"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()

  const subtotal = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      // Only sum items that are not "email for pricing"
      if (!requiresEmailPricing(item.metadata?.roomType)) {
        return sum + item.price * item.quantity
      }
      return sum
    }, 0)
  }, [cart.items])

  const totalItems = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart.items])

  const handleClearCartClick = () => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    })
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      toast({
        title: "Item Removed",
        description: "Item quantity reduced to zero and removed from cart.",
        variant: "default",
      })
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const cartHealthSuggestions = useMemo(() => {
    const suggestions: string[] = []

    // Suggest adding more rooms if cart is empty or very small
    if (cart.items.length === 0) {
      suggestions.push("Your cart is empty. Explore our services to get started!")
    } else if (totalItems < 2) {
      suggestions.push("Consider adding more rooms or services to get the most out of your cleaning!")
    }

    // Suggest reviewing add-ons if none are selected
    const hasAddOns = cart.items.some(
      (item) => item.metadata?.selectedAddOns && item.metadata.selectedAddOns.length > 0,
    )
    if (!hasAddOns && cart.items.length > 0) {
      suggestions.push(
        "Enhance your cleaning with our popular add-on services like deep carpet cleaning or window washing.",
      )
    }

    // Suggest checking for discounts/packages
    const hasDiscount = cart.items.some((item) => item.metadata?.discountApplied) // Assuming a discount flag
    if (!hasDiscount && subtotal > 100) {
      suggestions.push("Looking to save? Check out our full house packages or available promotions!")
    }

    return suggestions
  }, [cart.items, totalItems, subtotal])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Your Cart ({totalItems} items)
          </CardTitle>
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
              {cart.items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-xl font-semibold">Your cart is empty.</p>
                  <p className="mt-2">Add some cleaning services to get started!</p>
                  <Button asChild className="mt-6">
                    <Link href="/pricing">Browse Services</Link>
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          {item.metadata?.frequency && <p>Frequency: {item.metadata.frequency.replace(/_/g, " ")}</p>}
                          {item.metadata?.rooms && <p>Rooms: {item.metadata.rooms}</p>}
                          {item.metadata?.selectedTier && (
                            <p>
                              Tier:{" "}
                              {ROOM_TIERS.find((t) => t.value === item.metadata.selectedTier)?.label ||
                                item.metadata.selectedTier}
                            </p>
                          )}
                          {item.metadata?.selectedAddOns && item.metadata.selectedAddOns.length > 0 && (
                            <p>
                              Add-ons:{" "}
                              {item.metadata.selectedAddOns
                                .map((addon) => ADD_ONS.find((a) => a.value === addon)?.label || addon)
                                .join(", ")}
                            </p>
                          )}
                          {item.metadata?.selectedReductions && item.metadata.selectedReductions.length > 0 && (
                            <p>
                              Reductions:{" "}
                              {item.metadata.selectedReductions
                                .map((reduction) => REDUCTIONS.find((r) => r.value === reduction)?.label || reduction)
                                .join(", ")}
                            </p>
                          )}
                          {requiresEmailPricing(item.metadata?.roomType) && (
                            <p className="text-orange-500 font-semibold">Email for Pricing</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium text-lg">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      {requiresEmailPricing(item.metadata?.roomType) ? (
                        <span className="font-medium text-lg text-orange-600">N/A</span>
                      ) : (
                        <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <XCircle className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {cart.items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
              {/* Cart Health Suggestions */}
              {cartHealthSuggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    Suggestions for you
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                    {cartHealthSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between text-2xl font-bold">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild className="w-full text-lg py-3">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
