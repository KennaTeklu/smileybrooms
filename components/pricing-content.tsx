"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  X,
  Plus,
  Minus,
  Home,
  Bath,
  Utensils,
  Sofa,
  BookOpen,
  LayoutDashboard,
  WashingMachineIcon as Laundry,
  DoorOpen,
  Lightbulb,
} from "lucide-react"
import Image from "next/image"
import { useRoom, type RoomConfig } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { roomTiers, roomCategories, requiresEmailPricing, CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { calculateRoomPrice } from "@/lib/utils" // Import calculateRoomPrice

type RoomCategoryKey =
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "living_room"
  | "dining_room"
  | "hallway"
  | "entryway"
  | "home_office"
  | "laundry_room"
  | "stairs"
  | "custom_space"

const categoryIcons: Record<RoomCategoryKey, JSX.Element> = {
  bedroom: <Home className="h-5 w-5" />,
  bathroom: <Bath className="h-5 w-5" />,
  kitchen: <Utensils className="h-5 w-5" />,
  living_room: <Sofa className="h-5 w-5" />,
  dining_room: <Utensils className="h-5 w-5" />,
  hallway: <DoorOpen className="h-5 w-5" />,
  entryway: <DoorOpen className="h-5 w-5" />,
  home_office: <BookOpen className="h-5 w-5" />,
  laundry_room: <Laundry className="h-5 w-5" />,
  stairs: <LayoutDashboard className="h-5 w-5" />, // Using dashboard as a placeholder for stairs
  custom_space: <Lightbulb className="h-5 w-5" />,
}

export function PricingContent() {
  const { roomState, addRoom, updateRoom, removeRoom, getCalculatedRoomPrice } = useRoom()
  const { addItem, addItems, cart } = useCart()
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState<RoomCategoryKey>("bedroom")
  const [customSpaceName, setCustomSpaceName] = useState("")
  const [customSpaceDescription, setCustomSpaceDescription] = useState("")
  const [customSpaceQuantity, setCustomSpaceQuantity] = useState(1)

  const roomsInCart = useMemo(() => {
    return cart.items.filter((item) => item.sourceSection === "Room Configuration")
  }, [cart.items])

  const handleAddRoom = (room: RoomConfig) => {
    addRoom(room)
  }

  const handleUpdateRoom = (room: RoomConfig) => {
    updateRoom(room)
  }

  const handleRemoveRoom = (id: string) => {
    removeRoom(id)
  }

  const handleAddToCart = (room: RoomConfig) => {
    const calculatedPrice = getCalculatedRoomPrice(room)
    addItem({
      id: room.id,
      name: room.name,
      price: room.isPriceTBD ? 0 : calculatedPrice, // Use 0 if price is TBD, otherwise calculated price
      quantity: 1,
      image: room.image,
      sourceSection: "Room Configuration",
      metadata: {
        roomConfig: {
          ...room,
          basePrice: room.basePrice, // Ensure basePrice is passed
          calculatedPrice: calculatedPrice, // Store calculated price for reference
        },
      },
      paymentType: room.paymentType,
    })
  }

  const handleAddAllToCart = () => {
    const itemsToAdd = Object.values(roomState.roomConfigs).map((room) => {
      const calculatedPrice = getCalculatedRoomPrice(room)
      return {
        id: room.id,
        name: room.name,
        price: room.isPriceTBD ? 0 : calculatedPrice,
        quantity: 1,
        image: room.image,
        sourceSection: "Room Configuration",
        metadata: {
          roomConfig: {
            ...room,
            basePrice: room.basePrice,
            calculatedPrice: calculatedPrice,
          },
        },
        paymentType: room.paymentType,
      }
    })
    addItems(itemsToAdd)
  }

  const handleAddCustomSpace = () => {
    if (!customSpaceName.trim() || !customSpaceDescription.trim() || customSpaceQuantity <= 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a name, description, and valid quantity for your custom space.",
        variant: "destructive",
      })
      return
    }

    const newCustomSpace: RoomConfig = {
      id: `custom-space-${Date.now()}`,
      name: customSpaceName.trim(),
      basePrice: 0, // Custom spaces have TBD pricing
      timeEstimate: "Varies",
      description: customSpaceDescription.trim(),
      image: "/placeholder.svg?height=100&width=100",
      category: "custom_space",
      addons: [],
      reductions: [],
      isPriceTBD: true,
      paymentType: "in_person", // Custom spaces are in-person payment
    }

    for (let i = 0; i < customSpaceQuantity; i++) {
      addRoom({ ...newCustomSpace, id: `${newCustomSpace.id}-${i}` })
    }

    setCustomSpaceName("")
    setCustomSpaceDescription("")
    setCustomSpaceQuantity(1)
    toast({
      title: "Custom Space Added",
      description: "Your custom space request has been added to the cart. We'll contact you for pricing!",
      duration: 5000,
    })
  }

  const getRoomCount = (roomId: string) => {
    return Object.values(roomState.roomConfigs).filter((room) => room.id.startsWith(roomId.split("-")[0])).length
  }

  const getRoomById = (id: string) => roomState.roomConfigs[id]

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-4">
          Flexible <span className="text-blue-600 dark:text-blue-400">Pricing</span> for Every Home
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Choose the rooms you need cleaned and customize your service. Get an instant estimate or request a custom
          quote for unique spaces.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Room Categories */}
        <Card className="lg:col-span-1 shadow-lg sticky top-8 h-fit">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Room Categories</CardTitle>
            <CardDescription>Select a category to view available room types.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roomCategories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-lg py-6",
                  selectedCategory === category.key &&
                    "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                )}
                onClick={() => setSelectedCategory(category.key as RoomCategoryKey)}
              >
                {categoryIcons[category.key as RoomCategoryKey]}
                <span className="ml-3">{category.name}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Main Content: Room Tiers */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {roomCategories.find((cat) => cat.key === selectedCategory)?.name} Cleaning
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {roomTiers
              .filter((tier) => tier.category === selectedCategory)
              .map((tier) => {
                const roomCount = getRoomCount(tier.id)
                const isAdded = roomCount > 0
                const roomInCart = getRoomById(tier.id) // Check if this specific tier ID is in the roomState

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <CardHeader className="relative p-0">
                        <Image
                          src={tier.image || "/placeholder.svg"}
                          alt={tier.name}
                          width={400}
                          height={225}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          {tier.timeEstimate}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-6">
                        <CardTitle className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                          {tier.name}
                        </CardTitle>
                        <CardDescription className="mb-4 text-muted-foreground">{tier.description}</CardDescription>
                        <div className="space-y-2 mb-4">
                          {tier.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          {requiresEmailPricing(tier.category) || tier.paymentType === "in_person" ? (
                            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                              Email for Pricing
                            </span>
                          ) : (
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              ${tier.basePrice.toFixed(2)}
                            </span>
                          )}
                          {isAdded ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveRoom(tier.id)}
                                aria-label={`Remove one ${tier.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold">{roomCount}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAddRoom({ ...tier, id: `${tier.id}-${Date.now()}` })}
                                aria-label={`Add one more ${tier.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddRoom(tier)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Add to Config
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <Button
                          onClick={() => handleAddToCart(tier)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={requiresEmailPricing(tier.category) || tier.paymentType === "in_person"}
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}

            {selectedCategory === "custom_space" && (
              <Card className="md:col-span-2 xl:col-span-3 shadow-lg p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-purple-500" /> Request Custom Space Cleaning
                  </CardTitle>
                  <CardDescription>
                    Have a unique space or specific cleaning needs? Describe it below, and we'll provide a personalized
                    quote.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom-space-name">Space Name</Label>
                    <Input
                      id="custom-space-name"
                      placeholder="e.g., Home Theater, Garage, Patio"
                      value={customSpaceName}
                      onChange={(e) => setCustomSpaceName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-space-description">Description of Cleaning Needs</Label>
                    <Textarea
                      id="custom-space-description"
                      placeholder="e.g., Deep clean for a 2-car garage, organize and clean a small home library."
                      value={customSpaceDescription}
                      onChange={(e) => setCustomSpaceDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-space-quantity">Quantity</Label>
                    <Input
                      id="custom-space-quantity"
                      type="number"
                      min="1"
                      value={customSpaceQuantity}
                      onChange={(e) => setCustomSpaceQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button
                    onClick={handleAddCustomSpace}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Add Custom Space to Cart
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                    <span className="font-semibold text-purple-700 dark:text-purple-400">Note:</span>{" "}
                    {CUSTOM_SPACE_LEGAL_DISCLAIMER}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {Object.keys(roomState.roomConfigs).length > 0 && (
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
            Your Current Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Selected Rooms</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                {Object.values(roomState.roomConfigs).map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{room.name}</p>
                        <p className="text-sm text-muted-foreground">{room.timeEstimate}</p>
                      </div>
                    </div>
                    {room.isPriceTBD ? (
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">Email for Pricing</span>
                    ) : (
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        ${calculateRoomPrice(room).toFixed(2)}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRoom(room.id)}
                      aria-label={`Remove ${room.name}`}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Summary</h3>
              <Card className="bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-lg font-medium text-gray-800 dark:text-gray-200">
                    <span>Total Rooms:</span>
                    <span>{roomState.totalRooms}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-gray-800 dark:text-gray-200">
                    <span>Estimated Time:</span>
                    <span>{roomState.totalTimeEstimate}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <span>Estimated Price:</span>
                    {roomState.totalPrice === 0 && Object.values(roomState.roomConfigs).some((r) => r.isPriceTBD) ? (
                      <span className="text-orange-600 dark:text-orange-400">Email for Pricing</span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400">${roomState.totalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {Object.values(roomState.roomConfigs).some((r) => r.isPriceTBD) && (
                    <p className="text-xs text-gray-500 mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <span className="font-semibold text-orange-700 dark:text-orange-400">Note:</span>{" "}
                      {CUSTOM_SPACE_LEGAL_DISCLAIMER}
                    </p>
                  )}
                  <Button
                    onClick={handleAddAllToCart}
                    className="w-full mt-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={Object.values(roomState.roomConfigs).length === 0}
                  >
                    Add All to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
