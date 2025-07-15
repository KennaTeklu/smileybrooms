"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { Trash2, ShoppingCart, ArrowRight, Lightbulb, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart()
  const router = useRouter()

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleClearCartClick = () => {
    clearCart()
  }

  const handleCheckoutClick = () => {
    router.push("/checkout")
  }

  // Suggestions for the user (excluding the "cart has potential issues" one)
  const suggestions = [
    "Consider adding a deep cleaning service for a more thorough clean.",
    "Explore our eco-friendly cleaning options for a healthier home.",
    "Don't forget to check out our special seasonal discounts!",
    "Add more rooms to get a better value on your cleaning package.",
    "Schedule recurring cleanings to maintain a consistently sparkling home.",
  ].filter((suggestion) => !suggestion.includes("Your cart has some potential issues")) // Filter out the specific suggestion

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Your Cart
          </CardTitle>
          <CardDescription>Review your selected cleaning services before checkout.</CardDescription>
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
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Your cart is empty.</p>
                  <Link href="/pricing">
                    <Button className="mt-4">Start Adding Services</Button>
                  </Link>
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
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {formatCurrency(item.price)} per item
                        </p>
                        {item.metadata?.roomType && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Room Type: {item.metadata.roomType.replace(/_/g, " ")}
                          </p>
                        )}
                        {item.metadata?.selectedTier && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Tier: {item.metadata.selectedTier.replace(/_/g, " ")}
                          </p>
                        )}
                        {item.metadata?.selectedAddOns?.length > 0 && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Add-ons: {item.metadata.selectedAddOns.map((a: string) => a.replace(/_/g, " ")).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-2 text-lg">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-semibold text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {cart.items.length > 0 && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>Tax (8%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button className="w-full h-12 text-lg" onClick={handleCheckoutClick}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Health Report - Suggestions Only */}
      {cart.items.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              Suggestions for You
            </CardTitle>
            <CardDescription>Here are some tips to enhance your cleaning experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
