"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, MapPin, Clock, Star, ArrowRight, X } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

// TODO: When dark mode settings are implemented, apply the current amazing background
// For dark mode: add conditional styling like:
// className={cn(
//   "w-full sm:max-w-lg flex flex-col h-full",
//   isDarkMode ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-white"
// )}
interface UnifiedCartButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  position?: "fixed" | "static"
}

export default function UnifiedCartButton({
  className,
  variant = "outline",
  size = "default",
  showLabel = false,
  position = "static",
}: UnifiedCartButtonProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate totals
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.08875 // NY tax rate
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const checkoutUrl = await createCheckoutSession({
        lineItems: cart.items.map((item) => ({
          price: item.priceId,
          quantity: item.quantity,
        })),
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const buttonClasses = cn(
    "relative transition-all duration-200 bg-white hover:bg-gray-50 border border-gray-200",
    position === "fixed" && "fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl",
    className,
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} size={size} className={buttonClasses}>
          <ShoppingCart className="h-5 w-5" />
          {showLabel && <span className="ml-2">Cart</span>}
          {isClient && cart.totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-white">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
            </SheetTitle>
            <div className="text-sm text-muted-foreground">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </div>
          </div>

          {cart.totalItems > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">{formatCurrency(total)}</span>
            </div>
          )}
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some cleaning services to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {item.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium leading-tight">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Service metadata */}
                          {item.metadata && (
                            <div className="space-y-1 text-sm text-muted-foreground">
                              {item.metadata.frequency && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.metadata.frequency}</span>
                                </div>
                              )}
                              {item.metadata.customer?.address && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{item.metadata.customer.address}</span>
                                </div>
                              )}
                              {item.metadata.rooms && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>{item.metadata.rooms}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</div>
                              <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Order Summary */}
            <div className="space-y-4 pt-4 border-t">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>Shipping</span>
                      {shipping === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                    <span>{formatCurrency(shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button onClick={handleCheckout} disabled={isCheckingOut} className="w-full" size="lg">
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Checkout {formatCurrency(total)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={clearCart} className="w-full" size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
