"use client"

import { SheetTrigger } from "@/components/ui/sheet"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  ExternalLink,
  CreditCard,
  Loader2,
  Info,
  PhoneCall,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import PaymentMethodSelector from "./payment-method-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
      // Ensure body scroll is not locked when cart closes
      setTimeout(() => {
        document.body.style.overflow = ""
        document.body.style.paddingRight = ""
      }, 100)
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

  const handleAddItem = (item) => {
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
      const formatCartSummary = (items) => {
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

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size={showLabel ? "default" : "icon"} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {showLabel && <span className="ml-2">Cart</span>}
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {cart.totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to your cart to see them here</p>
              <SheetClose asChild>
                <Button className="mt-6" variant="outline">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-4">
              {checkoutError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle className="flex items-center">
                    <Info className="h-4 w-4 mr-2" /> Checkout Error
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <p>{checkoutError}</p>
                    <div className="mt-2 flex items-center">
                      <p>Please call us at:</p>
                      <a href="tel:6028000605" className="flex items-center ml-2 text-primary font-medium">
                        <PhoneCall className="h-4 w-4 mr-1" />
                        602-800-0605
                      </a>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {checkoutSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-100">
                  <AlertTitle className="flex items-center text-green-800">
                    <Info className="h-4 w-4 mr-2" /> Processing your order
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    <p>You're being redirected to complete your purchase...</p>
                    <div className="mt-2 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {cart.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <div className="h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                        {item.metadata?.customer?.allowVideoRecording && (
                          <span className="text-xs text-green-600 font-medium">Includes video recording discount</span>
                        )}
                        {item.paymentFrequency && item.paymentFrequency !== "per_service" && (
                          <span className="text-xs text-blue-600 font-medium block">
                            {(() => {
                              // Get service frequency from metadata
                              const serviceFrequency = item.metadata?.frequency || "one_time"

                              // Determine if discount applies
                              let hasDiscount = false
                              let discountAmount = ""

                              if (serviceFrequency !== "one_time") {
                                const servicesPerYear = getServicesPerYearFromFrequency(serviceFrequency)

                                if (item.paymentFrequency === "monthly" && servicesPerYear > 12) {
                                  hasDiscount = true
                                  discountAmount = "5%"
                                } else if (item.paymentFrequency === "yearly" && servicesPerYear > 1) {
                                  hasDiscount = true
                                  discountAmount = "15%"
                                }
                              }

                              return hasDiscount
                                ? `${item.paymentFrequency === "monthly" ? "Monthly" : "Yearly"} payment plan (${discountAmount} discount)`
                                : `${item.paymentFrequency === "monthly" ? "Monthly" : "Yearly"} payment plan`
                            })()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Location details accordion */}
                  {item.metadata?.customer && (
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="location-details" className="border-none">
                        <AccordionTrigger className="py-2 text-sm">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> Location Details
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm space-y-1 pb-2">
                          <p>
                            <strong>Address:</strong> {item.metadata.customer.address}
                          </p>
                          <p>
                            <a
                              href={createGoogleMapsLink(item.metadata.customer.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              View on Google Maps
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </p>
                          <p>
                            <strong>Contact:</strong> {item.metadata.customer.name} | {item.metadata.customer.phone}
                          </p>
                          {item.metadata.customer.specialInstructions && (
                            <p>
                              <strong>Notes:</strong> {item.metadata.customer.specialInstructions}
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t pt-4 mt-auto">
            {/* Payment Method Selector */}
            <div className="my-4">
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              <PaymentMethodSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />
            </div>

            {/* Video Recording Discount */}
            {cart.items.some((item) => item.metadata?.customer) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
                <div className="flex items-start space-x-3">
                  {(() => {
                    // Find the first item with customer data to use for discount calculation
                    const itemsWithCustomer = cart.items.filter((item) => item.metadata?.customer)
                    const uniqueAddresses = new Set(
                      itemsWithCustomer.map((item) =>
                        item.metadata?.customer
                          ? `${item.metadata.customer.address}, ${item.metadata.customer.city || ""}, ${item.metadata.customer.state || ""} ${item.metadata.customer.zipCode || ""}`.toLowerCase()
                          : "",
                      ),
                    )
                    const addressCount = uniqueAddresses.size

                    // Get the first item for UI purposes
                    const firstItemWithCustomer = itemsWithCustomer[0]
                    const customerData = firstItemWithCustomer?.metadata?.customer
                    const baseDiscount = 50 // Base discount amount

                    // Calculate video recording discount (10% or $50 * number of addresses, whichever is higher)
                    const totalPrice = itemsWithCustomer.reduce((sum, item) => sum + item.price, 0)
                    const percentageDiscount = totalPrice * 0.1
                    const addressMultiplier = Math.max(1, addressCount)
                    const videoRecordingDiscount = Math.max(percentageDiscount, baseDiscount * addressMultiplier)

                    // Check if discount already applied for this address
                    const isDiscountApplied =
                      customerData && cart.items.some((item) => item.metadata?.customer?.allowVideoRecording)

                    // Check if discount already used for this address in localStorage
                    const fullAddress = customerData
                      ? `${customerData.address}, ${customerData.city || ""}, ${customerData.state || ""} ${customerData.zipCode || ""}`
                      : ""
                    const addressKey = `discount_applied_${fullAddress.replace(/\s+/g, "_").toLowerCase()}`
                    const isAddressDiscountedPermanently = localStorage.getItem(addressKey) === "permanent"
                    const isAddressDiscounted = localStorage.getItem(addressKey)

                    return (
                      <>
                        <Checkbox
                          id="allow-recording-cart"
                          checked={isDiscountApplied}
                          disabled={isAddressDiscountedPermanently && !isDiscountApplied}
                          onCheckedChange={(checked) => {
                            if (!customerData) return

                            // If trying to apply discount but it's already been used permanently for this address
                            if (checked && isAddressDiscountedPermanently) {
                              toast({
                                title: "Discount already applied",
                                description:
                                  "Video recording discount has already been used for this address in a previous order.",
                                variant: "warning",
                                duration: 3000,
                              })
                              return
                            }

                            // Update all items with customer data to have the same allowVideoRecording value
                            cart.items.forEach((item) => {
                              if (item.metadata?.customer) {
                                const updatedItem = {
                                  ...item,
                                  price: checked
                                    ? item.price - videoRecordingDiscount / itemsWithCustomer.length / item.quantity
                                    : item.price + videoRecordingDiscount / itemsWithCustomer.length / item.quantity,
                                  metadata: {
                                    ...item.metadata,
                                    customer: {
                                      ...item.metadata.customer,
                                      allowVideoRecording: checked === true,
                                    },
                                  },
                                }

                                // Remove and re-add the item to update it
                                removeItem(item.id)
                                handleAddItem(updatedItem)
                              }
                            })

                            // Store the address in localStorage to prevent future discounts in different orders
                            if (checked) {
                              // Just mark it as used but not permanent yet
                              localStorage.setItem(addressKey, "used")
                            }

                            toast({
                              title: checked ? "Discount applied" : "Discount removed",
                              description: checked
                                ? `Video recording discount of ${formatCurrency(videoRecordingDiscount)} applied for ${addressCount} address${addressCount > 1 ? "es" : ""}.`
                                : "Video recording discount has been removed.",
                              duration: 3000,
                            })
                          }}
                        />
                        <div>
                          <div className="flex items-center">
                            <Label htmlFor="allow-recording-cart" className="font-medium cursor-pointer">
                              Allow video recording for {formatCurrency(videoRecordingDiscount)} off
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 ml-1 text-blue-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  We may record cleaning sessions for training and social media purposes. By allowing
                                  this, you'll receive {formatCurrency(videoRecordingDiscount)} off your order.
                                  {addressCount > 1 ? ` Discount increased for ${addressCount} addresses.` : ""}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {isAddressDiscountedPermanently && !isDiscountApplied ? (
                            <p className="text-xs text-amber-600 mt-1">
                              Discount already used for this address in a previous order.
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">
                              We'll record parts of the cleaning process for our social media and training.
                            </p>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between py-2 font-medium">
              <span>Total</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout Now
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
