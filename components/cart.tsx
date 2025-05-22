"use client"

import { useState } from "react"
import { useEnhancedCart } from "@/lib/enhanced-cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

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
  const { cart, removeItem, updateQuantity, clearList, addItem } = useEnhancedCart()
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
    // Ensure quantity is a valid number and at least 1
    const validQuantity = Math.max(1, isNaN(quantity) ? 1 : Math.floor(quantity))
    updateQuantity(id, validQuantity)
  }

  const handleClearCart = () => {
    clearList("main")
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
      // Validate cart items before proceeding
      const invalidItems = cart.items.filter(
        (item) => !item.id || !item.name || typeof item.price !== "number" || item.price <= 0,
      )

      if (invalidItems.length > 0) {
        throw new Error("Some items in your cart are invalid. Please try removing and adding them again.")
      }

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
      }

      // Simulate a successful checkout
      setTimeout(() => {
        setIsCheckingOut(false)
        setCheckoutSuccess(true)
        toast({
          title: "Order placed!",
          description: "Your order has been successfully placed.",
        })
        handleClearCart() // Clear the cart after successful checkout
      }, 2000)
    } catch (error: any) {
      setIsCheckingOut(false)
      setCheckoutError(error.message || "An error occurred during checkout.")
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <div>
      {/* Cart UI - simplified for brevity */}
      {showLabel && <p>Cart Items: {cart.totalItems}</p>}
      <button onClick={() => handleAddItem({ id: "test-item", name: "Test Item", price: 10, quantity: 1 })}>
        Add Test Item
      </button>
      <button onClick={handleCheckout} disabled={isCheckingOut}>
        {isCheckingOut ? "Checking Out..." : "Checkout"}
      </button>
      {checkoutError && <p className="text-red-500">Error: {checkoutError}</p>}
      {checkoutSuccess && <p className="text-green-500">Checkout Successful!</p>}
    </div>
  )
}
