"use client"

import { useState, useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, ShoppingCart, Video, Info } from "lucide-react"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartProps {
  isOpen: boolean
  onClose?: () => void
  embedded?: boolean
}

export function Cart({ isOpen, onClose, embedded = false }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customerAddressData, setCustomerAddressData] = useState<AddressData | null>(null)

  const handleRemoveItem = (id: string) => {
    removeItem(id)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
      duration: 3000,
    })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const validQuantity = Math.max(1, isNaN(quantity) ? 1 : Math.floor(quantity))
    updateQuantity(id, validQuantity)
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      duration: 3000,
    })
  }

  const videoDiscountAmount = useMemo(() => {
    if (allowVideoRecording) {
      if (cart.totalPrice >= 250) {
        return 25 // $25 discount for orders $250 or more
      } else {
        return cart.totalPrice * 0.1 // 10% discount for orders under $250
      }
    }
    return 0
  }, [allowVideoRecording, cart.totalPrice])

  const finalTotalPrice = cart.totalPrice - videoDiscountAmount

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Validate cart items
      const invalidItems = cart.items.filter(
        (item) => !item.id || !item.name || typeof item.price !== "number" || item.price <= 0,
      )

      if (invalidItems.length > 0) {
        throw new Error("Some items in your cart are invalid. Please try removing and adding them again.")
      }

      // Prepare line items for Stripe
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.metadata?.description || `Service: ${item.name}`,
            images: item.image ? [item.image] : [],
            metadata: {
              itemId: item.id,
              priceId: item.priceId,
              ...item.metadata,
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }))

      // Add video discount if applicable
      if (videoDiscountAmount > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Video Recording Discount",
              description: "Discount for allowing video recording during service",
            },
            unit_amount: -Math.round(videoDiscountAmount * 100), // Negative amount for discount
          },
          quantity: 1,
        })
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems,
          customerData: customerAddressData,
          allowVideoRecording,
          cartId: `cart_${Date.now()}`,
          metadata: {
            cartTotal: cart.totalPrice,
            discountAmount: videoDiscountAmount,
            finalTotal: finalTotalPrice,
            itemCount: cart.items.length,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout. Please try again or call us for assistance.",
      )
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleAddressSubmit = (data: AddressData) => {
    setCustomerAddressData(data)
    setShowAddressModal(false)
    // Automatically trigger checkout after address is submitted
    handleCheckout()
  }

  const CartContent = () => (
    <>
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-sm text-gray-500 mb-4">Add items to get started</p>
          <Link href="/pricing" passHref>
            <Button variant="default">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Scrollable Items Section */}
          <ScrollArea className="h-64 w-full pr-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <Card key={item.id} className="flex items-center p-3">
                  {item.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border mr-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)} {item.metadata?.frequency && `• ${item.metadata.frequency}`}
                    </p>
                    {item.metadata?.rooms && (
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        Rooms:{" "}
                        {Array.isArray(item.metadata.rooms) ? item.metadata.rooms.join(", ") : item.metadata.rooms}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Fixed Summary Section */}
          <div className="mt-4 space-y-3 rounded-lg border bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(cart.totalPrice)}</span>
            </div>
            {videoDiscountAmount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="text-sm">Video Recording Discount</span>
                <span className="font-medium">- {formatCurrency(videoDiscountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Calculated at checkout</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(finalTotalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Video Recording Option */}
          <div className="mt-4 p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowVideoRecording"
                checked={allowVideoRecording}
                onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
              />
              <Label htmlFor="allowVideoRecording" className="flex items-center gap-2 text-sm font-medium">
                <Video className="h-4 w-4 text-blue-600" />
                Allow video recording for a discount
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      We may record cleaning sessions for training and social media purposes. By allowing this, you'll
                      receive a discount on your order.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              We'll record parts of the cleaning process for our social media and training.
            </p>
          </div>

          {checkoutError && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <p>{checkoutError}</p>
            </div>
          )}
        </>
      )}
    </>
  )

  if (embedded) {
    return (
      <div className="max-w-2xl mx-auto">
        <ScrollArea className="h-[70vh] w-full">
          <div className="p-4">
            <CartContent />
          </div>
        </ScrollArea>

        {/* Fixed Action Buttons for Embedded Mode */}
        {cart.items.length > 0 && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 space-y-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold">{formatCurrency(finalTotalPrice)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCheckout}
                disabled={cart.items.length === 0 || isCheckingOut}
                className="flex-1"
                size="lg"
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <Button variant="outline" onClick={handleClearCart} disabled={cart.items.length === 0} size="lg">
                Clear
              </Button>
            </div>
          </div>
        )}

        {showAddressModal && (
          <AddressCollectionModal
            isOpen={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            onSubmit={handleAddressSubmit}
          />
        )}
      </div>
    )
  }

  return (
    <AdvancedSidePanel
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      title="Your Cart"
      width="md"
      position="right"
      primaryAction={
        cart.items.length > 0
          ? {
              label: isCheckingOut ? "Processing..." : "Proceed to Checkout",
              onClick: handleCheckout,
              disabled: cart.items.length === 0 || isCheckingOut,
              loading: isCheckingOut,
            }
          : undefined
      }
      secondaryAction={
        cart.items.length > 0
          ? {
              label: "Clear Cart",
              onClick: handleClearCart,
              disabled: cart.items.length === 0,
            }
          : undefined
      }
      priceDisplay={{
        label: "Total",
        amount: finalTotalPrice,
        currency: "$",
      }}
    >
      <div className="px-4">
        <CartContent />
      </div>

      {showAddressModal && (
        <AddressCollectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
        />
      )}
    </AdvancedSidePanel>
  )
}
