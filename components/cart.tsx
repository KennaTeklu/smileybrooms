"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Trash, Plus, Minus, CreditCard, Wallet, BanknoteIcon as Bank, ShoppingCart, X, ArrowRight } from "lucide-react"

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

  // This will ensure the cart stays open when other dialogs/popups are closed
  const handleOpenChange = (open: boolean) => {
    // Only process actual close requests, not side-effects from other popups
    if (!open && isOpen) {
      setIsOpen(false)
    } else if (open) {
      setIsOpen(true)
    }
  }

  // Function to create Google Maps link
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
    updateQuantity(id, quantity)
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
      duration: 3000, // Auto-dismiss after 3 seconds
    })
  }

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
      // Separate regular items from custom cleaning items
      const regularItems = cart.items.filter(
        (item) => item.priceId !== "price_custom_cleaning" && item.priceId !== "price_custom_service",
      )
      const customItems = cart.items.filter(
        (item) => item.priceId === "price_custom_cleaning" || item.priceId === "price_custom_service",
      )

      // Create line items for regular products
      const lineItems = regularItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      }))

      // Create custom line items for custom cleaning services
      const customLineItems = customItems.map((item) => ({
        name: item.name,
        amount: Math.round(item.price * 100) / 100, // Ensure proper decimal handling
        quantity: item.quantity,
        metadata: {
          ...item.metadata,
          paymentMethod,
        },
      }))

      // Get customer data from the first custom item with customer metadata
      const customerItem = customItems.find((item) => item.metadata?.customer)
      const customerData = customerItem?.metadata?.customer

      // Calculate order metrics
      const calculateOrderMetrics = () => {
        return {
          totalItems: cart.items.length,
          totalQuantity: cart.totalItems,
          averageItemPrice: cart.totalPrice / cart.totalItems,
          hasCustomService: customItems.length > 0,
          hasRecurringService: customItems.some((item) => item.metadata?.isRecurring),
          itemCategories: cart.items.map((item) => item.priceId).join(","),
          discountsApplied: customerData?.allowVideoRecording ? "video_recording" : "none",
        }
      }

      // Format cart items for better readability in spreadsheet
      const formatCartSummary = (items: any[]) => {
        return items.map((item) => `${item.name} (${formatCurrency(item.price)} x ${item.quantity})`).join("; ")
      }

      // Prepare data for waitlist API with enhanced information
      if (customerData) {
        const emoji = "🔵"

        // Enhanced data structure
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
            totalOrderValue: cart.totalPrice,
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

        // Submit to waitlist API (using Google Sheets)
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

        // Mark video recording discount as permanently used for this address
        if (customerData.allowVideoRecording) {
          const fullAddress = `${customerData.address}, ${customerData.city || ""}, ${customerData.state || ""} ${customerData.zipCode || ""}`
          const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`
          localStorage.setItem(addressKey, "permanent")
        }
      }

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
      })

      if (checkoutUrl) {
        setCheckoutSuccess(true)
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      setCheckoutError("An error occurred during checkout. Please try again or call us for assistance.")
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Payment method selection
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  // Calculate total items and price
  const totalItems = cart.totalItems
  const totalPrice = cart.totalPrice

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
          {showLabel && <span className="ml-2">Cart</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] overflow-y-auto">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Your Cart</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add items to get started</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
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
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 rounded-lg border bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-medium">Payment Method</p>
                <div className="flex space-x-2">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === "bank" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePaymentMethodChange("bank")}
                  >
                    <Bank className="mr-2 h-4 w-4" />
                    Bank
                  </Button>
                  <Button
                    variant={paymentMethod === "wallet" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePaymentMethodChange("wallet")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Button>
                </div>
              </div>

              {checkoutError && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  <p>{checkoutError}</p>
                </div>
              )}
            </>
          )}
        </div>

        <DrawerFooter className="border-t">
          <Button onClick={handleCheckout} disabled={cart.items.length === 0 || isCheckingOut} className="w-full">
            {isCheckingOut ? "Processing..." : "Checkout"} {!isCheckingOut && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
          {cart.items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
