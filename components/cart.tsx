"use client"

import { useState, useMemo } from "react"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, CreditCard, Wallet, BanknoteIcon as Bank, ShoppingCart, Video, Info } from "lucide-react"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from "next/image"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"

type PaymentMethod = "card" | "bank" | "wallet"

interface CartProps {
  isOpen: boolean
  onClose?: () => void
  embedded?: boolean
}

export function Cart({ isOpen, onClose, embedded = false }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customerAddressData, setCustomerAddressData] = useState<AddressData | null>(null)

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

    // If no address data, open the address collection modal
    if (!customerAddressData) {
      setShowAddressModal(true)
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
        description: item.metadata?.description || `Service: ${item.name}`,
        images: item.image ? [item.image] : undefined,
        metadata: {
          ...item.metadata,
          paymentMethod,
          allowVideoRecording: allowVideoRecording,
          videoDiscountApplied: videoDiscountAmount,
        },
      }))

      const customerData = customerAddressData

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
          name: customerData.fullName,
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
            mapsLink: createGoogleMapsLink(customerData.address),
            paymentMethod: paymentMethod,
            specialInstructions: customerData.specialInstructions || "None",
            videoRecordingAllowed: allowVideoRecording ? "Yes" : "No",
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

        if (allowVideoRecording) {
          const fullAddress = `${customerData.address}, ${customerData.city || ""}, ${customerData.state || ""} ${customerData.zipCode || ""}`
          const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`
          localStorage.setItem(addressKey, "permanent")
        }
      }

      const orderMetrics = calculateOrderMetrics()
      const isAnyItemRecurring = customItems.some((item) => item.metadata?.isRecurring)
      const detectedRecurringInterval = customItems.find((item) => item.metadata?.recurringInterval)?.metadata
        ?.recurringInterval

      const checkoutUrl = await createCheckoutSession({
        lineItems: lineItems.length > 0 ? lineItems : undefined,
        customLineItems: customItems.length > 0 ? customItems : undefined,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerData?.email,
        customerData: customerData
          ? {
              name: customerData.fullName,
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
        isRecurring: isAnyItemRecurring,
        recurringInterval: detectedRecurringInterval,
        discount:
          orderMetrics.discountAmount > 0
            ? {
                amount: orderMetrics.discountAmount,
                reason: "Video Recording Permission",
              }
            : undefined,
        shippingAddressCollection: { allowed_countries: ["US"] },
        automaticTax: { enabled: true },
        paymentMethodTypes: [paymentMethod],
        trialPeriodDays: customItems.some((item) => item.metadata?.trialPeriodDays) ? 7 : undefined,
        cancelAtPeriodEnd: customItems.some((item) => item.metadata?.cancelAtPeriodEnd) ? true : undefined,
        allowPromotions: true,
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

  const handleAddressSubmit = (data: AddressData) => {
    setCustomerAddressData(data)
    setShowAddressModal(false)
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
          </div>

          {/* Payment Method Selection */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Payment Method</p>
            <ToggleGroup
              type="single"
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => value && handlePaymentMethodChange(value)}
              className="grid grid-cols-3 gap-2"
            >
              <ToggleGroupItem value="card" aria-label="Select card payment" className="text-xs">
                <CreditCard className="mr-1 h-3 w-3" />
                Card
              </ToggleGroupItem>
              <ToggleGroupItem value="bank" aria-label="Select bank payment" className="text-xs">
                <Bank className="mr-1 h-3 w-3" />
                Bank
              </ToggleGroupItem>
              <ToggleGroupItem value="wallet" aria-label="Select wallet payment" className="text-xs">
                <Wallet className="mr-1 h-3 w-3" />
                Wallet
              </ToggleGroupItem>
            </ToggleGroup>
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
                {isCheckingOut ? "Processing..." : customerAddressData ? "Checkout" : "Proceed to Checkout"}
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
              label: isCheckingOut ? "Processing..." : customerAddressData ? "Checkout" : "Proceed to Checkout",
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
