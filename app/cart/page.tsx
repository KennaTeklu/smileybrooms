"use client"

import { CardFooter } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()

  const handleClearCartClick = () => {
    clearCart()
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    } else {
      removeItem(id)
    }
  }

  const cartHealthSuggestions = [
    "Consider adding a deep cleaning service for a more thorough clean.",
    "Explore our eco-friendly cleaning options for a sustainable choice.",
    "Don't forget to check out our special offers and discounts!",
    "Add a recurring service to save on future cleanings.",
  ]

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">Your Cart ({cart.totalItems})</CardTitle>
          <CardDescription>Review your selected cleaning services before checkout.</CardDescription>
        </CardHeader>
        <div className="flex justify-end p-6 border-b border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClearCartClick} disabled={cart.items.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Items
          </Button>
        </div>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[70vh] lg:max-h-[calc(100vh-250px)]">
            <div className="space-y-4 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {cart.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Your cart is empty. Start adding services to get an estimate!
                  <Button asChild className="mt-4">
                    <Link href="/pricing">Browse Services</Link>
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 grid gap-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.roomType} - {item.selectedTier}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardContent className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotalPrice)}</span>
            </div>
            {cart.couponDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(cart.couponDiscount)}</span>
              </div>
            )}
            {cart.fullHouseDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Full House Discount</span>
                <span>-{formatCurrency(cart.fullHouseDiscount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total (Online Payment)</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
            {cart.inPersonPaymentTotal > 0 && (
              <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-400">
                <span>Total (In-Person Payment)</span>
                <span>{formatCurrency(cart.inPersonPaymentTotal)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full" disabled={cart.totalItems === 0}>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          {cart.items.length > 0 && (
            <div className="w-full space-y-2">
              <h4 className="font-semibold text-lg">Suggestions for you:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                {cartHealthSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
