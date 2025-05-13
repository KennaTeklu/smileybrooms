import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import { PageViewTracker } from "@/components/page-view-tracker"

export default function CanceledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <PageViewTracker pageName="payment-canceled" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle>Payment Canceled</CardTitle>
          <CardDescription>Your payment was not completed</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>The payment process was canceled. No charges were made.</p>
          <p className="mt-2">If you experienced any issues, please try again or contact our support team.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/services">
              <ShoppingCart className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
          <Button asChild className="mt-4">
            <Link href="/pricing">Book a new service</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
