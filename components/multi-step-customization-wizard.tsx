"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"
import { FrequencySelector } from "./frequency-selector"
import { ConfigurationManager } from "./configuration-manager"
import AddressCollectionModal from "./address-collection-modal"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

interface WizardProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
  roomIcon?: string
  roomCount?: number
  config: RoomConfig
  onConfigChange: (config: RoomConfig) => void
}

type WizardStep = "room-config" | "frequency" | "configuration-manager" | "address" | "review"

const STEP_TITLES = {
  "room-config": "Customize Room",
  frequency: "Cleaning Frequency",
  "configuration-manager": "Save Configuration",
  address: "Service Address",
  review: "Review & Add to Cart",
}

const STEP_DESCRIPTIONS = {
  "room-config": "Select cleaning level and add-ons",
  frequency: "Choose how often you want cleaning",
  "configuration-manager": "Save or load configurations",
  address: "Enter your service address",
  review: "Review your selections and add to cart",
}

export function MultiStepCustomizationWizard({
  isOpen,
  onClose,
  roomType,
  roomName,
  roomIcon = "🏠",
  roomCount = 1,
  config,
  onConfigChange,
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("room-config")
  const [selectedTier, setSelectedTier] = useState(config?.selectedTier || "ESSENTIAL CLEAN")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(config?.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(config?.selectedReductions || [])
  const [selectedFrequency, setSelectedFrequency] = useState("one_time")
  const [frequencyDiscount, setFrequencyDiscount] = useState(0)
  const [addressData, setAddressData] = useState<any>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const { addItem } = useCart()
  const { toast } = useToast()

  // Get room data
  const roomData = useMemo(() => {
    try {
      return {
        tiers: getRoomTiers(roomType) || [],
        addOns: getRoomAddOns(roomType) || [],
        reductions: getRoomReductions(roomType) || [],
      }
    } catch (error) {
      console.error("Error getting room data:", error)
      return { tiers: [], addOns: [], reductions: [] }
    }
  }, [roomType])

  // Calculate pricing
  const pricing = useMemo(() => {
    try {
      if (roomData.tiers.length === 0) {
        return {
          basePrice: 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          reductionsPrice: 0,
          totalPrice: 0,
        }
      }

      const baseTier = roomData.tiers[0]
      const currentTier = roomData.tiers.find((t) => t.name === selectedTier) || baseTier

      const tierUpgradePrice = Math.max(0, currentTier.price - baseTier.price)
      const addOnsPrice = selectedAddOns.reduce((sum, addOnId) => {
        const addOn = roomData.addOns.find((a) => a.id === addOnId)
        return sum + (addOn?.price || 0)
      }, 0)
      const reductionsPrice = selectedReductions.reduce((sum, reductionId) => {
        const reduction = roomData.reductions.find((r) => r.id === reductionId)
        return sum + (reduction?.discount || 0)
      }, 0)

      const subtotal = currentTier.price + addOnsPrice - reductionsPrice
      const discountAmount = subtotal * (frequencyDiscount / 100)
      const totalPrice = Math.max(0, subtotal - discountAmount)

      return {
        basePrice: baseTier.price,
        tierUpgradePrice,
        addOnsPrice,
        reductionsPrice,
        totalPrice,
      }
    } catch (error) {
      console.error("Error calculating pricing:", error)
      return {
        basePrice: 0,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: 0,
      }
    }
  }, [selectedTier, selectedAddOns, selectedReductions, frequencyDiscount, roomData])

  // Steps configuration
  const steps: WizardStep[] = ["room-config", "frequency", "configuration-manager", "address", "review"]
  const currentStepIndex = steps.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }, [currentStepIndex, isLastStep, steps])

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1])
    }
  }, [currentStepIndex, isFirstStep, steps])

  // Event handlers
  const toggleAddOn = useCallback((addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }, [])

  const toggleReduction = useCallback((reductionId: string) => {
    setSelectedReductions((prev) =>
      prev.includes(reductionId) ? prev.filter((id) => id !== reductionId) : [...prev, reductionId],
    )
  }, [])

  const handleFrequencyChange = useCallback((frequency: string, discount: number) => {
    setSelectedFrequency(frequency)
    setFrequencyDiscount(discount)
  }, [])

  const handleLoadConfig = useCallback((loadedConfig: any) => {
    // Apply loaded configuration
    if (loadedConfig.rooms && loadedConfig.rooms.length > 0) {
      const roomConfig = loadedConfig.rooms[0]
      setSelectedTier(roomConfig.tier || "ESSENTIAL CLEAN")
      // You can extend this to load other settings
    }
  }, [])

  const handleAddressSubmit = useCallback(
    (data: any) => {
      setAddressData(data)
      setShowAddressModal(false)
      goToNextStep()
    },
    [goToNextStep],
  )

  const handleAddToCart = useCallback(() => {
    try {
      const cartItem = {
        id: `cleaning-service-${Date.now()}`,
        name: `${roomName} Cleaning Service`,
        price: pricing.totalPrice,
        quantity: roomCount,
        priceId: "price_custom_cleaning",
        metadata: {
          roomType,
          selectedTier,
          selectedAddOns,
          selectedReductions,
          frequency: selectedFrequency,
          customer: addressData,
          isRecurring: selectedFrequency !== "one_time",
        },
      }

      addItem(cartItem)

      toast({
        title: "Added to cart",
        description: `${roomName} cleaning service has been added to your cart`,
        duration: 3000,
      })

      onClose()
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [
    roomName,
    pricing.totalPrice,
    roomCount,
    roomType,
    selectedTier,
    selectedAddOns,
    selectedReductions,
    selectedFrequency,
    addressData,
    addItem,
    toast,
    onClose,
  ])

  // Validation for next button
  const canProceedToNext = useMemo(() => {
    switch (currentStep) {
      case "room-config":
        return selectedTier !== ""
      case "frequency":
        return selectedFrequency !== ""
      case "configuration-manager":
        return true // Always can proceed
      case "address":
        return addressData !== null
      case "review":
        return false // Last step
      default:
        return false
    }
  }, [currentStep, selectedTier, selectedFrequency, addressData])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Panel */}
        <div className="relative ml-auto w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{roomIcon}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{STEP_TITLES[currentStep]}</h2>
                    <p className="text-sm text-gray-500">{STEP_DESCRIPTIONS[currentStep]}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${
                      index <= currentStepIndex ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Step {currentStepIndex + 1}</span>
                <span>{steps.length} steps</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentStep === "room-config" && (
                <div className="space-y-6">
                  {/* Cleaning Tiers */}
                  {roomData.tiers.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Cleaning Level</h3>
                      <div className="space-y-2">
                        {roomData.tiers.map((tier, index) => (
                          <Card
                            key={tier.id || tier.name || index}
                            className={`cursor-pointer transition-colors ${
                              selectedTier === tier.name
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => setSelectedTier(tier.name)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{tier.name}</span>
                                    {selectedTier === tier.name && <Check className="h-4 w-4 text-blue-600" />}
                                  </div>
                                  {tier.description && <p className="text-sm text-gray-500">{tier.description}</p>}
                                </div>
                                <span className="font-medium">${tier.price}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  {roomData.addOns.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Add-ons</h3>
                      <div className="space-y-2">
                        {roomData.addOns.map((addOn, index) => (
                          <Card
                            key={addOn.id || index}
                            className={`cursor-pointer transition-colors ${
                              selectedAddOns.includes(addOn.id)
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => toggleAddOn(addOn.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{addOn.name}</span>
                                    {selectedAddOns.includes(addOn.id) && <Check className="h-4 w-4 text-green-600" />}
                                  </div>
                                  {addOn.description && <p className="text-sm text-gray-500">{addOn.description}</p>}
                                </div>
                                <span className="font-medium">+${addOn.price}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reductions */}
                  {roomData.reductions.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Skip Services (Discounts)</h3>
                      <div className="space-y-2">
                        {roomData.reductions.map((reduction, index) => (
                          <Card
                            key={reduction.id || index}
                            className={`cursor-pointer transition-colors ${
                              selectedReductions.includes(reduction.id)
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => toggleReduction(reduction.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{reduction.name}</span>
                                    {selectedReductions.includes(reduction.id) && (
                                      <Check className="h-4 w-4 text-orange-600" />
                                    )}
                                  </div>
                                  {reduction.description && (
                                    <p className="text-sm text-gray-500">{reduction.description}</p>
                                  )}
                                </div>
                                <span className="font-medium text-orange-600">-${reduction.discount}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === "frequency" && (
                <div>
                  <FrequencySelector onFrequencyChange={handleFrequencyChange} selectedFrequency={selectedFrequency} />
                </div>
              )}

              {currentStep === "configuration-manager" && (
                <div>
                  <ConfigurationManager
                    currentConfig={{
                      rooms: [
                        {
                          type: roomName,
                          count: roomCount,
                          tier: selectedTier,
                        },
                      ],
                      totalPrice: pricing.totalPrice,
                    }}
                    onLoadConfig={handleLoadConfig}
                  />
                </div>
              )}

              {currentStep === "address" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">Service Address Required</h3>
                    <p className="text-gray-500 mb-4">We need your address to provide the cleaning service.</p>
                    {addressData ? (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">Address Added</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {addressData.fullName}
                          <br />
                          {addressData.address}
                          <br />
                          {addressData.city}, {addressData.state} {addressData.zipCode}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddressModal(true)}>
                          Edit Address
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setShowAddressModal(true)}>Add Service Address</Button>
                    )}
                  </div>
                </div>
              )}

              {currentStep === "review" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Room:</span>
                            <span className="font-medium">
                              {roomName} ({roomCount})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cleaning Level:</span>
                            <span className="font-medium">{selectedTier}</span>
                          </div>
                          {selectedAddOns.length > 0 && (
                            <div className="flex justify-between">
                              <span>Add-ons:</span>
                              <span className="font-medium">{selectedAddOns.length} selected</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Frequency:</span>
                            <span className="font-medium">{selectedFrequency.replace("_", " ")}</span>
                          </div>
                          {addressData && (
                            <div className="flex justify-between">
                              <span>Address:</span>
                              <span className="font-medium text-right text-sm">
                                {addressData.address}
                                <br />
                                {addressData.city}, {addressData.state}
                              </span>
                            </div>
                          )}
                          <div className="border-t pt-3">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total:</span>
                              <span>${pricing.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">${pricing.totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}

                {isLastStep ? (
                  <Button onClick={handleAddToCart} className="flex-1" disabled={!addressData}>
                    Add to Cart
                  </Button>
                ) : (
                  <Button onClick={goToNextStep} className="flex-1" disabled={!canProceedToNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressCollectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
          calculatedPrice={pricing.totalPrice}
        />
      )}
    </>
  )
}
