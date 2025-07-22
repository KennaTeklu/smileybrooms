"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronDown, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// -- Types ------------------------------------------------------------------

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CompletedCheckoutData {
  customerName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  email: string
  phone: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}

// -- Helpers ----------------------------------------------------------------

function getFormattedPrice(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

// -- Page Component ---------------------------------------------------------

export default function CartPage() {
  const router = useRouter()

  // ❶ Fetch cart + possible checkout completion data from localStorage.
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [completedCheckoutData, setCompletedCheckoutData] = React.useState<CompletedCheckoutData | null>(null)

  React.useEffect(() => {
    // Cart items
    const rawCart = localStorage.getItem("cart")
    if (rawCart) setCart(JSON.parse(rawCart))

    // Completed checkout (set in previous step of flow)
    const rawCompleted = localStorage.getItem("completedCheckout")
    if (rawCompleted) setCompletedCheckoutData(JSON.parse(rawCompleted))
  }, [])

  // ❷ Dynamic button label
  const primaryCtaLabel = completedCheckoutData ? "Pay Now" : "Proceed to Checkout"

  // ❸ Event handlers
  function handlePrimaryCta() {
    if (completedCheckoutData) {
      // Go straight to Stripe / payment
      router.push("/order-summary") // or your payment route
    } else {
      router.push("/checkout")
    }
  }

  // ❹ UI pieces -------------------------------------------------------------

  function CartHeader() {
    return (
      <header className="mb-8 flex items-center gap-2 text-2xl font-semibold">
        <ShoppingCart className="size-6" />
        <span>Your Shopping Cart</span>
      </header>
    )
  }

  function ReviewHeader() {
    return (
      <header className="mb-8 flex items-center gap-2 text-2xl font-semibold">
        <CheckCircle className="size-6 text-green-600" />
        <span>Review Your Order</span>
      </header>
    )
  }

  function CartItemRow({ item }: { item: CartItem }) {
    return (
      <div className="flex items-center justify-between py-2">
        <span>
          {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
        </span>
        <span>{getFormattedPrice(item.price * item.quantity)}</span>
      </div>
    )
  }

  // -- Render ---------------------------------------------------------------

  const showCartSide = !completedCheckoutData

  return (
    <main className="container mx-auto max-w-7xl px-4 py-10">
      {/* Toggle / sidebar trigger on mobile */}
      <SidebarTrigger className="mb-6 md:hidden" />

      {/* Grid wrapper */}
      <div className={cn("grid gap-8", showCartSide ? "lg:grid-cols-3" : "place-content-center")}>
        {/* ---------------- Left Column — Cart items ---------------- */}
        {showCartSide && (
          <section className="lg:col-span-2">
            <CartHeader />
            <Card className="divide-y">
              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
              {cart.length === 0 && <p className="p-6 text-center text-muted-foreground">Your cart is empty.</p>}
            </Card>
          </section>
        )}

        {/* ---------------- Right Column — CTA or Order Summary ------------ */}
        <section className={cn("flex flex-col gap-6", completedCheckoutData && "w-full max-w-4xl lg:col-span-full")}>
          {/* Swap header depending on state */}
          {completedCheckoutData ? <ReviewHeader /> : <CartHeader />}

          {/* ===================== STATE A: CART CTA ===================== */}
          {!completedCheckoutData && (
            <Card className="p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold">Ready to complete your booking?</h3>
              <Button size="lg" onClick={handlePrimaryCta}>
                {primaryCtaLabel}
              </Button>
            </Card>
          )}

          {/* ===================== STATE B: ORDER SUMMARY ================== */}
          {completedCheckoutData && (
            <React.Fragment>
              {/* Summary Card ------------------------------------------------ */}
              <Card className="p-6">
                {/* Collapsed Purchased Items */}
                <Collapsible defaultOpen={false} className="mb-4">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between text-left text-lg font-medium">
                      Purchased Items
                      <ChevronDown className="size-5 shrink-0 transition-transform data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    {completedCheckoutData.items.map((item) => (
                      <CartItemRow key={item.id} item={item} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Collapsed Customer Info */}
                <Collapsible defaultOpen={false} className="my-4">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between text-left text-lg font-medium">
                      Customer Information
                      <ChevronDown className="size-5 shrink-0 transition-transform data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-1 text-sm">
                    <p>{completedCheckoutData.customerName}</p>
                    <p>{completedCheckoutData.email}</p>
                    <p>{completedCheckoutData.phone}</p>
                    <p>
                      {completedCheckoutData.addressLine1}
                      {completedCheckoutData.addressLine2 ? `, ${completedCheckoutData.addressLine2}` : ""}
                    </p>
                    <p>
                      {completedCheckoutData.city}, {completedCheckoutData.state} {completedCheckoutData.zip}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Price Breakdown */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{getFormattedPrice(completedCheckoutData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{getFormattedPrice(completedCheckoutData.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{getFormattedPrice(completedCheckoutData.total)}</span>
                  </div>
                </div>

                <Button size="lg" className="mt-6 w-full" onClick={handlePrimaryCta}>
                  {primaryCtaLabel}
                </Button>
              </Card>

              {/* Continue Shopping link */}
              <div className="text-center">
                <Button variant="link" onClick={() => router.push("/")} className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            </React.Fragment>
          )}
        </section>
      </div>
    </main>
  )
}
