"use client"

import React from "react"

import { X, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import ScrollAwareWrapper from "./scroll-aware-wrapper"

interface CartProps {
  children?: React.ReactNode
}

export function Cart({ children }: CartProps) {
  const { items, totalPrice, removeItem, addItem, decreaseQuantity } = useCart()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ScrollAwareWrapper>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="space-y-2.5 pr-6">
            <SheetTitle>
              Cart ({items.length})
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="ml-auto">
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          {items.length > 0 ? (
            <>
              <ScrollArea className="my-4 h-full rounded-md pr-6">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onAdd={() => addItem(item)}
                    onDecrease={() => decreaseQuantity(item.id)}
                  />
                ))}
              </ScrollArea>
              <div className="space-y-4 pr-6">
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex">
                    <span className="mr-2">Subtotal</span>
                    <span className="ml-auto">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-2">Shipping</span>
                    <span className="ml-auto">Free</span>
                  </div>
                  <div className="flex">
                    <span className="mr-2">Tax</span>
                    <span className="ml-auto">Included</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm font-medium">
                  <div className="flex">
                    <span className="mr-2">Total</span>
                    <span className="ml-auto">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-1 text-sm">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              <p>Your cart is empty.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ScrollAwareWrapper>
  )
}
