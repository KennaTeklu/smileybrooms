"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Landmark, Wallet } from "lucide-react"

export function PaymentMethodSelector() {
  const [paymentMethod, setPaymentMethod] = useState("card")

  const paymentMethods = [
    {
      id: "card",
      name: "Credit / Debit Card",
      icon: CreditCard,
      description: "Pay securely with your credit or debit card",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Landmark,
      description: "Pay directly from your bank account",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "Pay with Apple Pay, Google Pay, or PayPal",
    },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex flex-1 items-center p-4 cursor-pointer">
              <Card className={`w-full ${paymentMethod === method.id ? "border-primary" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Card Details</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <input id="cardName" className="w-full p-2 border rounded-md" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <input id="cardNumber" className="w-full p-2 border rounded-md" placeholder="4242 4242 4242 4242" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label htmlFor="expMonth">Expiry Month</Label>
                <input id="expMonth" className="w-full p-2 border rounded-md" placeholder="MM" />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="expYear">Expiry Year</Label>
                <input id="expYear" className="w-full p-2 border rounded-md" placeholder="YY" />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="cvc">CVC</Label>
                <input id="cvc" className="w-full p-2 border rounded-md" placeholder="123" />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "bank" && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Bank Account Details</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <input id="accountName" className="w-full p-2 border rounded-md" placeholder="John Smith" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <input id="routingNumber" className="w-full p-2 border rounded-md" placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <input id="accountNumber" className="w-full p-2 border rounded-md" placeholder="987654321" />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "wallet" && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-4">Digital Wallet</h4>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="h-16 w-24 flex flex-col items-center justify-center gap-1">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs">Apple Pay</span>
            </Button>
            <Button variant="outline" className="h-16 w-24 flex flex-col items-center justify-center gap-1">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs">Google Pay</span>
            </Button>
            <Button variant="outline" className="h-16 w-24 flex flex-col items-center justify-center gap-1">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs">PayPal</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
