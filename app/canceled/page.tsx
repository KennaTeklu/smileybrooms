import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CanceledPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="bg-red-500 text-white rounded-t-lg py-6">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <CardTitle className="text-3xl font-bold">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Your payment was canceled. No charges have been made.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/pricing" passHref>
              <Button className="w-full py-3 text-lg">Try Again</Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="outline" className="w-full py-3 text-lg bg-transparent">
                Contact Support
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="link" className="w-full text-md">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
