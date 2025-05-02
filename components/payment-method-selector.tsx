"use client"

import { useState } from "react"
import { CreditCard, Building, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void
  selectedMethod?: string
  className?: string
}

export default function PaymentMethodSelector({
  onSelect,
  selectedMethod = "card",
  className,
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState(selectedMethod)

  const handleSelect = (method: string) => {
    setSelected(method)
    onSelect(method)
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <button
        type="button"
        onClick={() => handleSelect("card")}
        className={cn(
          "flex flex-col items-center justify-center p-3 border rounded-md transition-colors",
          selected === "card"
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700",
        )}
      >
        <CreditCard className="h-6 w-6 mb-1" />
        <span className="text-sm font-medium">Credit Card</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect("bank")}
        className={cn(
          "flex flex-col items-center justify-center p-3 border rounded-md transition-colors",
          selected === "bank"
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700",
        )}
      >
        <Building className="h-6 w-6 mb-1" />
        <span className="text-sm font-medium">Bank Account</span>
        <span className="text-xs text-muted-foreground">ACH Transfer</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect("both")}
        className={cn(
          "flex flex-col items-center justify-center p-3 border rounded-md transition-colors",
          selected === "both"
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700",
        )}
      >
        <Wallet className="h-6 w-6 mb-1" />
        <span className="text-sm font-medium">Choose Later</span>
        <span className="text-xs text-muted-foreground">At Checkout</span>
      </button>
    </div>
  )
}
