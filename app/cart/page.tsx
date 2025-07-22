"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CartItemDisplay } from "@/components/cart-item-display"

// Dummy type for checkout data - replace with your actual type
type CheckoutData = {
  customer: {
    name: string
    email: string
    address: string
  }
}

const CartPage = () => {
  const { cartItems, totalPrice } = useCart()
  const [completedCheckoutData, setCompletedCheckoutData] = useState<CheckoutData | null>(null)

  const handleCheckout = () => {
    // In a real application, you would send the cart data to your backend
    // and process the payment.  For this example, we'll just simulate
    // a successful checkout and store some dummy data.
    const dummyCheckoutData: CheckoutData = {
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Main St",
      },
    }
    setCompletedCheckoutData(dummyCheckoutData)
  }

  return (
    <div className="container py-12">
      {!completedCheckoutData && <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>}

      <div className={cn("grid lg:grid-cols-3 gap-8", completedCheckoutData && "lg:grid-cols-1")}>
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div
          className={cn("flex flex-col gap-8", completedCheckoutData ? "w-full max-w-4xl mx-auto" : "lg:col-span-1")}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Subtotal</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Shipping</p>
                  <p>Free</p>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <p>Total</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full justify-between font-medium">
                    Purchased Items
                    <ChevronDown />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {cartItems.map((item) => (
                      <CartItemDisplay key={item.id} item={item} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full justify-between font-medium mt-6">
                    Customer Information
                    <ChevronDown />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-4 text-sm">
                    <p>
                      <strong>Name:&nbsp;</strong>
                      {completedCheckoutData?.customer.name}
                    </p>
                    <p>
                      <strong>Email:&nbsp;</strong>
                      {completedCheckoutData?.customer.email}
                    </p>
                    <p>
                      <strong>Address:&nbsp;</strong>
                      {completedCheckoutData?.customer.address}
                    </p>
                    {/* Add any other fields you store */}
                  </CollapsibleContent>
                </Collapsible>

                <Button onClick={handleCheckout}>{completedCheckoutData ? "Pay now" : "Proceed to Checkout"}</Button>
                {completedCheckoutData && (
                  <Button variant="link" href="/" className="mx-auto">
                    Continue shopping
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage
