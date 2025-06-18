"use client"

import { useState, useEffect } from "react"
import { AdvancedSidePanel } from "./sidepanel/advanced-sidepanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Undo2, Redo2, Shield, Zap, Star } from "lucide-react"
import { getRoomTiers, getRoomAddOns } from "@/lib/room-tiers"
import { useToast } from "@/components/ui/use-toast"

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

  // Get room data
  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)

  // Update local config when prop changes
  useEffect(() => {
    setLocalConfig(config)
    setHasUnsavedChanges(false)
  }, [config])

  // Add to history when config changes
  const addToHistory = (newConfig: RoomConfig) => {
    setHistory((prev) => {
      const newConfigs = prev.configs.slice(0, prev.currentIndex + 1)
      newConfigs.push(newConfig)
      return {
        configs: newConfigs,
        currentIndex: newConfigs.length - 1,
      }
    })
  }

  // Undo/Redo functionality
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

  // Calculate pricing
  const calculatePricing = (newConfig: Partial<RoomConfig>) => {
    const updatedConfig = { ...localConfig, ...newConfig }

    // Get base tier price
    const selectedTier = tiers.find((tier) => tier.name === updatedConfig.selectedTier)
    const basePrice = tiers[0].price
    const tierUpgradePrice = selectedTier ? selectedTier.price - basePrice : 0

    // Calculate add-ons price
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

  // Handle tier change
  const handleTierChange = (tierName: string) => {
    const newConfig = calculatePricing({ selectedTier: tierName })
    setLocalConfig(newConfig)
    addToHistory(newConfig)
    setHasUnsavedChanges(true)
  }

  // Handle add-on toggle
  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    const newAddOns = checked
      ? [...localConfig.selectedAddOns, addOnId]
      : localConfig.selectedAddOns.filter((id) => id !== addOnId)

    const newConfig = calculatePricing({ selectedAddOns: newAddOns })
    setLocalConfig(newConfig)
    addToHistory(newConfig)
    setHasUnsavedChanges(true)
  }

  // Save changes
  const handleSave = () => {
    onConfigChange(localConfig)
    setHasUnsavedChanges(false)
    toast({
      title: "Configuration saved",
      description: `${roomName} customization has been updated`,
    })
  }

  // Reset to original
  const handleReset = () => {
    setLocalConfig(config)
    setHasUnsavedChanges(false)
    toast({
      title: "Configuration reset",
      description: `${roomName} customization has been reset`,
    })
  }

  // Calculate progress (based on selections made)
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
        {/* Room Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {roomIcon}
              Application Form: {roomName}
            </CardTitle>
            <CardDescription>Fill out the form below to apply for this position at Smiley Brooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Selected Tier:</strong> {localConfig.selectedTier}
              </p>
              <p>
                <strong>Base Price:</strong> ${localConfig.basePrice.toFixed(2)}
              </p>
              <p>
                <strong>Tier Upgrade Price:</strong> ${localConfig.tierUpgradePrice.toFixed(2)}
              </p>
              <p>
                <strong>Add-ons Price:</strong> ${localConfig.addOnsPrice.toFixed(2)}
              </p>
              <p>
                <strong>Total Price:</strong> ${localConfig.totalPrice.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tiers" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="tiers">Service Tiers</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="space-y-4">
            <RadioGroup value={localConfig.selectedTier} onValueChange={handleTierChange}>
              {tiers.map((tier) => (
                <div key={tier.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={tier.name} id={tier.name} />
                  <Label htmlFor={tier.name}>
                    {getTierIcon(tier.name)} {tier.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="addons" className="space-y-4">
            {addOns.map((addOn) => (
              <div key={addOn.id} className="flex items-center justify-between">
                <Label htmlFor={addOn.id}>{addOn.name}</Label>
                <Checkbox
                  id={addOn.id}
                  checked={localConfig.selectedAddOns.includes(addOn.id)}
                  onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AdvancedSidePanel>
  )
}
