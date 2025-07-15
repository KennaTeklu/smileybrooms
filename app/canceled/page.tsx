"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CanceledPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <CardTitle className="mt-4 text-3xl font-bold text-red-700 dark:text-red-300">Order Canceled</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Your payment was not completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            It looks like your order could not be processed at this time. This might be due to an issue with your
            payment method or a cancellation during the checkout process.
          </p>
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Link href="/checkout">Try Checkout Again</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
              <Link href="/pricing">Back to Services</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you continue to experience issues, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
