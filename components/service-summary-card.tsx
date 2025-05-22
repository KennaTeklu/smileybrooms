"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react"

interface TierUpgrade {
  roomName: string
  tierName: string
  price: number
  multiplier?: number
}

interface AddOn {
  roomName: string
  name: string
  price: number
}

interface Reduction {
  roomName: string
  name: string
  discount: number
}

interface ServiceSummaryCardProps {
  basePrice: number
  tierUpgrades: TierUpgrade[]
  addOns: AddOn[]
  reductions: Reduction[]
  serviceFee: number
  frequencyDiscount: number
  totalPrice: number
  onAddToCart?: () => void
  hasItems: boolean
  serviceName?: string
  frequency?: string
  roomConfigurations?: Array<{
    roomName: string
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
  }>
}

export function ServiceSummaryCard({
  basePrice = 0,
  tierUpgrades = [],
  addOns = [],
  reductions = [],
  serviceFee = 0,
  frequencyDiscount = 0,
  totalPrice = 0,
  onAddToCart,
  hasItems = false,
  serviceName = "Cleaning Service",
  frequency = "one_time",
  roomConfigurations = [],
}: ServiceSummaryCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isIncludedOpen, setIsIncludedOpen] = useState(false)

  // Calculate subtotal before discount using the passed values
  const tierUpgradesTotal = tierUpgrades.reduce((sum, item) => sum + (item.price || 0), 0)
  const addOnsTotal = addOns.reduce((sum, item) => sum + (item.price || 0), 0)
  const reductionsTotal = reductions.reduce((sum, item) => sum + (item.discount || 0), 0)

  const subtotal = (basePrice || 0) + tierUpgradesTotal + addOnsTotal - reductionsTotal + (serviceFee || 0)

  // Calculate discount amount
  const discountAmount = subtotal * ((frequencyDiscount || 0) / 100)

  // Get what's included based on selected tiers
  const getWhatsIncluded = () => {
    const inclusions: string[] = []
    const tierLevels = new Set<string>()

    // Collect all tier levels selected
    roomConfigurations.forEach((config) => {
      tierLevels.add(config.selectedTier)
    })

    // Essential Clean inclusions (always included if any rooms selected)
    if (hasItems) {
      inclusions.push("Dusting of visible surfaces")
      inclusions.push("Vacuuming and mopping floors")
      inclusions.push("Emptying trash bins")
      inclusions.push("Basic surface cleaning")
      inclusions.push("Professional cleaning supplies")
    }

    // Advanced Clean inclusions
    if (tierLevels.has("ADVANCED CLEAN")) {
      inclusions.push("Deep cleaning of hard-to-reach areas")
      inclusions.push("Detailed baseboards and window sills")
      inclusions.push("Light fixture cleaning")
      inclusions.push("Under furniture cleaning")
      inclusions.push("Cabinet exterior cleaning")
    }

    // Premium Clean inclusions
    if (tierLevels.has("PREMIUM CLEAN")) {
      inclusions.push("Complete top-to-bottom cleaning")
      inclusions.push("Inside closets and storage areas")
      inclusions.push("Behind and under all furniture")
      inclusions.push("Wall spot cleaning and marks removal")
      inclusions.push("Ceiling fan detailed cleaning")
      inclusions.push("Interior cabinet organization")
    }

    // Add-on specific inclusions
    if (addOns.length > 0) {
      inclusions.push("Specialized add-on services as selected")
    }

    // Service guarantees (always included)
    if (hasItems) {
      inclusions.push("Trained and insured cleaning professionals")
      inclusions.push("Quality guarantee and satisfaction promise")
      inclusions.push("Customer support and service coordination")
    }

    return inclusions
  }

  // Get tier-specific room details
  const getTierDetails = () => {
    const details: Array<{ roomName: string; tier: string; features: string[] }> = []

    roomConfigurations.forEach((config) => {
      const features: string[] = []

      switch (config.selectedTier) {
        case "ESSENTIAL CLEAN":
          features.push("Basic surface cleaning", "Floor care", "Trash removal")
          break
        case "ADVANCED CLEAN":
          features.push("Everything in Essential", "Deep cleaning", "Hard-to-reach areas", "Detailed surfaces")
          break
        case "PREMIUM CLEAN":
          features.push("Everything in Advanced", "Complete deep clean", "Interior spaces", "Wall cleaning")
          break
      }

      details.push({
        roomName: config.roomName,
        tier: config.selectedTier,
        features,
      })
    })

    return details
  }

  const handleAddToCart = () => {
    if (!hasItems) {
      return
    }

    setIsLoading(true)

    if (onAddToCart) {
      onAddToCart()
    }

    setIsLoading(false)
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  const whatsIncluded = getWhatsIncluded()
  const tierDetails = getTierDetails()

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
        <CardTitle>Service Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {basePrice > 0 && (
            <div className="flex justify-between">
              <span>Base Price (Essential Clean)</span>
              <span>{formatCurrency(basePrice)}</span>
            </div>
          )}

          {tierUpgrades.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Tier Upgrades:</div>
              {tierUpgrades.map((upgrade, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {upgrade.roomName} ({upgrade.tierName})
                    {upgrade.multiplier && upgrade.multiplier > 1 && ` (${upgrade.multiplier}x)`}
                  </span>
                  <span>+{formatCurrency(upgrade.price || 0)}</span>
                </div>
              ))}
            </>
          )}

          {addOns.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Add-ons:</div>
              {addOns.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {addon.roomName} ({addon.name})
                  </span>
                  <span>+{formatCurrency(addon.price || 0)}</span>
                </div>
              ))}
            </>
          )}

          {reductions.length > 0 && (
            <>
              <div className="text-sm font-medium mt-2">Reductions:</div>
              {reductions.map((reduction, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>
                    {reduction.roomName} (No {reduction.name})
                  </span>
                  <span>-{formatCurrency(reduction.discount || 0)}</span>
                </div>
              ))}
            </>
          )}

          {serviceFee > 0 && (
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
          )}

          {frequencyDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Frequency Discount ({frequencyDiscount}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="mt-4">
            <Collapsible open={isIncludedOpen} onOpenChange={setIsIncludedOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-left bg-gray-50 dark:bg-gray-800/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  What's Included ({whatsIncluded.length} services)
                </span>
                {isIncludedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="space-y-4">
                  {/* General Inclusions */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Inclusions:</div>
                    <div className="space-y-1">
                      {whatsIncluded.map((inclusion, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room-Specific Details */}
                  {tierDetails.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Room-Specific Services:
                      </div>
                      <div className="space-y-2">
                        {tierDetails.map((detail, index) => (
                          <div key={index} className="pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                              {detail.roomName.replace(/([A-Z])/g, " $1").trim()} - {detail.tier}
                            </div>
                            <div className="space-y-1 mt-1">
                              {detail.features.map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-500"
                                >
                                  <CheckCircle className="h-2.5 w-2.5 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(totalPrice || 0)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full py-6 text-lg" size="lg" onClick={handleAddToCart} disabled={isLoading || !hasItems}>
          {isLoading ? "Adding..." : hasItems ? "Add to Cart" : "No Services Selected"}
          {!isLoading && hasItems && <Plus className="ml-2 h-4 w-4" />}
        </Button>
        <Button variant="outline" className="w-full" onClick={handleViewCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
