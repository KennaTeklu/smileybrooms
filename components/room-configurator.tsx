"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Plus, Minus, Clock, CheckCircle } from "lucide-react"

export interface RoomTier {
  name: string
  description: string
  price: number
  features: string[]
  timeEstimate?: string
  detailedTasks?: string[]
}

export interface RoomAddOn {
  id: string
  name: string
  price: number
  description?: string
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
  description?: string
}

export interface RoomConfiguratorProps {
  roomName: string
  roomIcon: string
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  onConfigChange: (config: RoomConfiguration) => void
  initialConfig?: RoomConfiguration
}

export interface RoomConfiguration {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
}

export function RoomConfigurator({
  roomName,
  roomIcon,
  baseTier,
  tiers,
  addOns,
  reductions,
  onConfigChange,
  initialConfig,
}: RoomConfiguratorProps) {
  const [selectedTier, setSelectedTier] = useState<string>(initialConfig?.selectedTier || baseTier.name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig?.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig?.selectedReductions || [])
  const [addOnsOpen, setAddOnsOpen] = useState(false)
  const [reductionsOpen, setReductionsOpen] = useState(false)
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set())

  // Calculate the total price based on selections
  const calculateTotalPrice = () => {
    const tierPrice = tiers.find((tier) => tier.name === selectedTier)?.price || baseTier.price
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    const reductionsTotal = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)
    return tierPrice + addOnsTotal - reductionsTotal
  }

  // Update parent component when configuration changes
  const updateConfiguration = () => {
    const totalPrice = calculateTotalPrice()
    onConfigChange({
      roomName,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      totalPrice,
    })
  }

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier)
    setTimeout(updateConfiguration, 0)
  }

  // Handle tier expansion
  const toggleTierExpansion = (tierName: string) => {
    setExpandedTiers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tierName)) {
        newSet.delete(tierName)
      } else {
        newSet.add(tierName)
      }
      return newSet
    })
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns((prev) => {
      if (checked) {
        return [...prev, addOnId]
      } else {
        return prev.filter((id) => id !== addOnId)
      }
    })
    setTimeout(updateConfiguration, 0)
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    setSelectedReductions((prev) => {
      if (checked) {
        return [...prev, reductionId]
      } else {
        return prev.filter((id) => id !== reductionId)
      }
    })
    setTimeout(updateConfiguration, 0)
  }

  // Call updateConfiguration when the component mounts
  useEffect(() => {
    updateConfiguration()
  }, [])

  const getTierBadgeColor = (tierName: string) => {
    if (tierName.includes("ESSENTIAL")) return "bg-green-100 text-green-800 border-green-200"
    if (tierName.includes("ADVANCED")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (tierName.includes("PREMIUM")) return "bg-purple-100 text-purple-800 border-purple-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getTierIcon = (tierName: string) => {
    if (tierName.includes("ESSENTIAL")) return "⚡"
    if (tierName.includes("ADVANCED")) return "🔧"
    if (tierName.includes("PREMIUM")) return "⭐"
    return "🏠"
  }

  const getTierColor = (tierName: string) => {
    if (tierName.includes("ESSENTIAL")) return "border-green-300 bg-green-50"
    if (tierName.includes("ADVANCED")) return "border-blue-300 bg-blue-50"
    if (tierName.includes("PREMIUM")) return "border-purple-300 bg-purple-50"
    return "border-gray-300 bg-gray-50"
  }

  return (
    <Card className="w-full mb-6 border-2 border-blue-100">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roomIcon}</span>
            <CardTitle>{roomName}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            ${calculateTotalPrice().toFixed(2)}
          </Badge>
        </div>
        <CardDescription>Customize your cleaning options for this room</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Tier Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">SERVICE TIERS</h3>
            <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
              {tiers.map((tier, index) => {
                const isExpanded = expandedTiers.has(tier.name)
                const isSelected = selectedTier === tier.name

                return (
                  <div
                    key={tier.name}
                    className={`rounded-lg border-2 transition-all duration-200 ${
                      isSelected ? `border-blue-500 bg-blue-50 shadow-md` : `border-gray-200 hover:border-gray-300`
                    }`}
                  >
                    {/* Main Tier Selection */}
                    <div className="p-4">
                      <div className="flex items-start">
                        <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Label htmlFor={`tier-${tier.name}`} className="font-medium text-base cursor-pointer">
                                {getTierIcon(tier.name)} {tier.name}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">{tier.description}</p>

                              {/* Quick Info Row */}
                              <div className="flex items-center gap-4 mt-2">
                                {tier.timeEstimate && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <Clock className="h-3 w-3" />
                                    {tier.timeEstimate}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  {tier.detailedTasks?.length || tier.features.length} tasks included
                                </div>
                              </div>
                            </div>

                            {/* Price and Expand Button */}
                            <div className="flex items-center gap-2">
                              <Badge className={getTierBadgeColor(tier.name)}>${tier.price}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTierExpansion(tier.name)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                                aria-label={`${isExpanded ? "Hide" : "Show"} details for ${tier.name}`}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-blue-600" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <Collapsible open={isExpanded}>
                      <CollapsibleContent>
                        <div className={`border-t border-gray-200 p-4 ${getTierColor(tier.name)}`}>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2">
                                What's Included in {tier.name}:
                              </h4>

                              {/* Detailed Task List */}
                              <div className="grid gap-1">
                                {tier.detailedTasks && tier.detailedTasks.length > 0
                                  ? tier.detailedTasks.map((task, i) => (
                                      <div key={i} className="flex items-start gap-2 text-xs">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span className="text-gray-700">{task}</span>
                                      </div>
                                    ))
                                  : tier.features.map((feature, i) => (
                                      <div key={i} className="flex items-start gap-2 text-xs">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span className="text-gray-700">{feature}</span>
                                      </div>
                                    ))}
                              </div>
                            </div>

                            {/* Summary Stats */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Total Tasks:</span>{" "}
                                {tier.detailedTasks?.length || tier.features.length}
                              </div>
                              {tier.timeEstimate && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Duration:</span> {tier.timeEstimate}
                                </div>
                              )}
                              <div className="text-xs font-medium text-gray-900">${tier.price}</div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* Add-ons Section */}
          {addOns.length > 0 && (
            <Collapsible open={addOnsOpen} onOpenChange={setAddOnsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-medium">ADD SERVICES ({selectedAddOns.length} selected)</span>
                  </div>
                  {addOnsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3 border-l-4 border-green-200 pl-4">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`addon-${addOn.id}`}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`addon-${addOn.id}`} className="font-medium">
                            {addOn.name}
                          </Label>
                          {addOn.description && <p className="text-xs text-gray-500 mt-1">{addOn.description}</p>}
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          +${addOn.price.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Reductions Section */}
          {reductions.length > 0 && (
            <Collapsible open={reductionsOpen} onOpenChange={setReductionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-600" />
                    <span className="text-red-700 font-medium">
                      REMOVE SERVICES ({selectedReductions.length} selected)
                    </span>
                  </div>
                  {reductionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3 border-l-4 border-red-200 pl-4">
                {reductions.map((reduction) => (
                  <div key={reduction.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`reduction-${reduction.id}`}
                      checked={selectedReductions.includes(reduction.id)}
                      onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`reduction-${reduction.id}`} className="font-medium">
                            {reduction.name}
                          </Label>
                          {reduction.description && (
                            <p className="text-xs text-gray-500 mt-1">{reduction.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          -${reduction.discount.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Price Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-right">
                <p className="text-sm text-gray-500">Room Total</p>
                <p className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
