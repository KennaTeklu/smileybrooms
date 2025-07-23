"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

export interface PriceBreakdownProps {
  basePrice: number
  tierUpgrades: {
    roomName: string
    tierName: string
    price: number
  }[]
  addOns: {
    roomName: string
    name: string
    price: number
  }[]
  reductions: {
    roomName: string
    name: string
    discount: number
  }[]
  serviceFee: number
  totalPrice: number
}

export function PriceBreakdown({
  basePrice,
  tierUpgrades,
  addOns,
  reductions,
  serviceFee,
  totalPrice,
}: PriceBreakdownProps) {
  // Calculate subtotals
  const tierUpgradesTotal = tierUpgrades.reduce((sum, item) => sum + item.price, 0)
  const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0)
  const reductionsTotal = reductions.reduce((sum, item) => sum + item.discount, 0)

  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Price Breakdown</span>
          <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">Base Price (Quick Clean)</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                BASIC
              </Badge>
            </div>
            <span className="font-medium">${basePrice.toFixed(2)}</span>
          </div>

          {tierUpgrades.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Tier Upgrades</span>
                <span>+${tierUpgradesTotal.toFixed(2)}</span>
              </div>
              <div className="pl-4 space-y-1">
                {tierUpgrades.map((upgrade, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>
                      {upgrade.roomName}: {upgrade.tierName} ({upgrade.tierName === "DEEP CLEAN" ? "3x" : "9x"} Basic)
                    </span>
                    <span>+${upgrade.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {addOns.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Add-on Services</span>
                <span>+${addOnsTotal.toFixed(2)}</span>
              </div>
              <div className="pl-4 space-y-1">
                {addOns.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>
                      {addon.roomName}: {addon.name}
                    </span>
                    <span>+${addon.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reductions.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Service Reductions</span>
                <span className="text-red-500">-${reductionsTotal.toFixed(2)}</span>
              </div>
              <div className="pl-4 space-y-1">
                {reductions.map((reduction, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>
                      {reduction.roomName}: {reduction.name}
                    </span>
                    <span className="text-red-500">-${reduction.discount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm">Service Fee</span>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
            <span>${serviceFee.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span className="text-xl">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
