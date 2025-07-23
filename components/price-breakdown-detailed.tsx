import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import type { PriceResult } from "@/lib/use-price-worker"

interface PriceBreakdownDetailedProps {
  priceResult: PriceResult | null
  isCalculating: boolean
}

export function PriceBreakdownDetailed({ priceResult, isCalculating }: PriceBreakdownDetailedProps) {
  // Group breakdown items by category
  const groupedBreakdown =
    priceResult?.breakdown.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, typeof priceResult.breakdown>,
    ) || {}

  // Categories in the order we want to display them
  const categoryOrder = ["Rooms", "Service Type", "Frequency", "Cleanliness", "Add-on", "Discount"]

  // Sort categories
  const sortedCategories = Object.keys(groupedBreakdown).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
  )

  if (isCalculating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!priceResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select rooms and options to see price details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="font-medium mb-2">{category}</h3>
              <ul className="space-y-1">
                {groupedBreakdown[category].map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span className={item.amount < 0 ? "text-green-600" : ""}>
                      {item.amount < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(item.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold">Total Price</span>
            <span className="text-xl font-bold">{formatCurrency(priceResult.finalPrice)}</span>
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            <p>
              Estimated cleaning time: {Math.floor(priceResult.estimatedDuration / 60)} hours{" "}
              {priceResult.estimatedDuration % 60} minutes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
