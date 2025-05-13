import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your cleaning service has been scheduled.</p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="font-semibold mb-2">Order Details</h2>
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your email address with all the details of your booking.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
