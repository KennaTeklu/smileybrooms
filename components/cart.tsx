"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import CheckoutButton from "./checkout-button"
import Image from "next/image"

export function Cart() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [animateShake, setAnimateShake] = useState(false)
  const [lastCount, setLastCount] = useState(cart.totalItems)

  // Animate cart icon when items are added
  useEffect(() => {
    if (cart.totalItems > lastCount) {
      setAnimateShake(true)
      const timer = setTimeout(() => setAnimateShake(false), 500)
      return () => clearTimeout(timer)
    }
    setLastCount(cart.totalItems)
  }, [cart.totalItems, lastCount])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative ${animateShake ? "animate-shake" : ""}`}
          aria-label={`Shopping cart with ${cart.totalItems} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
            >
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart
            {cart.totalItems > 0 && (
              <Badge variant="outline" className="ml-2">
                {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
          {cart.totalItems > 0 && <SheetDescription>Review your items before proceeding to checkout</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <div className="rounded-full bg-muted p-6 mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">Add items to your cart to see them here</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group relative"
                  >
                    <div className="flex items-start space-x-4 pb-4">
                      {item.image && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium leading-tight">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <p className="font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center tabular-nums">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-muted/80 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Separator />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {cart.items.length > 0 && (
          <>
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium tabular-nums">{formatCurrency(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Shipping & taxes</span>
                  <span className="text-sm text-muted-foreground">Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold tabular-nums">{formatCurrency(cart.totalPrice)}</span>
                </div>
              </div>

              <Alert variant="default" className="bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Shipping, taxes, and discounts calculated at checkout
                </AlertDescription>
              </Alert>
            </div>

            <SheetFooter className="flex-col gap-2 pt-4">
              <CheckoutButton size="lg" className="w-full">
                Proceed to Checkout
              </CheckoutButton>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
