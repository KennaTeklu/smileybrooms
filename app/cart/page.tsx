"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  ArrowLeft,
  Trash2,
} from "lucide-react"
import { CartItemDisplay } from "@/components/cart/cart-item-display"
import { ApplicationSidepanel } from "@/components/cart/application-sidepanel"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import type { CheckoutData } from "@/lib/types"
import { logCartProceedToCheckout, logCartReviewPayNowClick } from "@/lib/google-sheet-logger"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeItem, updateQuantity, clearCart } = useCart()
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [completedApplicationData, setCompletedApplicationData] = useState<CheckoutData | null>(null)
  const [isItemsExpanded, setIsItemsExpanded] = useState(false)
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [itemsToDeleteBulk, setItemsToDeleteBulk] = useState<Array<{ id: string; name: string }>>([])

  // Selection handlers
  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cart.items.map((item) => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const isAllSelected = cart.items.length > 0 && selectedItems.size === cart.items.length
  const isPartiallySelected = selectedItems.size > 0 && selectedItems.size < cart.items.length

  // Remove handlers
  const handleRemoveItem = (itemId: string, itemName: string) => {
    setItemToDelete({ id: itemId, name: itemName })
  }

  const handleRemoveSelected = () => {
    const itemsToRemove = cart.items
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({ id: item.id, name: item.name }))

    if (itemsToRemove.length > 0) {
      setItemsToDeleteBulk(itemsToRemove)
    }
  }

  const confirmRemoveItem = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.id)
      setItemToDelete(null)
      // Remove from selection if it was selected
      const newSelected = new Set(selectedItems)
      newSelected.delete(itemToDelete.id)
      setSelectedItems(newSelected)
    }
  }

  const confirmRemoveSelected = () => {
    itemsToDeleteBulk.forEach((item) => {
      removeItem(item.id)
    })
    setItemsToDeleteBulk([])
    setSelectedItems(new Set()) // Clear selection after bulk delete
  }

  const cancelRemoveItem = () => {
    setItemToDelete(null)
  }

  const cancelRemoveSelected = () => {
    setItemsToDeleteBulk([])
  }

  const handleUpdateQuantity = (itemId: string, change: number) => {
    const item = cart.items.find((item) => item.id === itemId)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity <= 0) {
        removeItem(itemId)
        // Remove from selection if it was selected
        const newSelected = new Set(selectedItems)
        newSelected.delete(itemId)
        setSelectedItems(newSelected)
      } else {
        updateQuantity(itemId, newQuantity)
      }
    }
  }

  const handleApplicationComplete = (checkoutData: CheckoutData) => {
    setCompletedApplicationData(checkoutData)
    setIsApplicationOpen(false)
    localStorage.setItem("completedCheckoutData", JSON.stringify(checkoutData))
  }

  const handleProceedToApplication = () => {
    if (completedApplicationData) {
      logCartReviewPayNowClick({
        checkoutData: completedApplicationData,
        cartItems: cart.items,
        subtotalPrice: cart.subtotalPrice,
        couponDiscount: cart.couponDiscount,
        fullHouseDiscount: cart.fullHouseDiscount,
        totalPrice: cart.totalPrice,
      })
      console.log("Processing payment...", { cartItems: cart.items, checkoutData: completedApplicationData })
      router.push("/success")
    } else {
      logCartProceedToCheckout({
        checkoutData: {
          contact: { firstName: "", lastName: "", email: "", phone: "" },
          address: {
            address: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            specialInstructions: "",
            addressType: "residential",
          },
          payment: { paymentMethod: "card", allowVideoRecording: false, agreeToTerms: false },
        },
        cartItems: cart.items,
        subtotalPrice: cart.subtotalPrice,
        couponDiscount: cart.couponDiscount,
        fullHouseDiscount: cart.fullHouseDiscount,
        totalPrice: cart.totalPrice,
      })
      setIsApplicationOpen(true)
    }
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08
  }

  const tax = calculateTax(cart.subtotalPrice)
  const total = cart.totalPrice + tax

  if (cart.items.length === 0 && !completedApplicationData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No services selected</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some services to get started with your cleaning service application.
          </p>
          <Link href="/">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!completedApplicationData && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Service Application</h1>
          <p className="text-gray-600 dark:text-gray-400">Review your selected services and submit your application</p>
        </div>
      )}

      {completedApplicationData && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review Your Application</h1>
          <p className="text-gray-600 dark:text-gray-400">Please review your application details before submitting</p>
        </div>
      )}

      <div className={`grid gap-8 ${completedApplicationData ? "grid-cols-1" : "lg:grid-cols-3"}`}>
        {!completedApplicationData && (
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Selected Services ({cart.items.length})
                  </CardTitle>

                  {cart.items.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="select-all"
                          checked={isAllSelected}
                          ref={(ref) => {
                            if (ref) {
                              ref.indeterminate = isPartiallySelected
                            }
                          }}
                          onCheckedChange={handleSelectAll}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer select-none">
                          Select All
                        </label>
                      </div>

                      {selectedItems.size > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveSelected}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Selected ({selectedItems.size})
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {selectedItems.size > 0 && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    {selectedItems.size} of {cart.items.length} services selected
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`select-${item.id}`}
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      className="mt-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="flex-1">
                      <CartItemDisplay
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        isSelected={selectedItems.has(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <div
          className={`${completedApplicationData ? "w-full max-w-4xl mx-auto" : "lg:col-span-1"} flex flex-col gap-8`}
        >
          {!completedApplicationData ? (
            <Card className="shadow-lg border-gray-200 dark:border-gray-700 p-6 text-center flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Ready to submit! Let's get your details ✨
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-sm">
                We'll need your contact info and service address to process your application
              </p>

              <div className="flex flex-col gap-3 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    1
                  </div>
                  <span>Application Details</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium text-gray-400">
                    2
                  </div>
                  <span>Submit Application</span>
                </div>
              </div>

              <Button onClick={handleProceedToApplication} className="w-full mb-4" size="lg">
                <User className="mr-2 h-5 w-5" />
                Begin Application
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Takes 2 minutes • SSL secured</span>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg border-gray-200 dark:border-gray-700">
                <Collapsible open={isItemsExpanded} onOpenChange={setIsItemsExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5" />
                          Requested Services ({cart.items.length})
                        </div>
                        {isItemsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      {cart.items.map((item) => (
                        <CartItemDisplay
                          key={item.id}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemoveItem={handleRemoveItem}
                        />
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <Card className="shadow-lg border-gray-200 dark:border-gray-700">
                <Collapsible open={isCustomerExpanded} onOpenChange={setIsCustomerExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Applicant Information
                        </div>
                        {isCustomerExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Contact Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <p className="font-medium">
                              {completedApplicationData.contact.firstName} {completedApplicationData.contact.lastName}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {completedApplicationData.contact.email}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {completedApplicationData.contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Service Address
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">{completedApplicationData.address.address}</p>
                          {completedApplicationData.address.address2 && (
                            <p className="text-gray-600 dark:text-gray-400">
                              Unit: {completedApplicationData.address.address2}
                            </p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400">
                            {completedApplicationData.address.city}, {completedApplicationData.address.state}{" "}
                            {completedApplicationData.address.zipCode}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Payment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                            <p className="font-medium flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {completedApplicationData.payment.paymentMethod}
                            </p>
                          </div>
                          {completedApplicationData.payment.allowVideoRecording && (
                            <div>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Live Video Included
                              </Badge>
                            </div>
                          )}
                        </div>
                        {completedApplicationData.address.specialInstructions && (
                          <div className="mt-4">
                            <span className="text-gray-600 dark:text-gray-400">Special Instructions:</span>
                            <p className="font-medium mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                              {completedApplicationData.address.specialInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          <Card className="shadow-lg border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${cart.subtotalPrice.toFixed(2)}</span>
              </div>

              {cart.couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>-${cart.couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {cart.fullHouseDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Full House Discount (5%)</span>
                  <span>-${cart.fullHouseDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              {cart.inPersonPaymentTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pay in Person</span>
                  <span className="font-medium">${cart.inPersonPaymentTotal.toFixed(2)}</span>
                </div>
              )}

              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Estimated Total</span>
                <span>${(cart.totalPrice + tax).toFixed(2)}</span>
              </div>

              <Button onClick={handleProceedToApplication} className="w-full mt-6" size="lg">
                {completedApplicationData ? "Submit Application" : "Submit Application"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
                <Shield className="h-4 w-4" />
                <span>Secure application with SSL encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ApplicationSidepanel
        isOpen={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
        onCheckoutComplete={handleApplicationComplete}
      />

      {/* Single item delete confirmation */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && cancelRemoveItem()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToDelete?.name}" from your cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveItem}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveItem} className="bg-red-600 hover:bg-red-700">
              Remove Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirmation */}
      <AlertDialog open={itemsToDeleteBulk.length > 0} onOpenChange={(open) => !open && cancelRemoveSelected()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Selected Services</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {itemsToDeleteBulk.length} selected service
              {itemsToDeleteBulk.length > 1 ? "s" : ""} from your cart?
              <div className="mt-2 text-sm">
                <strong>Services to be removed:</strong>
                <ul className="list-disc list-inside mt-1 max-h-32 overflow-y-auto">
                  {itemsToDeleteBulk.map((item, index) => (
                    <li key={index}>{item.name}</li>
                  ))}
                </ul>
              </div>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveSelected}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveSelected} className="bg-red-600 hover:bg-red-700">
              Remove {itemsToDeleteBulk.length} Service{itemsToDeleteBulk.length > 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
