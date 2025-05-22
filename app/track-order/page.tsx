import { OrderTracking } from "@/components/order-tracking"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      <OrderTracking />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Our customer support team is here to assist you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you need assistance tracking your order or have any questions, please contact our support team:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> support@smilebrooms.com
              </p>
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p>
                <strong>Hours:</strong> Monday - Friday, 9am - 5pm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
