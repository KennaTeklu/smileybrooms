"use client"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, ShoppingCartIcon as Paypal, Apple, ChromeIcon as Google } from "lucide-react"
import type { PaymentMethod } from "@/lib/payment-config"

interface DynamicPaymentSelectorProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod: PaymentMethod
}

const paymentOptions = [
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "paypal", label: "PayPal", icon: Paypal },
  { value: "apple", label: "Apple Pay", icon: Apple },
  { value: "google", label: "Google Pay", icon: Google },
]

export default function DynamicPaymentSelector({ onSelect, selectedMethod }: DynamicPaymentSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedMethod === option.value
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "hover:border-gray-400"
              }`}
              onClick={() => onSelect(option.value)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <Icon className={`h-8 w-8 mb-2 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                <p className="font-medium">{option.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
