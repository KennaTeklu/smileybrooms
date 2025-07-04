"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import type { PriceBreakdownItem, PriceCalculationResult } from "@/lib/workers/price-calculator.worker"

export default function EmailSummaryPage() {
  const [summary, setSummary] = useState<PriceCalculationResult | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSummary = localStorage.getItem("serviceSummary")
      if (storedSummary) {
        setSummary(JSON.parse(storedSummary))
      }
    }
  }, [])

  if (!summary) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <Card className="max-w-md mx-auto p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">No Summary Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              It looks like you haven't completed the service calculator form yet.
            </p>
            <Button asChild>
              <Link href="/calculator">Go to Service Calculator</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Your Service Email Summary</h1>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Estimated First Service Price:</p>
            <p className="text-4xl font-bold text-primary">{formatCurrency(summary.firstServicePrice)}</p>
            {summary.frequency !== "one_time" && (
              <>
                <p className="text-lg font-semibold mt-4">Estimated Recurring Service Price:</p>
                <p className="text-3xl font-bold text-secondary">{formatCurrency(summary.recurringServicePrice)}</p>
              </>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Estimated Duration: {summary.estimatedDuration} minutes
            </p>
            {summary.enforcedTierReason && (
              <p className="text-sm text-orange-500 dark:text-orange-400 mt-2">*Note: {summary.enforcedTierReason}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Detailed Breakdown:</h3>
            {summary.breakdown.map((item: PriceBreakdownItem, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.item}
                  {item.description && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                  )}
                </span>
                <span>
                  {item.value < 0 ? "-" : ""}
                  {formatCurrency(Math.abs(item.value))}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              This summary has been sent to your email address. Please check your inbox.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild className="flex-1">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
