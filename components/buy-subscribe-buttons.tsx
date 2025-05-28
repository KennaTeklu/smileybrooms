"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, RefreshCw, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RoomSelection {
  roomType: string
  roomName: string
  roomCount: number
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
  frequency: string
  frequencyDiscount: number
}

interface BuySubscribeButtonsProps {
  selectedRooms: RoomSelection[]
  totalPrice: number
  frequency: string
  frequencyDiscount: number
  onPurchase: (type: "buy" | "subscribe") => void
}

export function BuySubscribeButtons({
  selectedRooms,
  totalPrice,
  frequency,
  frequencyDiscount,
  onPurchase,
}: BuySubscribeButtonsProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Determine if this is a subscription or one-time purchase
  const isSubscription = frequency !== "one_time"
  const buttonType = isSubscription ? "subscribe" : "buy"
  const buttonText = isSubscription ? "Subscribe Now" : "Buy Now"
  const ButtonIcon = isSubscription ? RefreshCw : ShoppingCart

  // Calculate pricing details
  const subtotal = selectedRooms.reduce((sum, room) => sum + room.totalPrice * room.roomCount, 0)
  const discountAmount = subtotal * (frequencyDiscount / 100)
  const finalTotal = subtotal - discountAmount

  // Get frequency display name
  const getFrequencyDisplayName = () => {
    switch (frequency) {
      case "weekly":
        return "Weekly Service"
      case "bi_weekly":
        return "Bi-weekly Service"
      case "monthly":
        return "Monthly Service"
      default:
        return "One-time Service"
    }
  }

  // Get next billing date for subscriptions
  const getNextBillingDate = () => {
    const now = new Date()
    switch (frequency) {
      case "weekly":
        now.setDate(now.getDate() + 7)
        break
      case "bi_weekly":
        now.setDate(now.getDate() + 14)
        break
      case "monthly":
        now.setMonth(now.getMonth() + 1)
        break
      default:
        return null
    }
    return now.toLocaleDateString()
  }

  const handlePurchase = async () => {
    if (selectedRooms.length === 0) {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room to continue.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      await onPurchase(buttonType)

      toast({
        title: isSubscription ? "Subscription initiated" : "Purchase initiated",
        description: isSubscription
          ? "You'll be redirected to complete your subscription setup."
          : "You'll be redirected to complete your purchase.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedRooms.length === 0) {
    return null
  }

  return (
    <Card className="sticky bottom-4 mx-4 shadow-lg border-2 border-blue-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {isSubscription ? (
                <RefreshCw className="h-5 w-5 text-blue-600" />
              ) : (
                <ShoppingCart className="h-5 w-5 text-green-600" />
              )}
              {getFrequencyDisplayName()}
            </CardTitle>
            <CardDescription>
              {selectedRooms.length} room{selectedRooms.length > 1 ? "s" : ""} selected
            </CardDescription>
          </div>
          <Badge variant={isSubscription ? "secondary" : "default"} className="text-lg px-3 py-1">
            ${finalTotal.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Summary */}
        <div className="space-y-2">
          {selectedRooms.map((room, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>
                {room.roomCount}x {room.roomName} ({room.selectedTier})
              </span>
              <span>${(room.totalPrice * room.roomCount).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="border-gray-200" />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {frequencyDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Frequency Discount ({frequencyDiscount}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Subscription Details */}
        {isSubscription && (
          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <Calendar className="h-4 w-4" />
              Subscription Details
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Billing Frequency:</span>
                <span>{getFrequencyDisplayName()}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Billing:</span>
                <span>{getNextBillingDate()}</span>
              </div>
              <div className="flex justify-between">
                <span>You Save:</span>
                <span className="font-medium">{frequencyDiscount}% per service</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handlePurchase}
          disabled={isProcessing}
          className={`w-full h-12 text-lg font-semibold ${
            isSubscription ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonIcon className="h-5 w-5" />
              {buttonText}
            </div>
          )}
        </Button>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          {isSubscription ? (
            <>
              <p>Cancel anytime • No long-term commitment</p>
              <p>First cleaning scheduled within 48 hours</p>
            </>
          ) : (
            <>
              <p>One-time service • No recurring charges</p>
              <p>Service scheduled within 24-48 hours</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
