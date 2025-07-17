"use client"

import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { CheckoutButton } from "@/components/checkout-button"

export default function CartPage() {
  const cart = useCart()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  async function handleCheckout() {
    setIsCheckoutLoading(true)
    toast.loading("Starting checkout...", {
      id: "checkout",
    })

    try {
      // const response = await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     items: cart.items,
      //   }),
      // });
      // if (!response?.ok) {
      //   throw new Error("Could not initiate checkout!");
      // }
      // const data = await response.json();
      // if (data?.url) {
      //   window.location.href = data.url;
      // } else {
      //   throw new Error("Could not initiate checkout!");
      // }
    } catch (error: any) {
      toast.error("Something went wrong!", {
        id: "checkout",
      })
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-4">
            {cart.items.length > 0 ? (
              <>
                <ScrollArea>
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </ScrollArea>
                <Separator className="my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Subtotal</p>
                    <p>{formatPrice(cart.totalPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Shipping</p>
                    <p>Free</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>{formatPrice(cart.totalPrice)}</p>
                  </div>
                </div>
                <Button
                  onClick={() => cart.clearCart()}
                  disabled={cart.items.length === 0}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Clear Cart
                </Button>
              </>
            ) : (
              <div className="text-center">
                <Icons.cart className="mx-auto h-6 w-6" />
                <p className="mt-2 text-sm text-gray-500">Your cart is empty.</p>
                <Button asChild variant="link" className="mt-6 text-sm text-gray-500 font-medium">
                  <Link href="/products">Add items to your cart to continue</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <CheckoutButton
              useCheckoutPage={false} // Changed to false for direct Stripe checkout
              className="w-full h-12 rounded-lg text-base"
              size="lg"
              disabled={cart.items.length === 0 || isCheckoutLoading}
              productName="Smiley Brooms Cleaning Service" // Generic product name for Stripe
              productPrice={cart.totalPrice} // Pass the total price from the cart
            />
          </div>
        </div>
      </div>
    </div>
  )
}
