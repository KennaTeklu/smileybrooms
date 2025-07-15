"use client"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoomCategory } from "@/components/room-category"
import { useRoomContext } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context"
import { generateCartItemId } from "@/lib/cart/item-utils"
import {
  Bath,
  Bed,
  Car,
  RockingChairIcon as Chair,
  CookingPot,
  DoorOpen,
  Home,
  Lamp,
  WashingMachineIcon as Laundry,
  StepBackIcon as Stairs,
  Tv,
  Warehouse,
} from "lucide-react"
import Image from "next/image"

interface PricingContentProps {
  initialRoomCounts: Record<string, number>
  initialRoomConfigs: Record<string, any>
}

export default function PricingContent({ initialRoomCounts, initialRoomConfigs }: PricingContentProps) {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, calculateRoomPrice, calculateTotalPrice } =
    useRoomContext()
  const { cart, addItem, addMultipleItems, clearCart } = useCart()

  const roomCategories = useMemo(
    () => [
      {
        id: "bedroom",
        name: "Bedrooms",
        icon: <Bed className="h-5 w-5" />,
        image: "/images/bedroom-professional.png",
      },
      {
        id: "bathroom",
        name: "Bathrooms",
        icon: <Bath className="h-5 w-5" />,
        image: "/images/bathroom-professional.png",
      },
      {
        id: "living-room",
        name: "Living Rooms",
        icon: <Tv className="h-5 w-5" />,
        image: "/images/living-room-professional.png",
      },
      {
        id: "kitchen",
        name: "Kitchens",
        icon: <CookingPot className="h-5 w-5" />,
        image: "/images/kitchen-professional.png",
      },
      {
        id: "dining-room",
        name: "Dining Rooms",
        icon: <Chair className="h-5 w-5" />,
        image: "/images/dining-room-professional.png",
      },
      {
        id: "home-office",
        name: "Home Offices",
        icon: <Home className="h-5 w-5" />,
        image: "/images/home-office-professional.png",
      },
      {
        id: "laundry-room",
        name: "Laundry Rooms",
        icon: <Laundry className="h-5 w-5" />,
        image: "/images/laundry-room-professional.png",
      },
      {
        id: "entryway",
        name: "Entryways",
        icon: <DoorOpen className="h-5 w-5" />,
        image: "/images/entryway-professional.png",
      },
      {
        id: "hallway",
        name: "Hallways",
        icon: <Lamp className="h-5 w-5" />,
        image: "/images/hallway-professional.png",
      },
      {
        id: "stairs",
        name: "Stairs",
        icon: <Stairs className="h-5 w-5" />,
        image: "/images/stairs-professional.png",
      },
      {
        id: "garage",
        name: "Garages",
        icon: <Car className="h-5 w-5" />,
        image: "/images/placeholder.svg?height=24&width=24&query=garage",
      },
      {
        id: "basement",
        name: "Basements",
        icon: <Warehouse className="h-5 w-5" />,
        image: "/images/placeholder.svg?height=24&width=24&query=basement",
      },
    ],
    [],
  )

  const handleAddAllToCart = () => {
    const itemsToAdd = Object.entries(roomConfigs)
      .filter(([, config]) => roomCounts[config.roomType] > 0) // Only add rooms that have a count > 0
      .map(([roomType, config]) => {
        const price = calculateRoomPrice(
          roomType,
          config.selectedTier,
          config.selectedAddOns,
          config.selectedReductions,
        )
        const quantity = roomCounts[roomType]
        const name = `${roomCategories.find((cat) => cat.id === roomType)?.name || roomType} Cleaning - ${config.selectedTier}`

        return {
          id: generateCartItemId(config),
          name: name,
          price: price,
          quantity: quantity,
          roomType: config.roomType,
          selectedTier: config.selectedTier,
          selectedAddOns: config.selectedAddOns,
          selectedReductions: config.selectedReductions,
        }
      })
    addMultipleItems(itemsToAdd)
  }

  const handleAddIndividualRoomToCart = (roomType: string) => {
    const config = roomConfigs[roomType]
    if (config && roomCounts[roomType] > 0) {
      const price = calculateRoomPrice(roomType, config.selectedTier, config.selectedAddOns, config.selectedReductions)
      const quantity = roomCounts[roomType]
      const name = `${roomCategories.find((cat) => cat.id === roomType)?.name || roomType} Cleaning - ${config.selectedTier}`

      addItem({
        id: generateCartItemId(config),
        name: name,
        price: price,
        quantity: quantity,
        roomType: config.roomType,
        selectedTier: config.selectedTier,
        selectedAddOns: config.selectedAddOns,
        selectedReductions: config.selectedReductions,
      })
    }
  }

  const totalCalculatedPrice = calculateTotalPrice()

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Rooms</CardTitle>
            <CardDescription>Choose the rooms you want cleaned and customize their service level.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {roomCategories.map((category) => (
              <RoomCategory
                key={category.id}
                roomType={category.id}
                name={category.name}
                icon={category.icon}
                image={category.image}
                count={roomCounts[category.id] || 0}
                onCountChange={(count) => updateRoomCount(category.id, count)}
                roomConfig={roomConfigs[category.id]}
                onConfigChange={(config) => updateRoomConfig(category.id, config)}
                calculateRoomPrice={calculateRoomPrice}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Rooms</CardTitle>
            <CardDescription>Review and adjust the details for your selected rooms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(roomConfigs).filter(([, config]) => roomCounts[config.roomType] > 0).length === 0 ? (
              <p className="text-muted-foreground">No rooms selected yet. Add rooms above to see them here.</p>
            ) : (
              Object.entries(roomConfigs)
                .filter(([, config]) => roomCounts[config.roomType] > 0)
                .map(([roomType, config]) => (
                  <div
                    key={roomType}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={roomCategories.find((cat) => cat.id === roomType)?.image || "/placeholder.svg"}
                        alt={roomType}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {roomCategories.find((cat) => cat.id === roomType)?.name || roomType} (x{roomCounts[roomType]}
                          )
                        </h3>
                        <p className="text-sm text-muted-foreground">Tier: {config.selectedTier}</p>
                        {config.selectedAddOns.length > 0 && (
                          <p className="text-xs text-muted-foreground">Add-ons: {config.selectedAddOns.join(", ")}</p>
                        )}
                        {config.selectedReductions.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Reductions: {config.selectedReductions.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="text-lg font-bold">
                        $
                        {calculateRoomPrice(
                          roomType,
                          config.selectedTier,
                          config.selectedAddOns,
                          config.selectedReductions,
                        ).toFixed(2)}
                      </span>
                      <Button size="sm" onClick={() => handleAddIndividualRoomToCart(roomType)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))
            )}
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleAddAllToCart} disabled={Object.values(roomCounts).every((count) => count === 0)}>
                Add All Selected Rooms to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Estimate</CardTitle>
            <CardDescription>A breakdown of your estimated cleaning service cost.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(roomConfigs)
                .filter(([, config]) => roomCounts[config.roomType] > 0)
                .map(([roomType, config]) => (
                  <div key={roomType} className="flex justify-between text-sm">
                    <span>
                      {roomCategories.find((cat) => cat.id === roomType)?.name || roomType} (x{roomCounts[roomType]})
                    </span>
                    <span>
                      $
                      {(
                        calculateRoomPrice(
                          roomType,
                          config.selectedTier,
                          config.selectedAddOns,
                          config.selectedReductions,
                        ) * roomCounts[roomType]
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Estimated Price:</span>
                <span>${totalCalculatedPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Cart</CardTitle>
            <CardDescription>Items currently in your shopping cart.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Cart Total:</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            <Button onClick={clearCart} disabled={cart.items.length === 0} className="w-full">
              Clear Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
