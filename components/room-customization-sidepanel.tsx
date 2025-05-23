"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Info, Star, Clock, CheckCircle2 } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomDisplayNames } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"
import { getServiceMap } from "@/lib/service-maps"
import { ServiceMap } from "@/components/service-map"

interface RoomTier {
  name: string
  description: string
  price: number
  features: string[]
}

interface RoomAddOn {
  id: string
  name: string
  price: number
}

interface RoomReduction {
  id: string
  name: string
  discount: number
}

interface RoomConfiguration {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
}

interface RoomCustomizationSidepanelProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomIcon: string
  roomCount: number
  initialConfig?: RoomConfiguration
  onConfigChange: (config: RoomConfiguration) => void
}

export function RoomCustomizationSidepanel({
  isOpen,
  onClose,
  roomType,
  roomIcon,
  roomCount,
  initialConfig,
  onConfigChange,
}: RoomCustomizationSidepanelProps) {
  const roomName = roomDisplayNames[roomType] || roomType
  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)
  const reductions = getRoomReductions(roomType)
  const matrixServices = getMatrixServices(roomType)
  const serviceMap = getServiceMap(roomType)

  const [selectedTier, setSelectedTier] = useState<string>(initialConfig?.selectedTier || tiers[0].name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig?.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig?.selectedReductions || [])
  const [matrixAddServices, setMatrixAddServices] = useState<string[]>([])
  const [matrixRemoveServices, setMatrixRemoveServices] = useState<string[]>([])

  // Calculate the total price based on selections
  const calculateTotalPrice = () => {
    const tierPrice = tiers.find((tier) => tier.name === selectedTier)?.price || tiers[0].price
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)
    const reductionsTotal = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)
    const matrixAddTotal = matrixAddServices.reduce((total, serviceId) => {
      const service = matrixServices.add.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
    const matrixRemoveTotal = matrixRemoveServices.reduce((total, serviceId) => {
      const service = matrixServices.remove.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    return tierPrice + addOnsTotal - reductionsTotal + matrixAddTotal - matrixRemoveTotal
  }

  // Update parent component when configuration changes
  const updateConfiguration = () => {
    const totalPrice = calculateTotalPrice()
    onConfigChange({
      roomName: roomType,
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

  // Handle matrix add services
  const handleMatrixAddChange = (serviceId: string, checked: boolean) => {
    setMatrixAddServices((prev) => {
      if (checked) {
        return [...prev, serviceId]
      } else {
        return prev.filter((id) => id !== serviceId)
      }
    })
    setTimeout(updateConfiguration, 0)
  }

  // Handle matrix remove services
  const handleMatrixRemoveChange = (serviceId: string, checked: boolean) => {
    setMatrixRemoveServices((prev) => {
      if (checked) {
        return [...prev, serviceId]
      } else {
        return prev.filter((id) => id !== serviceId)
      }
    })
    setTimeout(updateConfiguration, 0)
  }

  const selectedTierData = tiers.find((tier) => tier.name === selectedTier) || tiers[0]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[800px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{roomIcon}</span>
                <div>
                  <SheetTitle className="text-xl">Customize {roomName}</SheetTitle>
                  <SheetDescription>
                    {roomCount} {roomCount === 1 ? "room" : "rooms"} selected • ${calculateTotalPrice().toFixed(2)}{" "}
                    total
                  </SheetDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Tabs defaultValue="tiers" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="tiers" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">Tiers</span>
                  </TabsTrigger>
                  <TabsTrigger value="addons" className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Add-ons</span>
                  </TabsTrigger>
                  <TabsTrigger value="matrix" className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Matrix</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Map</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tiers Tab */}
                <TabsContent value="tiers" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Service Tiers
                      </CardTitle>
                      <CardDescription>Choose your cleaning intensity level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
                        {tiers.map((tier, index) => (
                          <div
                            key={tier.name}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedTier === tier.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <Label htmlFor={`tier-${tier.name}`} className="font-semibold text-base">
                                    {tier.name}
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}
                                    >
                                      {index === 0 ? "Basic" : index === 1 ? "Popular" : "Premium"}
                                    </Badge>
                                    <Badge variant="outline">${tier.price}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-start text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Add-ons Tab */}
                <TabsContent value="addons" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Add Services */}
                    <Card>
                      <CardHeader className="bg-green-50">
                        <CardTitle className="text-green-700 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Add Services
                        </CardTitle>
                        <CardDescription>Enhance your cleaning with additional services</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {addOns.map((addOn) => (
                            <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`addon-${addOn.id}`}
                                  checked={selectedAddOns.includes(addOn.id)}
                                  onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                                />
                                <Label htmlFor={`addon-${addOn.id}`} className="font-medium">
                                  {addOn.name}
                                </Label>
                              </div>
                              <Badge variant="outline" className="text-green-600">
                                +${addOn.price}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Remove Services */}
                    <Card>
                      <CardHeader className="bg-red-50">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          Remove Services
                        </CardTitle>
                        <CardDescription>Reduce cost by removing services you don't need</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {reductions.map((reduction) => (
                            <div key={reduction.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`reduction-${reduction.id}`}
                                  checked={selectedReductions.includes(reduction.id)}
                                  onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                                />
                                <Label htmlFor={`reduction-${reduction.id}`} className="font-medium">
                                  {reduction.name}
                                </Label>
                              </div>
                              <Badge variant="outline" className="text-red-600">
                                -${reduction.discount}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Matrix Tab */}
                <TabsContent value="matrix" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        Service Matrix
                      </CardTitle>
                      <CardDescription>Fine-tune your {selectedTier} service</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Matrix Add Services */}
                        <div>
                          <h4 className="font-semibold text-green-700 mb-3">Additional Services</h4>
                          <div className="space-y-2">
                            {matrixServices.add.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`matrix-add-${service.id}`}
                                    checked={matrixAddServices.includes(service.id)}
                                    onCheckedChange={(checked) => handleMatrixAddChange(service.id, checked === true)}
                                  />
                                  <Label htmlFor={`matrix-add-${service.id}`} className="text-sm">
                                    {service.name}
                                  </Label>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  +${service.price}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Matrix Remove Services */}
                        <div>
                          <h4 className="font-semibold text-red-700 mb-3">Remove Services</h4>
                          <div className="space-y-2">
                            {matrixServices.remove.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`matrix-remove-${service.id}`}
                                    checked={matrixRemoveServices.includes(service.id)}
                                    onCheckedChange={(checked) =>
                                      handleMatrixRemoveChange(service.id, checked === true)
                                    }
                                  />
                                  <Label htmlFor={`matrix-remove-${service.id}`} className="text-sm">
                                    {service.name}
                                  </Label>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  -${service.price}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Service Map Tab */}
                <TabsContent value="map" className="space-y-4">
                  <ServiceMap roomName={roomName} categories={serviceMap} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Selected Tier</p>
                <p className="font-semibold">{selectedTier}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-2xl font-bold text-blue-600">${calculateTotalPrice().toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateConfiguration()
                  onClose()
                }}
                className="flex-1"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
