"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Minus, CheckCircle, AlertCircle, XCircle, Lightbulb, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { analyzeCartHealth, type CartHealthReport } from "@/lib/cart-health"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

// Placeholder for suggested products component
function CartSuggestions({ currentCartItems, id }: { currentCartItems: any[]; id?: string }) {
  // In a real application, this would fetch suggestions based on currentCartItems
  const suggestedProducts = [
    {
      id: "deep-clean-add-on",
      name: "Deep Clean Add-on",
      price: 45.0,
      image: "/placeholder.svg?height=100&width=100",
      description: "Enhance your cleaning with a deep clean for specific areas.",
    },
    {
      id: "eco-friendly-products",
      name: "Eco-Friendly Products",
      price: 15.0,
      image: "/placeholder.svg?height=100&width=100",
      description: "Upgrade to environmentally friendly cleaning supplies.",
    },
  ].filter((suggestion) => !currentCartItems.some((item) => item.id === suggestion.id)) // Filter out items already in cart

  if (suggestedProducts.length === 0) {
    return null
  }

  return (
    <Card className="shadow-lg" id={id}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" /> Suggested for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Add
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, applyCoupon } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null)
  const [itemToRemoveName, setItemToRemoveName] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cartHealth, setCartHealth] = useState<CartHealthReport | null>(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [couponInput, setCouponInput] = useState(cart.couponCode || "")

  useEffect(() => {
    if (cart.items.length > 0) {
      setCartHealth(analyzeCartHealth(cart.items))
    } else {
      setCartHealth(null)
    }
    setCouponInput(cart.couponCode || "")
  }, [cart.items, cart.couponCode])

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = cart.items.find((item) => item.id === itemId)
    if (currentItem) {
      const newQuantity = currentItem.quantity + change
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity)
      } else {
        setItemToRemoveId(itemId)
        setItemToRemoveName(currentItem.name)
        setShowRemoveConfirm(true)
      }
    }
  }

  const confirmRemoveItem = () => {
    if (itemToRemoveId) {
      removeItem(itemToRemoveId)
      setShowRemoveConfirm(false)
      setItemToRemoveId(null)
      setItemToRemoveName(null)
    }
  }

  const cancelRemoveItem = () => {
    setShowRemoveConfirm(false)
    setItemToRemoveId(null)
    setItemToRemoveName(null)
  }

  const handleRemoveItemClick = (itemId: string, itemName: string) => {
    setItemToRemoveId(itemId)
    setItemToRemoveName(itemName)
    setShowRemoveConfirm(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const handleClearCartClick = () => {
    setShowClearConfirm(true)
  }

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim())
    } else {
      toast({
        title: "Coupon field is empty",
        description: "Please enter a coupon code.",
        variant: "warning",
      })
    }
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex flex-col">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-7 h-7" />
            Your Cart
          </CardTitle>
          <CardDescription>Review your selected services before proceeding to checkout.</CardDescription>
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
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p className="font-medium">Your cart is empty.</p>
                  <p className="text-sm">Add some cleaning services to get started!</p>
                  <Button asChild className="mt-4">
                    <Link href="/pricing">Browse Services</Link>
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/20"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 grid gap-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.metadata?.roomConfig?.selectedTier || "Standard Service"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-base">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center font-semibold text-lg mb-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(cart.subtotalPrice)}</span>
              </div>
              {cart.couponDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400 text-sm mb-1">
                  <span>Coupon Discount:</span>
                  <span>-{formatCurrency(cart.couponDiscount)}</span>
                </div>
              )}
              {cart.fullHouseDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400 text-sm mb-1">
                  <span>Full House Discount:</span>
                  <span>-{formatCurrency(cart.fullHouseDiscount)}</span>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between items-center font-bold text-xl text-blue-600 dark:text-blue-400">
                <span>Total:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <Button asChild className="w-full mt-6 py-3 text-lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {cart.items.length > 0 && (
        <nav className="mb-8 flex justify-center gap-4 flex-wrap">
          <Button variant="outline" asChild>
            <Link href="#cart-items-list">Items</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#order-summary">Summary</Link>
          </Button>
          {cartHealth && (
            <Button variant="outline" asChild>
              <Link href="#cart-health-report">Health</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="#suggested-products">Suggestions</Link>
          </Button>
        </nav>
      )}

      {cartHealth && (
        <Card className="shadow-lg" id="cart-health-report">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              Cart Health Report
              {cartHealth.overallHealth === "healthy" && <CheckCircle className="h-6 w-6 text-green-500" />}
              {cartHealth.overallHealth === "warning" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
              {cartHealth.overallHealth === "critical" && <XCircle className="h-6 w-6 text-red-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartHealth.suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-500" /> Suggestions:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {cartHealth.suggestions
                    .filter(
                      (suggestion) =>
                        suggestion !==
                        "Your cart has some potential issues. Review the suggestions to optimize your order.",
                    )
                    .map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
