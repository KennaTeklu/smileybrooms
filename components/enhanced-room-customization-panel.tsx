"use client"

import { useState, useEffect } from "react"
import { AdvancedSidePanel } from "./sidepanel/advanced-sidepanel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Star, Zap, Shield, Clock, Undo2, Redo2, X } from "lucide-react"
import { getRoomTiers, getRoomAddOns } from "@/lib/room-tiers"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BUNDLE_NAMING } from "@/lib/pricing-config" // Import BUNDLE_NAMING

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface EnhancedRoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
  roomIcon: string
  roomCount: number
  config: RoomConfig
  onConfigChange: (config: RoomConfig) => void
}

interface ConfigHistory {
  configs: RoomConfig[]
  currentIndex: number
}

export function EnhancedRoomCustomizationPanel({
  isOpen,
  onClose,
  roomType,
  roomName,
  roomIcon,
  roomCount,
  config,
  onConfigChange,
}: EnhancedRoomCustomizationPanelProps) {
  const { toast } = useToast()
  const [localConfig, setLocalConfig] = useState<RoomConfig>(config)
  const [history, setHistory] = useState<ConfigHistory>({
    configs: [config],
    currentIndex: 0,
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)

  useEffect(() => {
    setLocalConfig(config)
    setHasUnsavedChanges(false)
  }, [config])

  // Upsell Logic: Trigger toast if roomCount > 3 and not already Elite
  useEffect(() => {
    if (roomCount > 3 && localConfig.selectedTier !== BUNDLE_NAMING.ELITE) {
      const eliteTier = tiers.find((tier) => tier.name === BUNDLE_NAMING.ELITE)
      if (eliteTier) {
        // Simple placeholder for discount calculation.
        // In a real scenario, this would compare total price of current config vs. Elite bundle.
        const potentialSavings = eliteTier.price * roomCount - localConfig.totalPrice * roomCount
        toast({
          title: "Consider our Elite Tier!",
          description: `For ${roomCount} ${roomName}s, upgrading to Elite could save you money and provide comprehensive cleaning.`,
          duration: 5000,
        })
      }
    }
  }, [roomCount, localConfig.selectedTier, localConfig.totalPrice, roomName, tiers, toast])

  const addToHistory = (newConfig: RoomConfig) => {
    setHistory((prev) => {
      const newConfigs = prev.configs.slice(0, prev.currentIndex + 1)
      newConfigs.push(newConfig)
      return {
        configs: newConfigs.slice(-10),
        currentIndex: Math.min(newConfigs.length - 1, 9),
      }
    })
  }

  const canUndo = history.currentIndex > 0
  const canRedo = history.currentIndex < history.configs.length - 1

  const undo = () => {
    if (canUndo) {
      const newIndex = history.currentIndex - 1
      const prevConfig = history.configs[newIndex]
      setLocalConfig(prevConfig)
      setHistory((prev) => ({ ...prev, currentIndex: newIndex }))
      setHasUnsavedChanges(true)
    }
  }

  const redo = () => {
    if (canRedo) {
      const newIndex = history.currentIndex + 1
      const nextConfig = history.configs[newIndex]
      setLocalConfig(nextConfig)
      setHistory((prev) => ({ ...prev, currentIndex: newIndex }))
      setHasUnsavedChanges(true)
    }
  }

  const calculatePricing = (newConfig: Partial<RoomConfig>) => {
    const updatedConfig = { ...localConfig, ...newConfig }

    const selectedTier = tiers.find((tier) => tier.name === updatedConfig.selectedTier)
    const basePrice = tiers[0].price
    const tierUpgradePrice = selectedTier ? selectedTier.price - basePrice : 0

    const addOnsPrice = updatedConfig.selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    const totalPrice = basePrice + tierUpgradePrice + addOnsPrice

    return {
      ...updatedConfig,
      basePrice,
      tierUpgradePrice,
      addOnsPrice,
      totalPrice: Math.max(0, totalPrice),
    }
  }

  const handleTierChange = (tierName: string) => {
    const newConfig = calculatePricing({ selectedTier: tierName })
    setLocalConfig(newConfig)
    addToHistory(newConfig)
    setHasUnsavedChanges(true)
  }

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    const newAddOns = checked
      ? [...localConfig.selectedAddOns, addOnId]
      : localConfig.selectedAddOns.filter((id) => id !== addOnId)

    const newConfig = calculatePricing({ selectedAddOns: newAddOns })
    setLocalConfig(newConfig)
    addToHistory(newConfig)
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    onConfigChange(localConfig)
    setHasUnsavedChanges(false)
    toast({
      title: "Configuration saved",
      description: `${roomName} customization has been updated`,
      duration: 3000,
    })
  }

  const handleReset = () => {
    setLocalConfig(config)
    setHasUnsavedChanges(false)
    toast({
      title: "Configuration reset",
      description: `${roomName} customization has been reset`,
      duration: 3000,
    })
  }

  const calculateProgress = () => {
    let progress = 0
    if (localConfig.selectedTier !== tiers[0].name) progress += 50
    if (localConfig.selectedAddOns.length > 0) progress += 50
    return Math.min(progress, 100)
  }

  const getTierIcon = (tierName: string) => {
    if (tierName.includes("PREMIUM")) return <Star className="h-4 w-4" />
    if (tierName.includes("ADVANCED")) return <Zap className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  return (
    <AdvancedSidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={`Customize ${roomName}`}
      subtitle={`${roomCount} room${roomCount > 1 ? "s" : ""} selected`}
      width="lg"
      showProgress={true}
      progress={calculateProgress()}
      preserveScrollPosition={true}
      scrollKey={`room-${roomType}`}
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="h-8 w-8" title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="h-8 w-8" title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      }
      primaryAction={{
        label: hasUnsavedChanges ? "Save Changes" : "Close",
        onClick: hasUnsavedChanges ? handleSave : onClose,
        disabled: false,
      }}
      secondaryAction={
        hasUnsavedChanges
          ? {
              label: "Reset",
              onClick: handleReset,
              disabled: false,
            }
          : undefined
      }
      priceDisplay={{
        label: "Total Price",
        amount: localConfig.totalPrice * roomCount,
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{roomIcon}</div>
              <div>
                <CardTitle className="text-lg">{roomName}</CardTitle>
                <CardDescription>
                  Configure cleaning options for {roomCount} room{roomCount > 1 ? "s" : ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="tiers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tiers">Service Tiers</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="space-y-4">
            <RadioGroup value={localConfig.selectedTier} onValueChange={handleTierChange}>
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`cursor-pointer transition-colors ${
                    localConfig.selectedTier === tier.name
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={tier.name} id={tier.name} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={tier.name} className="cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            {getTierIcon(tier.name)}
                            <span className="font-medium">{tier.name}</span>
                            {tier.name === BUNDLE_NAMING.PREMIUM && (
                              <Badge className="bg-yellow-500 text-white">Most Popular</Badge>
                            )}
                            <Badge variant="secondary">${tier.price}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                          {tier.features && (
                            <ul className="mt-2 space-y-1">
                              {tier.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                  <Check className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-400">
                            {tier.timeEstimate && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{tier.timeEstimate} per room</span>
                              </div>
                            )}
                            {tier.guarantee && (
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-gray-500" />
                                <span>{tier.guarantee} Guarantee</span>
                              </div>
                            )}
                          </div>
                          {tier.detailedTasks && tier.detailedTasks.length > 0 && (
                            <div className="mt-3 text-sm">
                              <p className="font-semibold">Total Tasks: {tier.detailedTasks.length}</p>
                              <Accordion type="single" collapsible className="w-full mt-2">
                                <AccordionItem value="tasks">
                                  <AccordionTrigger className="py-2 text-sm">View Detailed Tasks</AccordionTrigger>
                                  <AccordionContent>
                                    <h4 className="font-medium mb-1">Included Tasks:</h4>
                                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                      {tier.detailedTasks.map((task, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <Check className="h-3 w-3 text-green-500" /> {task}
                                        </li>
                                      ))}
                                    </ul>
                                    {tier.notIncludedTasks && tier.notIncludedTasks.length > 0 && (
                                      <>
                                        <h4 className="font-medium mt-3 mb-1">Not Included (Upgrade for these):</h4>
                                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                          {tier.notIncludedTasks.map((task, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-center gap-2 line-through text-gray-400"
                                            >
                                              <X className="h-3 w-3 text-red-500" /> {task}
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="addons" className="space-y-4">
            {addOns.length > 0 ? (
              <div className="space-y-3">
                {addOns.map((addOn) => (
                  <Card key={addOn.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={addOn.id}
                          checked={localConfig.selectedAddOns.includes(addOn.id)}
                          onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={addOn.id} className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{addOn.name}</span>
                              <Badge variant="outline" className="bg-black text-white">
                                +${addOn.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{addOn.description}</p>
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">No add-ons available for this room type</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>${localConfig.basePrice.toFixed(2)}</span>
            </div>
            {localConfig.tierUpgradePrice > 0 && (
              <div className="flex justify-between">
                <span>Tier Upgrade</span>
                <span>+${localConfig.tierUpgradePrice.toFixed(2)}</span>
              </div>
            )}
            {localConfig.addOnsPrice > 0 && (
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>+${localConfig.addOnsPrice.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Per Room</span>
              <span>${localConfig.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>
                Total ({roomCount} room{roomCount > 1 ? "s" : ""})
              </span>
              <span>${(localConfig.totalPrice * roomCount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdvancedSidePanel>
  )
}
