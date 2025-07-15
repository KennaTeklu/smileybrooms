"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Trash2, ShoppingCart, PlusCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMemo } from "react"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()

  const handleClearCartClick = () => {
    clearCart()
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const cartHealthSuggestions = useMemo(() => {
    const suggestions = []

    if (cart.totalItems === 0) {
      suggestions.push({
        id: "empty-cart",
        message: "Your cart is empty. Start by adding some cleaning services!",
        icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
        action: { label: "Browse Services", href: "/pricing" },
      })
    } else {
      // Example suggestions (excluding "potential issues" as requested)
      if (cart.totalPrice < 100) {
        suggestions.push({
          id: "low-value",
          message: "Consider adding more services to maximize your cleaning value!",
          icon: <PlusCircle className="h-5 w-5 text-green-500" />,
          action: { label: "Explore More", href: "/pricing" },
        })
      }
      if (cart.items.length > 5) {
        suggestions.push({
          id: "many-items",
          message: "Review your selections to ensure everything is just right.",
          icon: <CheckCircle2 className="h-5 w-5 text-purple-500" />,
          action: { label: "Review Cart", href: "/cart" },
        })
      }
      // Add other relevant suggestions here, excluding the "potential issues" one
    }

    return suggestions
  }, [cart.totalItems, cart.totalPrice])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" /> Your Cart
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
              {cart.items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg font-semibold">Your cart is empty.</p>
                  <p className="mt-2">Looks like you haven't added any cleaning services yet.</p>
                  <Button asChild className="mt-6">
                    <Link href="/pricing">Start Cleaning Now</Link>
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1 grid gap-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Price: {formatCurrency(item.price)} / room</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                    <div className="font-semibold text-lg">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center font-bold text-xl mb-4">
                <span>Subtotal:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Health Suggestions */}
      {cartHealthSuggestions.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Suggestions for You</CardTitle>
            <CardDescription>Tips to enhance your cleaning experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartHealthSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start gap-3">
                <div className="mt-1">{suggestion.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{suggestion.message}</p>
                  {suggestion.action && (
                    <Button variant="link" className="p-0 h-auto mt-1" asChild>
                      <Link href={suggestion.action.href}>{suggestion.action.label}</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
