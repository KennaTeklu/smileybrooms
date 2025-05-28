"use client"

import { useState, useRef, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions"
import { formatCurrency, cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Trash,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  ShoppingCart,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Package,
  MapPin,
  Shield,
  Zap,
  Calculator,
} from "lucide-react"

type PaymentMethod = "card" | "bank" | "wallet"

interface CartProps {
  showLabel?: boolean
}

export function Cart({ showLabel = false }: CartProps) {
  const { cart, removeItem, updateQuantity, clearCart } = useCart()

  // Panel state management (like customization panel)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("items")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  // Scroll management (from customization panel)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [tabScrollPositions, setTabScrollPositions] = useState<Record<string, number>>({})

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    items: true,
    summary: true,
    payment: false,
    shipping: false,
    promos: false,
  })

  // Real-time calculations
  const subtotal = cart.totalPrice
  const tax = subtotal * 0.08875 // NY tax rate
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  // Scroll management functions (from customization panel)
  const updateScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      setScrollPosition(scrollTop)
      setMaxScroll(scrollHeight - clientHeight)
      setShowScrollButtons(scrollHeight > clientHeight)
    }
  }

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  // Tab change with scroll position preservation
  const handleTabChange = (value: string) => {
    if (scrollContainerRef.current) {
      setTabScrollPositions((prev) => ({
        ...prev,
        [activeTab]: scrollContainerRef.current?.scrollTop || 0,
      }))
    }

    setActiveTab(value)

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = tabScrollPositions[value] || 0
      }
    }, 50)
  }

  // Panel lifecycle management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollPosition)
      updateScrollPosition()
      return () => scrollContainer.removeEventListener("scroll", updateScrollPosition)
    }
  }, [isOpen])

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      // Existing checkout logic...
      const checkoutUrl = await createCheckoutSession({
        lineItems: cart.items.map((item) => ({
          price: item.priceId,
          quantity: item.quantity,
        })),
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {cart.totalItems}
          </Badge>
        )}
        {showLabel && <span className="ml-2">Cart</span>}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Enhanced Cart Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          "w-full sm:w-[480px] lg:w-[520px] xl:w-[600px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 id="cart-title" className="text-xl font-semibold">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-500">
                    {cart.totalItems} items • {formatCurrency(total)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Items
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="checkout" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Checkout
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area - Scrollable */}
          <main className="flex-1 min-h-0 relative">
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto px-6 py-4"
              style={{ scrollBehavior: "smooth" }}
            >
              <Tabs value={activeTab} className="space-y-6">
                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4 mt-0">
                  {cart.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 text-center">Add items to get started with your order</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {item.image && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.price)} each</p>
                                {item.metadata?.frequency && (
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    {item.metadata.frequency}
                                  </Badge>
                                )}
                                {item.metadata?.customer?.address && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{item.metadata.customer.address}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 h-auto p-1"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal ({cart.totalItems} items)</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <span>Shipping</span>
                            {shipping === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                FREE
                              </Badge>
                            )}
                          </div>
                          <span>{formatCurrency(shipping)}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Collapsible Sections */}
                  <Collapsible open={expandedSections.promos} onOpenChange={() => toggleSection("promos")}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50">
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Promo Codes
                            </div>
                            {expandedSections.promos ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter promo code"
                              className="flex-1 px-3 py-2 border rounded-md text-sm"
                            />
                            <Button size="sm">Apply</Button>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>

                {/* Checkout Tab */}
                <TabsContent value="checkout" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPaymentMethod("card")}
                          className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span className="text-xs">Card</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "bank" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPaymentMethod("bank")}
                          className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                          <Bank className="h-4 w-4" />
                          <span className="text-xs">Bank</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "wallet" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPaymentMethod("wallet")}
                          className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                          <Wallet className="h-4 w-4" />
                          <span className="text-xs">Wallet</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>SSL encrypted checkout</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>PCI compliant payment processing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Money-back guarantee</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Scroll Controls */}
            {showScrollButtons && (
              <div className="absolute right-4 bottom-20 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={scrollToBottom}
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>

          {/* Footer - Fixed */}
          <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total: {formatCurrency(total)}</span>
                <Badge variant="outline" className="text-xs">
                  {cart.totalItems} items
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0 || isCheckingOut}
                  className="flex-1"
                  size="lg"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {cart.items.length > 0 && (
                  <Button variant="outline" onClick={clearCart} size="lg" className="px-4">
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
