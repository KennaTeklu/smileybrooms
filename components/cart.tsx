"use client"

import { useState, useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, CreditCard, Wallet, BanknoteIcon as Bank, ShoppingCart } from "lucide-react"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from "next/image"
import Link from "next/link"

type PaymentMethod = "card" | "bank" | "wallet"

// Helper function to get services per year based on frequency
const getServicesPerYearFromFrequency = (frequency: string) => {
  switch (frequency) {
    case "weekly":
      return 52
    case "biweekly":
      return 26
    case "monthly":
      return 12
    case "semi_annual":
      return 2
    case "annually":
      return 1
    case "vip_daily":
      return 365
    case "one_time":
    default:
      return 1
  }
}

interface CartProps {
  showLabel?: boolean
}

export function Cart({ showLabel = false }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart, addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && isOpen) {
      setIsOpen(false)
    } else if (open) {
      setIsOpen(true)
    }
  }

  const createGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

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

  const handleAddItem = (item: any) => {
    addItem(item)
    toast({
      title: "Item added",
      description: "The item has been added to your cart",
      duration: 3000,
    })
  }

  const videoDiscountAmount = useMemo(() => {
    const hasVideoRecordingOptIn = cart.items.some((item) => item.metadata?.customer?.allowVideoRecording)
    if (hasVideoRecordingOptIn) {
      const percentDiscount = cart.totalPrice * 0.1 // 10% discount
      return Math.min(25, percentDiscount) // $25 or 10%, whichever is less
    }
    return 0
  }, [cart.items, cart.totalPrice])

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
    setCheckoutSuccess(false)

    try {
      const invalidItems = cart.items.filter(
        (item) => !item.id || !item.name || typeof item.price !== "number" || item.price <= 0,
      )

      if (invalidItems.length > 0) {
        throw new Error("Some items in your cart are invalid. Please try removing and adding them again.")
      }

      const regularItems = cart.items.filter(
        (item) => item.priceId !== "price_custom_cleaning" && item.priceId !== "price_custom_service",
      )
      const customItems = cart.items.filter(
        (item) => item.priceId === "price_custom_cleaning" || item.priceId === "price_custom_service",
      )

      const lineItems = regularItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      }))

      const customLineItems = customItems.map((item) => ({
        name: item.name,
        amount: Math.round(item.price * 100) / 100,
        quantity: item.quantity,
        metadata: {
          ...item.metadata,
          paymentMethod,
        },
      }))

      const customerItem = customItems.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      const calculateOrderMetrics = () => {
        return {
          totalItems: cart.items.length,
          totalQuantity: cart.totalItems,
          averageItemPrice: cart.totalPrice / cart.totalItems,
          hasCustomService: customItems.length > 0,
          hasRecurringService: customItems.some((item) => item.metadata?.isRecurring),
          itemCategories: cart.items.map((item) => item.priceId).join(","),
          discountsApplied: videoDiscountAmount > 0 ? `video_recording_${videoDiscountAmount.toFixed(2)}` : "none",
          discountAmount: videoDiscountAmount,
        }
      }

      const formatCartSummary = (items: any[]) => {
        return items.map((item) => `${item.name} (${formatCurrency(item.price)} x ${item.quantity})`).join("; ")
      }

      if (customerData) {
        const emoji = "🔵"

        const waitlistData = {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          message: `${emoji} Order received: ${customItems.map((item) => item.name).join(", ")}. Address: ${customerData.address}.`,
          source: "Cart Checkout",
          meta: {
            formType: "checkout",
            submitDate: new Date().toISOString(),
            browser: navigator.userAgent,
            page: window.location.pathname,
            referrer: document.referrer || "direct",
            device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
            totalOrderValue: finalTotalPrice,
          },
          data: {
            orderSummary: formatCartSummary(cart.items),
            customerAddress: customerData.address,
            customerCity: customerData?.city || "",
            customerState: customerData?.state || "",
            customerZip: customerData?.zipCode || "",
            serviceLocation: `${customerData.address}, ${customerData?.city || ""}, ${customerData?.state || ""} ${customerData?.zipCode || ""}`,
            mapsLink: customerData.googleMapsLink || createGoogleMapsLink(customerData.address),
            paymentMethod: paymentMethod,
            specialInstructions: customerData.specialInstructions || "None",
            videoRecordingAllowed: customerData.allowVideoRecording ? "Yes" : "No",
            orderMetrics: calculateOrderMetrics(),
          },
        }

        const scriptURL =
          "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

        fetch(scriptURL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(waitlistData),
        }).catch((error) => {
          console.error("Error submitting to waitlist:", error)
        })

        if (customerData.allowVideoRecording) {
          const fullAddress = `${customerData.address}, ${customerData.city || ""}, ${customerData.state || ""} ${customerData.zipCode || ""}`
          const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`
          localStorage.setItem(addressKey, "permanent")
        }
      }

      const orderMetrics = calculateOrderMetrics()
      const checkoutUrl = await createCheckoutSession({
        lineItems,
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerData?.email,
        customerData: customerData
          ? {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              address: {
                line1: customerData.address,
                city: customerData?.city || "",
                state: customerData?.state || "",
                postal_code: customerData?.zipCode || "",
                country: "US",
              },
            }
          : undefined,
        isRecurring: false,
        discount:
          orderMetrics.discountAmount > 0
            ? {
                amount: orderMetrics.discountAmount,
                reason: "Video Recording Permission",
              }
            : undefined,
      })

      if (checkoutUrl) {
        setCheckoutSuccess(true)
        window.location.href = checkoutUrl
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

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  const totalItems = cart.totalItems

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
        aria-label="Open shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
        {showLabel && <span className="ml-2">Cart</span>}
      </Button>

      <AdvancedSidePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Your Cart"
        width="md"
        position="right"
        primaryAction={
          cart.items.length > 0
            ? {
                label: isCheckingOut ? "Processing..." : "Checkout",
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
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="flex items-center p-3">
                    {item.image && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border mr-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} {item.metadata?.frequency && `• ${item.metadata.frequency}`}
                      </p>
                      {item.metadata?.customer && (
                        <p className="mt-1 text-xs text-gray-500">
                          {item.metadata.customer.address}, {item.metadata.customer.city || ""}{" "}
                          {item.metadata.customer.state || ""} {item.metadata.customer.zipCode || ""}
                        </p>
                      )}
                      {item.metadata?.rooms && (
                        <p className="mt-1 text-xs text-gray-500">
                          Rooms:{" "}
                          {Array.isArray(item.metadata.rooms) ? item.metadata.rooms.join(", ") : item.metadata.rooms}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(cart.totalPrice)}
                  </span>
                </div>
                {videoDiscountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="text-sm">Discount</span>
                    <span className="font-medium">- {formatCurrency(videoDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Payment Method</p>
                <ToggleGroup
                  type="single"
                  value={paymentMethod}
                  onValueChange={(value: PaymentMethod) => value && handlePaymentMethodChange(value)}
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem value="card" aria-label="Select card payment">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bank" aria-label="Select bank payment">
                    <Bank className="mr-2 h-4 w-4" />
                    Bank
                  </ToggleGroupItem>
                  <ToggleGroupItem value="wallet" aria-label="Select wallet payment">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {checkoutError && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <p>{checkoutError}</p>
                </div>
              )}
            </>
          )}
        </div>
      </AdvancedSidePanel>
    </>
  )
}
