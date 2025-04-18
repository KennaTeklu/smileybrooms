import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function CanceledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-red-50 to-white p-4 dark:from-red-950/20 dark:to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Payment Canceled</CardTitle>
          <CardDescription className="text-base">Your payment was not completed</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-center">
              The payment process was canceled. No charges were made to your account.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Common reasons for cancellation:</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted h-5 w-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs">1</span>
                </div>
                <span>You decided not to complete the purchase</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted h-5 w-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs">2</span>
                </div>
                <span>There was an issue with your payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-muted h-5 w-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs">3</span>
                </div>
                <span>The checkout session timed out</span>
              </li>
            </ul>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm">Your cart items have been saved.</p>
            <p className="text-sm text-muted-foreground">
              You can return to checkout when you're ready to complete your purchase.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Shop
            </Link>
          </Button>

          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/contact">
                <HelpCircle className="mr-2 h-4 w-4" /> Get Help
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
