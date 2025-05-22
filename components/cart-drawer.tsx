"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ShoppingCart, X, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function CartDrawer() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate tax and total
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.0825 // 8.25% tax rate
  const total = subtotal + tax

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`Shopping cart with ${cart.totalItems} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 p-0 rounded-full"
            >
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Your Cart ({cart.totalItems})</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Add services to get started</p>
            <SheetClose asChild>
              <Button onClick={() => router.push("/pricing")}>Browse Services</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.image && (
                      <div className="h-16 w-16 rounded-md overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} {item.paymentFrequency && `(${item.paymentFrequency})`}
                      </p>
                      {item.metadata && item.metadata.rooms && (
                        <p className="text-xs text-muted-foreground mt-1">{item.metadata.rooms}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8.25%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => router.push("/cart")}>
                    View Cart
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
