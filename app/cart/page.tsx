"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()

  const handleClearCartClick = () => {
    clearCart()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Your Shopping Cart</CardTitle>
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
                <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)} each</p>
                        {item.roomType && <p className="text-xs text-muted-foreground">Room Type: {item.roomType}</p>}
                        {item.selectedTier && (
                          <p className="text-xs text-muted-foreground">Tier: {item.selectedTier}</p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-xs text-muted-foreground">Add-ons: {item.selectedAddOns.join(", ")}</p>
                        )}
                        {item.selectedReductions && item.selectedReductions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Reductions: {item.selectedReductions.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-bold text-lg sm:ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="p-6 pt-0">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
