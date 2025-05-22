"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"

interface CardDetailsFormProps {
  subtotal: number
  tax: number
  shipping?: number
  total: number
  onSubmit: () => Promise<void>
}

export default function CardDetailsForm({ subtotal, tax, shipping = 0, total, onSubmit }: CardDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardType, setCardType] = useState<string>("visa")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit()
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Card type</Label>
            <RadioGroup value={cardType} onValueChange={setCardType} className="grid grid-cols-4 gap-2">
              <div className="relative">
                <RadioGroupItem value="visa" id="visa" className="sr-only" />
                <Label
                  htmlFor="visa"
                  className={`flex h-14 items-center justify-center rounded-md border-2 ${
                    cardType === "visa" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image src="/visa-logo-generic.png" alt="Visa" width={60} height={40} />
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="mastercard" id="mastercard" className="sr-only" />
                <Label
                  htmlFor="mastercard"
                  className={`flex h-14 items-center justify-center rounded-md border-2 ${
                    cardType === "mastercard" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src="/placeholder.svg?height=40&width=60&query=Mastercard logo"
                    alt="Mastercard"
                    width={60}
                    height={40}
                  />
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="amex" id="amex" className="sr-only" />
                <Label
                  htmlFor="amex"
                  className={`flex h-14 items-center justify-center rounded-md border-2 ${
                    cardType === "amex" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src="/placeholder.svg?height=40&width=60&query=American Express logo"
                    alt="American Express"
                    width={60}
                    height={40}
                  />
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="discover" id="discover" className="sr-only" />
                <Label
                  htmlFor="discover"
                  className={`flex h-14 items-center justify-center rounded-md border-2 ${
                    cardType === "discover" ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src="/placeholder.svg?height=40&width=60&query=Discover card logo"
                    alt="Discover"
                    width={60}
                    height={40}
                  />
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameOnCard">Name on card</Label>
            <Input id="nameOnCard" placeholder="Name as it appears on card" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card number</Label>
            <Input id="cardNumber" placeholder="1111 2222 3333 4444" required maxLength={19} pattern="[0-9\s]{13,19}" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiration date</Label>
              <Input id="expiryDate" placeholder="MM/YY" required maxLength={5} pattern="(0[1-9]|1[0-2])\/[0-9]{2}" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" required maxLength={4} pattern="[0-9]{3,4}" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total (Tax incl.)</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Processing..." : `Checkout ${formatCurrency(total)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
