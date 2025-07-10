"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { roomDisplayNames } from "@/lib/room-tiers"
import { RoomCategorySection } from "@/components/room-category-section"

interface PricingContentProps {
  onSelectTier: (roomType: string, tierId: string) => void
}

export function PricingContent({ onSelectTier }: PricingContentProps) {
  const [activeTab, setActiveTab] = useState("tiers")
  const [selectedRoomCategory, setSelectedRoomCategory] = useState<string | null>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleTierSelect = (roomType: string, tierId: string) => {
    onSelectTier(roomType, tierId)
    handleTabChange("custom")
  }

  // Prepare room types for the select dropdown, excluding 'default'
  const roomTypesForSelect = Object.keys(roomDisplayNames).filter((key) => key !== "default")

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Flexible Cleaning Plans</h1>
        <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Choose from our pre-defined tiers or build a custom plan tailored to your needs.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto mb-8">
          <TabsTrigger value="tiers">Choose a Tier</TabsTrigger>
          <TabsTrigger value="custom">Build Your Custom Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-12">
          {/* Always render the "Whole House" (default) section first */}
          <RoomCategorySection roomType="default" onSelectTier={handleTierSelect} />

          {/* Dropdown for other room categories */}
          <div className="mb-8 text-center">
            <Label htmlFor="room-category-select" className="text-lg font-semibold mb-2 block">
              Or explore individual room types:
            </Label>
            <Select onValueChange={setSelectedRoomCategory} value={selectedRoomCategory || ""}>
              <SelectTrigger id="room-category-select" className="w-full md:w-[300px] mx-auto">
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypesForSelect.map((roomType) => (
                  <SelectItem key={roomType} value={roomType}>
                    {roomDisplayNames[roomType]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditionally render the selected individual room category */}
          {selectedRoomCategory && selectedRoomCategory !== "default" && (
            <RoomCategorySection roomType={selectedRoomCategory} onSelectTier={handleTierSelect} />
          )}
        </TabsContent>

        <TabsContent value="custom">
          <div className="flex justify-center">
            {/* The PriceCalculator component will be rendered here */}
            {/* It will receive initialSelectedRooms and initialServiceType from the parent */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
