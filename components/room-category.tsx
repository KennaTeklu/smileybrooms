"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Settings } from "lucide-react"
import { useRoom } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context"
import type { RoomTier } from "@/lib/room-tiers"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

interface RoomCategoryProps {
  room: RoomTier
}

export default function RoomCategory({ room }: RoomCategoryProps) {
  const { getRoomCount, addRoom, removeRoom, updateRoomTier, updateRoomAddOns, getRoomTier, getRoomAddOns } = useRoom()
  const { addItemToCart, removeItemFromCart } = useCart()
  const { toast } = useToast()

  const count = getRoomCount(room.id)
  const currentTier = getRoomTier(room.id) || room.tiers[0]
  const currentAddOns = getRoomAddOns(room.id) || []

  const handleAddRoom = () => {
    addRoom(room.id)
    addItemToCart({
      id: room.id,
      name: room.name,
      price: currentTier.price,
      quantity: 1,
      type: "room",
      tier: currentTier.name,
      addOns: currentAddOns.map((ao) => ao.name),
    })
    toast({
      title: `${room.name} Added!`,
      description: `1 ${room.name} added to your cleaning plan.`,
    })
  }

  const handleIncrement = () => {
    addRoom(room.id)
    addItemToCart({
      id: room.id,
      name: room.name,
      price: currentTier.price,
      quantity: 1,
      type: "room",
      tier: currentTier.name,
      addOns: currentAddOns.map((ao) => ao.name),
    })
  }

  const handleDecrement = () => {
    if (count > 0) {
      removeRoom(room.id)
      removeItemFromCart(room.id)
    }
  }

  const handleTierChange = (tierName: string) => {
    const selectedTier = room.tiers.find((tier) => tier.name === tierName)
    if (selectedTier) {
      updateRoomTier(room.id, selectedTier)
      // Update cart item price if already in cart
      if (count > 0) {
        addItemToCart({
          id: room.id,
          name: room.name,
          price: selectedTier.price,
          quantity: count,
          type: "room",
          tier: selectedTier.name,
          addOns: currentAddOns.map((ao) => ao.name),
        })
      }
    }
  }

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    const addOn = room.addOns?.find((ao) => ao.id === addOnId)
    if (addOn) {
      const newAddOns = checked ? [...currentAddOns, addOn] : currentAddOns.filter((item) => item.id !== addOnId)
      updateRoomAddOns(room.id, newAddOns)

      // Update cart item with add-on price
      if (count > 0) {
        const addOnsPrice = newAddOns.reduce((sum, ao) => sum + ao.price, 0)
        addItemToCart({
          id: room.id,
          name: room.name,
          price: currentTier.price + addOnsPrice,
          quantity: count,
          type: "room",
          tier: currentTier.name,
          addOns: newAddOns.map((ao) => ao.name),
        })
      }
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={room.image || "/placeholder.svg"}
          alt={room.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
          priority
        />
      </div>
      <CardContent className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">{room.name}</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{room.description}</p>
        </div>
        <div className="flex items-center justify-between">
          {count === 0 ? (
            <Button onClick={handleAddRoom} className="w-full">
              Add Room
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleDecrement} aria-label={`Remove one ${room.name}`}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-lg font-semibold">{count}</span>
                <Button variant="outline" size="icon" onClick={handleIncrement} aria-label={`Add one ${room.name}`}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Customize ${room.name}`}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh] max-h-[90vh] md:max-w-md md:mx-auto">
                  <DrawerHeader>
                    <DrawerTitle>Customize {room.name}</DrawerTitle>
                    <DrawerDescription>Adjust cleaning tier and add-on services for this room.</DrawerDescription>
                  </DrawerHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6">
                      {/* Cleaning Tier Selection */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Cleaning Tier</Label>
                        <RadioGroup
                          value={currentTier.name}
                          onValueChange={handleTierChange}
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                        >
                          {room.tiers.map((tier) => (
                            <Label
                              key={tier.name}
                              htmlFor={`${room.id}-${tier.name}`}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary dark:border-gray-700 dark:bg-gray-950 dark:hover:bg-gray-900"
                            >
                              <RadioGroupItem id={`${room.id}-${tier.name}`} value={tier.name} className="sr-only" />
                              <span className="text-lg font-semibold">{tier.name}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">${tier.price.toFixed(2)}</span>
                              <p className="mt-1 text-center text-xs text-gray-500">{tier.description}</p>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Add-on Services */}
                      {room.addOns && room.addOns.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-base font-medium">Add-on Services</Label>
                          <div className="grid grid-cols-1 gap-3">
                            {room.addOns.map((addOn) => (
                              <div
                                key={addOn.id}
                                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-950"
                              >
                                <Label htmlFor={`${room.id}-${addOn.id}`} className="flex flex-col">
                                  <span className="font-medium">{addOn.name}</span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    +${addOn.price.toFixed(2)}
                                  </span>
                                </Label>
                                <Checkbox
                                  id={`${room.id}-${addOn.id}`}
                                  checked={currentAddOns.some((item) => item.id === addOn.id)}
                                  onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked as boolean)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Example of a slider for a custom option */}
                      {room.id === "bathroom" && (
                        <div className="space-y-2">
                          <Label htmlFor="shower-intensity" className="text-base font-medium">
                            Shower Cleaning Intensity
                          </Label>
                          <Slider
                            id="shower-intensity"
                            defaultValue={[50]}
                            max={100}
                            step={10}
                            className="w-full"
                            onValueChange={(value) => console.log("Shower intensity:", value)}
                          />
                          <p className="text-sm text-gray-500">Adjust the intensity of shower cleaning (0-100%).</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Done</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
