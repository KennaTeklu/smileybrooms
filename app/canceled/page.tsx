import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CanceledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
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
          <p className="mt-2">If you experienced any issues, please try again or contact support.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Checkout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
