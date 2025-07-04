import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CanceledPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <CardTitle className="text-3xl font-bold">Payment Canceled</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Your payment was canceled. No charges have been made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            If you encountered an issue or changed your mind, you can try again or contact support.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/checkout">Try Payment Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="link" className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
