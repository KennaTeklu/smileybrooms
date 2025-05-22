"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, Calendar, User, MapPin, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

interface OrderTrackingProps {
  initialOrderId?: string
  initialEmail?: string
}

export function OrderTracking({ initialOrderId = "", initialEmail = "" }: OrderTrackingProps) {
  const [orderId, setOrderId] = useState(initialOrderId)
  const [email, setEmail] = useState(initialEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { toast } = useToast()

  const handleTrackOrder = async () => {
    if (!orderId || !email) {
      toast({
        title: "Missing information",
        description: "Please enter both order ID and email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real application, you would fetch order details from your API
      // For this example, we'll simulate a successful API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock order data
      const mockOrder = {
        id: orderId,
        status: "scheduled",
        date: new Date().toLocaleDateString(),
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        customer: {
          name: "John Doe",
          email: email,
          address: "123 Main St, Anytown, CA 12345",
        },
        services: [
          {
            name: "Deep Cleaning",
            price: 199.99,
            quantity: 1,
          },
        ],
        total: 199.99,
        teamAssigned: true,
        notes: "Please call 15 minutes before arrival.",
      }

      setOrderDetails(mockOrder)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "Error",
        description: "Could not find your order. Please check your details and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Enter your order details to check status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="e.g. SMB12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleTrackOrder} disabled={isLoading}>
            {isLoading ? "Tracking..." : "Track Order"}
          </Button>
        </CardFooter>
      </Card>

      {orderDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Order #{orderDetails.id}</CardTitle>
            <CardDescription>Placed on {orderDetails.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Status</p>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Scheduled Date</p>
                <p className="text-sm text-muted-foreground">{orderDetails.scheduledDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Customer</p>
                <p className="text-sm text-muted-foreground">{orderDetails.customer.name}</p>
                <p className="text-sm text-muted-foreground">{orderDetails.customer.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Service Address</p>
                <p className="text-sm text-muted-foreground">{orderDetails.customer.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Total</p>
                <p className="text-sm">{formatCurrency(orderDetails.total)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Services</h3>
              <div className="space-y-2">
                {orderDetails.services.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p>{service.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {service.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(service.price * service.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {orderDetails.notes && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm">{orderDetails.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full bg-gray-100 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">Team Assigned</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7 mt-1">
                Our cleaning team has been assigned to your booking
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
