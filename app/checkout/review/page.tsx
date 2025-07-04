import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { FormProgress } from "@/components/form-progress"

export default function CheckoutReviewPage() {
  const { cartItems, calculateTotal } = useCart()
  const cartTotal = calculateTotal()

  // In a real app, you'd fetch/load address and payment details from state/localStorage
  const shippingAddress = {
    fullName: "John Doe",
    address1: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "90210",
    country: "US",
  }
  const paymentMethod = "Credit Card (ending in **** 1234)" // Mock payment method

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Review Your Order</h1>

      <FormProgress currentStep={3} totalSteps={3} />

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80&text=Service"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    <p className="text-md font-bold mt-1">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-lg ml-4">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <Button asChild variant="outline">
                  <Link href="/cart">Edit Cart</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.address1}</p>
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              <p>{`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`}</p>
              <p>{shippingAddress.country}</p>
              <Button asChild variant="outline" size="sm" className="mt-2 bg-transparent">
                <Link href="/checkout/address">Edit Address</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{paymentMethod}</p>
              <Button asChild variant="outline" size="sm" className="mt-2 bg-transparent">
                <Link href="/checkout/payment">Edit Payment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="lg:col-span-1 shadow-lg h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Taxes:</span>
              <span>Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <Button className="w-full text-lg py-3">Place Order</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
