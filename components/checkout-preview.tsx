"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Clock, CreditCard, Home, User, CheckCircle, AlertCircle } from "lucide-react"

interface CheckoutPreviewProps {
  totalPrice: number
  serviceSummary: {
    rooms: {
      type: string
      count: number
      tier: string
    }[]
    addOns: {
      name: string
      price: number
    }[]
    reductions: {
      name: string
      discount: number
    }[]
    serviceFee: number
  }
  selectedDate?: Date
  selectedTime?: string
}

export function CheckoutPreview({ totalPrice, serviceSummary, selectedDate, selectedTime }: CheckoutPreviewProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple">("card")

  const formatDate = (date?: Date) => {
    if (!date) return "Not selected"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50">
        <CardTitle>Checkout Preview</CardTitle>
        <CardDescription>Review your service details before booking</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Summary
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" /> Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Service Details</h3>
                <div className="space-y-2">
                  {serviceSummary.rooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <Badge
                          variant={
                            room.tier === "PREMIUM"
                              ? "destructive"
                              : room.tier === "DEEP CLEAN"
                                ? "secondary"
                                : "default"
                          }
                          className="mr-2"
                        >
                          {room.tier}
                        </Badge>
                        <span>
                          {room.count} x {room.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {serviceSummary.addOns.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Add-ons</h3>
                  <div className="space-y-2">
                    {serviceSummary.addOns.map((addOn, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <span>{addOn.name}</span>
                        <span>+${addOn.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serviceSummary.reductions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Reductions</h3>
                  <div className="space-y-2">
                    {serviceSummary.reductions.map((reduction, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <span>{reduction.name}</span>
                        <span className="text-red-500">-${reduction.discount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Service Fee</span>
                  <span>${serviceSummary.serviceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-xl">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("schedule")}>
                Next: Schedule <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Selected Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-gray-600">{selectedTime || "Not selected"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Service Location</h3>
                <div className="p-4 border rounded-md">
                  <div className="flex items-start">
                    <Home className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">123 Main Street, Apt 4B</p>
                      <p className="text-sm text-gray-600">New York, NY 10001</p>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Change address
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Special Instructions</h3>
                <div className="p-4 border rounded-md">
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Add any special instructions for the cleaning team..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("summary")}>
                Back to Summary
              </Button>
              <Button onClick={() => setActiveTab("payment")}>
                Next: Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="p-4 border rounded-md">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-600">john.doe@example.com</p>
                      <p className="text-sm text-gray-600">(555) 123-4567</p>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Edit information
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Credit/Debit Card</span>
                      </div>
                      {paymentMethod === "card" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-md cursor-pointer ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-blue-600 font-bold mr-2">Pay</span>
                        <span className="text-blue-800 font-bold">Pal</span>
                      </div>
                      {paymentMethod === "paypal" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-md cursor-pointer ${paymentMethod === "apple" ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setPaymentMethod("apple")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Apple</span>
                        <span className="font-medium">Pay</span>
                      </div>
                      {paymentMethod === "apple" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Card Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <input type="text" placeholder="123" className="w-full p-2 border rounded-md" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <input type="text" placeholder="John Doe" className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border rounded-md bg-blue-50">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700">Payment will be processed after service</p>
                    <p className="text-sm text-blue-600">
                      Your card will only be charged after the cleaning service is completed to your satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("schedule")}>
                Back to Schedule
              </Button>
              <Button>Complete Booking</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <div className="text-sm text-gray-500">
          <p>Need help? Call (555) 123-4567</p>
        </div>
        <div className="font-bold">Total: ${totalPrice.toFixed(2)}</div>
      </CardFooter>
    </Card>
  )
}
