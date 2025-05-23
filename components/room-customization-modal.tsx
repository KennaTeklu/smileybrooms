"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sparkles, Plus, Minus, Settings } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"

interface RoomCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  roomIcon: string
  roomType: string
  initialConfig?: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    matrixAddServices: string[]
    matrixRemoveServices: string[]
  }
  onSave: (config: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    matrixAddServices: string[]
    matrixRemoveServices: string[]
    totalPrice: number
  }) => void
}

export function RoomCustomizationModal({
  isOpen,
  onClose,
  roomName,
  roomIcon,
  roomType,
  initialConfig,
  onSave,
}: RoomCustomizationModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Get room data
  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)
  const reductions = getRoomReductions(roomType)
  const matrixServices = getMatrixServices(roomType)

  // State for selections
  const [selectedTier, setSelectedTier] = useState(initialConfig?.selectedTier || tiers[0].name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig?.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig?.selectedReductions || [])
  const [matrixAddServices, setMatrixAddServices] = useState<string[]>(initialConfig?.matrixAddServices || [])
  const [matrixRemoveServices, setMatrixRemoveServices] = useState<string[]>(initialConfig?.matrixRemoveServices || [])

  // Calculate total price
  const calculateTotalPrice = () => {
    // Base tier price
    const tierPrice = tiers.find((tier) => tier.name === selectedTier)?.price || 0

    // Add-ons price
    const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Reductions discount
    const reductionsDiscount = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    // Matrix add services price
    const matrixAddPrice = matrixAddServices.reduce((total, serviceId) => {
      const service = matrixServices.add.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    // Matrix remove services discount
    const matrixRemoveDiscount = matrixRemoveServices.reduce((total, serviceId) => {
      const service = matrixServices.remove.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    return tierPrice + addOnsPrice + matrixAddPrice - reductionsDiscount - matrixRemoveDiscount
  }

  // Handle save
  const handleSave = () => {
    onSave({
      selectedTier,
      selectedAddOns,
      selectedReductions,
      matrixAddServices,
      matrixRemoveServices,
      totalPrice: calculateTotalPrice(),
    })
    onClose()
  }

  // Handle cancel
  const handleCancel = () => {
    // Reset to initial values
    setSelectedTier(initialConfig?.selectedTier || tiers[0].name)
    setSelectedAddOns(initialConfig?.selectedAddOns || [])
    setSelectedReductions(initialConfig?.selectedReductions || [])
    setMatrixAddServices(initialConfig?.matrixAddServices || [])
    setMatrixRemoveServices(initialConfig?.matrixRemoveServices || [])
    onClose()
  }

  // Handle add-on toggle
  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddOns((prev) => [...prev, addOnId])
    } else {
      setSelectedAddOns((prev) => prev.filter((id) => id !== addOnId))
    }
  }

  // Handle reduction toggle
  const handleReductionToggle = (reductionId: string, checked: boolean) => {
    if (checked) {
      setSelectedReductions((prev) => [...prev, reductionId])
    } else {
      setSelectedReductions((prev) => prev.filter((id) => id !== reductionId))
    }
  }

  // Handle matrix service toggle
  const handleMatrixServiceToggle = (serviceId: string, type: "add" | "remove", checked: boolean) => {
    if (type === "add") {
      if (checked) {
        setMatrixAddServices((prev) => [...prev, serviceId])
      } else {
        setMatrixAddServices((prev) => prev.filter((id) => id !== serviceId))
      }
    } else {
      if (checked) {
        setMatrixRemoveServices((prev) => [...prev, serviceId])
      } else {
        setMatrixRemoveServices((prev) => prev.filter((id) => id !== serviceId))
      }
    }
  }

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{roomIcon}</span>
          <div>
            <h3 className="text-lg font-semibold">{roomName}</h3>
            <p className="text-sm text-gray-500">Customize your cleaning options</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg font-semibold">
          ${calculateTotalPrice().toFixed(2)}
        </Badge>
      </div>

      <Separator />

      {/* Customization Options */}
      <Accordion type="multiple" defaultValue={["cleaning-level"]} className="w-full">
        {/* Cleaning Level */}
        <AccordionItem value="cleaning-level">
          <AccordionTrigger className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Cleaning Level
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="space-y-3">
              {tiers.map((tier, index) => (
                <div
                  key={tier.name}
                  className={`p-4 rounded-lg border ${
                    selectedTier === tier.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                    <div className="ml-3 w-full">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`tier-${tier.name}`} className="font-medium text-base">
                          {tier.name}
                        </Label>
                        <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}>
                          ${tier.price}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                      <ul className="mt-2 space-y-1">
                        {tier.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                        {tier.features.length > 3 && (
                          <li className="text-sm text-gray-400">+{tier.features.length - 3} more features</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Add Services */}
        {(addOns.length > 0 || matrixServices.add.length > 0) && (
          <AccordionItem value="add-services">
            <AccordionTrigger className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Services
                {(selectedAddOns.length > 0 || matrixAddServices.length > 0) && (
                  <Badge variant="outline" className="ml-2">
                    {selectedAddOns.length + matrixAddServices.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Standard Add-ons */}
                {addOns.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Standard Add-ons</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {addOns.map((addOn) => (
                        <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Checkbox
                              id={`addon-${addOn.id}`}
                              checked={selectedAddOns.includes(addOn.id)}
                              onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked === true)}
                            />
                            <Label htmlFor={`addon-${addOn.id}`} className="ml-3 font-medium">
                              {addOn.name}
                            </Label>
                          </div>
                          <Badge variant="outline">+${addOn.price}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matrix Add Services */}
                {matrixServices.add.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Specialty Services</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {matrixServices.add.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Checkbox
                              id={`matrix-add-${service.id}`}
                              checked={matrixAddServices.includes(service.id)}
                              onCheckedChange={(checked) =>
                                handleMatrixServiceToggle(service.id, "add", checked === true)
                              }
                            />
                            <div className="ml-3">
                              <Label htmlFor={`matrix-add-${service.id}`} className="font-medium">
                                {service.name}
                              </Label>
                              <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline">+${service.price}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Remove Services */}
        {(reductions.length > 0 || matrixServices.remove.length > 0) && (
          <AccordionItem value="remove-services">
            <AccordionTrigger className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                Remove Services
                {(selectedReductions.length > 0 || matrixRemoveServices.length > 0) && (
                  <Badge variant="outline" className="ml-2">
                    {selectedReductions.length + matrixRemoveServices.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Standard Reductions */}
                {reductions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Standard Reductions</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {reductions.map((reduction) => (
                        <div key={reduction.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Checkbox
                              id={`reduction-${reduction.id}`}
                              checked={selectedReductions.includes(reduction.id)}
                              onCheckedChange={(checked) => handleReductionToggle(reduction.id, checked === true)}
                            />
                            <Label htmlFor={`reduction-${reduction.id}`} className="ml-3 font-medium">
                              {reduction.name}
                            </Label>
                          </div>
                          <Badge variant="outline" className="text-red-500">
                            -${reduction.discount}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matrix Remove Services */}
                {matrixServices.remove.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Skip Services</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {matrixServices.remove.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Checkbox
                              id={`matrix-remove-${service.id}`}
                              checked={matrixRemoveServices.includes(service.id)}
                              onCheckedChange={(checked) =>
                                handleMatrixServiceToggle(service.id, "remove", checked === true)
                              }
                            />
                            <div className="ml-3">
                              <Label htmlFor={`matrix-remove-${service.id}`} className="font-medium">
                                {service.name}
                              </Label>
                              <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-red-500">
                            -${service.price}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Special Requirements */}
        <AccordionItem value="special-requirements">
          <AccordionTrigger className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Special Requirements
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-2">Custom Instructions</h4>
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  rows={3}
                  placeholder="Any special instructions for this room..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pet-friendly" />
                  <Label htmlFor="pet-friendly">Pet-friendly products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="eco-friendly" />
                  <Label htmlFor="eco-friendly">Eco-friendly only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fragrance-free" />
                  <Label htmlFor="fragrance-free">Fragrance-free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="extra-time" />
                  <Label htmlFor="extra-time">Allow extra time</Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button variant="outline" onClick={handleCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Apply Changes - ${calculateTotalPrice().toFixed(2)}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Customize {roomName}</DrawerTitle>
            <DrawerDescription>Configure your cleaning preferences for this room</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize {roomName}</DialogTitle>
          <DialogDescription>Configure your cleaning preferences for this room</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
