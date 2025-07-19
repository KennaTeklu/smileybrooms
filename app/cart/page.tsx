"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItemDisplay } from "@/components/cart/cart-item-display"
import Link from "next/link"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { CollapsibleCartPanel } from "@/components/collapsible-cart-panel"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { ProductCatalog } from "@/components/product-catalog"
import { ServiceSummaryCard } from "@/components/service-summary-card"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export default function CartPage() {
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (cart.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some services to get started!",
        variant: "default",
      })
    }
  }, [cart.items.length, toast])

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

        {cart.items.length === 0 ? (
          <Card className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl mb-2">Your cart is empty</CardTitle>
            <CardContent className="text-muted-foreground mb-6">
              Looks like you haven't added any services yet.
            </CardContent>
            <Link href="/pricing">
              <Button size="lg" className="px-8 py-3 rounded-lg">
                Browse Services
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <CartItemDisplay key={item.id} item={item} />
              ))}
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleClearCart} className="rounded-lg bg-transparent">
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.summary.subTotal)}</span>
                  </div>
                  {cart.summary.discounts > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discounts</span>
                      <span>-{formatPrice(cart.summary.discounts)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{formatPrice(cart.summary.taxes)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(cart.summary.grandTotal)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/checkout" className="w-full">
                    <Button
                      className="w-full rounded-lg py-3"
                      size="lg"
                      aria-label="Proceed to checkout and finalize your booking"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Collapsible Panels */}
              <CollapsibleCartPanel />
              <CollapsibleAddAllPanel />
            </div>
          </div>
        )}

        {/* Product Catalog for suggestions */}
        {cart.items.length === 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6">Explore Our Services</h2>
            <ProductCatalog />
          </div>
        )}

        {/* Service Summary Card (if applicable) */}
        {cart.items.length > 0 && (
          <div className="mt-12">
            <ServiceSummaryCard />
          </div>
        )}
      </div>
    </div>
  )
}
