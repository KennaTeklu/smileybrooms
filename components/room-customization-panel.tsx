"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Settings, Info, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RoomTier, RoomAddOn, RoomReduction } from "@/components/room-configurator"

interface RoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  roomIcon: string
  roomCount: number
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  onConfigChange: (config: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    totalPrice: number
  }) => void
}

export function RoomCustomizationPanel({
  isOpen,
  onClose,
  roomName,
  roomIcon,
  roomCount,
  baseTier,
  tiers,
  addOns,
  reductions,
  selectedTier,
  selectedAddOns,
  selectedReductions,
  onConfigChange,
}: RoomCustomizationPanelProps) {
  const [localSelectedTier, setLocalSelectedTier] = useState(selectedTier)
  const [localSelectedAddOns, setLocalSelectedAddOns] = useState<string[]>(selectedAddOns)
  const [localSelectedReductions, setLocalSelectedReductions] = useState<string[]>(selectedReductions)
  const [expandedSections, setExpandedSections] = useState({
    tiers: true,
    addOns: false,
    reductions: false,
  })

  // Calculate the total price based on selections
  const calculateTotalPrice = () => {
    const tierPrice = tiers.find((tier) => tier.name === localSelectedTier)?.price || baseTier.price
    const addOnsTotal = localSelectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    const reductionsTotal = localSelectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)
    return tierPrice + addOnsTotal - reductionsTotal
  }

  // Update parent component when configuration changes
  const updateConfiguration = () => {
    const totalPrice = calculateTotalPrice()
    onConfigChange({
      selectedTier: localSelectedTier,
      selectedAddOns: localSelectedAddOns,
      selectedReductions: localSelectedReductions,
      totalPrice,
    })
  }

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setLocalSelectedTier(tier)
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setLocalSelectedAddOns((prev) => {
      if (checked) {
        return [...prev, addOnId]
      } else {
        return prev.filter((id) => id !== addOnId)
      }
    })
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    setLocalSelectedReductions((prev) => {
      if (checked) {
        return [...prev, reductionId]
      } else {
        return prev.filter((id) => id !== reductionId)
      }
    })
  }

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Update configuration when local state changes
  useEffect(() => {
    updateConfiguration()
  }, [localSelectedTier, localSelectedAddOns, localSelectedReductions])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          "w-full sm:w-[480px] lg:w-[520px] xl:w-[600px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{roomIcon}</span>
              <div>
                <h2 className="text-xl font-bold">{roomName}</h2>
                <p className="text-sm text-gray-600">
                  {roomCount} {roomCount === 1 ? "room" : "rooms"} selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                ${calculateTotalPrice().toFixed(2)}
              </Badge>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Service Tiers Section */}
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleSection("tiers")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Service Tiers</CardTitle>
                    </div>
                    {expandedSections.tiers ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                  <CardDescription>Choose your cleaning intensity level</CardDescription>
                </CardHeader>
                {expandedSections.tiers && (
                  <CardContent>
                    <RadioGroup value={localSelectedTier} onValueChange={handleTierChange} className="space-y-3">
                      {tiers.map((tier, index) => (
                        <div
                          key={tier.name}
                          className={cn(
                            "p-3 rounded-lg border transition-colors",
                            localSelectedTier === tier.name ? "border-blue-500 bg-blue-50" : "border-gray-200",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <Label htmlFor={`tier-${tier.name}`} className="font-medium">
                                  {tier.name}
                                </Label>
                                <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}>
                                  ${tier.price}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                              <div className="space-y-1">
                                {tier.features.slice(0, 3).map((feature, i) => (
                                  <div key={i} className="text-xs flex items-start">
                                    <span className="text-green-500 mr-1">✓</span>
                                    <span>{feature}</span>
                                  </div>
                                ))}
                                {tier.features.length > 3 && (
                                  <div className="text-xs text-gray-500">+{tier.features.length - 3} more features</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                )}
              </Card>

              {/* Add-ons Section */}
              {addOns.length > 0 && (
                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => toggleSection("addOns")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-xs font-bold">+</span>
                        </div>
                        <CardTitle className="text-lg">Additional Services</CardTitle>
                      </div>
                      {expandedSections.addOns ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                    <CardDescription>Enhance your cleaning service</CardDescription>
                  </CardHeader>
                  {expandedSections.addOns && (
                    <CardContent>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={`addon-${addOn.id}`}
                              checked={localSelectedAddOns.includes(addOn.id)}
                              onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <Label htmlFor={`addon-${addOn.id}`} className="font-medium">
                                  {addOn.name}
                                </Label>
                                <Badge variant="outline" className="text-green-600">
                                  +${addOn.price.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Reductions Section */}
              {reductions.length > 0 && (
                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => toggleSection("reductions")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600 text-xs font-bold">-</span>
                        </div>
                        <CardTitle className="text-lg">Service Reductions</CardTitle>
                      </div>
                      {expandedSections.reductions ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                    <CardDescription>Remove services you don't need</CardDescription>
                  </CardHeader>
                  {expandedSections.reductions && (
                    <CardContent>
                      <div className="space-y-3">
                        {reductions.map((reduction) => (
                          <div key={reduction.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={`reduction-${reduction.id}`}
                              checked={localSelectedReductions.includes(reduction.id)}
                              onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <Label htmlFor={`reduction-${reduction.id}`} className="font-medium">
                                  {reduction.name}
                                </Label>
                                <Badge variant="outline" className="text-red-600">
                                  -${reduction.discount.toFixed(2)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Price Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Base Service:</span>
                      <span>${tiers.find((t) => t.name === localSelectedTier)?.price.toFixed(2)}</span>
                    </div>
                    {localSelectedAddOns.length > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Add-ons:</span>
                        <span>
                          +$
                          {localSelectedAddOns
                            .reduce((total, addOnId) => {
                              const addOn = addOns.find((a) => a.id === addOnId)
                              return total + (addOn?.price || 0)
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    )}
                    {localSelectedReductions.length > 0 && (
                      <div className="flex justify-between items-center text-red-600">
                        <span>Reductions:</span>
                        <span>
                          -$
                          {localSelectedReductions
                            .reduce((total, reductionId) => {
                              const reduction = reductions.find((r) => r.id === reductionId)
                              return total + (reduction?.discount || 0)
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total per Room:</span>
                      <span>${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        Total for {roomCount} {roomCount === 1 ? "room" : "rooms"}:
                      </span>
                      <span>${(calculateTotalPrice() * roomCount).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Section */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800 mb-1">Customization Tips:</p>
                      <ul className="text-amber-700 space-y-1">
                        <li>• Higher tiers include all lower-tier services</li>
                        <li>• Add-ons are applied to each room individually</li>
                        <li>• Reductions help customize service to your needs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onClose} className="flex-1">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
