import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CanceledPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Payment Canceled</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Your payment was canceled. You can try again or contact support if you have any questions.
        </p>
        <div className="mt-8">
          <Link href="/" passHref>
            <Button className="w-full">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
