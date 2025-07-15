"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Info, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useCartHealth } from "@/lib/cart-health"
import { formatCurrency } from "@/lib/utils"

export default function CartHealthDashboard() {
  const { cart } = useCart()
  const { getCartHealthSuggestions } = useCartHealth()

  const cartHealthSuggestions = getCartHealthSuggestions(cart.items)
  const filteredSuggestions = cartHealthSuggestions.filter(
    (suggestion) => suggestion.message !== "Your cart has some potential issues.",
  )

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6" />
          Cart Health Report
        </CardTitle>
        <CardDescription>Insights and suggestions for your current cart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-3xl font-bold">{itemCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-3xl font-bold">{formatCurrency(subtotal)}</p>
          </div>
        </div>

        <Separator />

        {/* Suggestions */}
        {filteredSuggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5" />
              Suggestions for You
            </h3>
            <ul className="space-y-2">
              {filteredSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                  {suggestion.type === "warning" ? (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  )}
                  {suggestion.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        {filteredSuggestions.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p>Your cart looks great!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
