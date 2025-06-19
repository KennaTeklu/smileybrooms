"use client"

/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Landmark, Wallet } from "lucide-react"

type PaymentMethod = "card" | "bank" | "wallet"

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod: PaymentMethod
}

export default function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onSelect(value as PaymentMethod)}
          className="grid grid-cols-3 gap-4"
        >
          <div className="relative">
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              Credit Card
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
            <Label
              htmlFor="bank"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Landmark className="mb-3 h-6 w-6" />
              Bank Account
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
            <Label
              htmlFor="wallet"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Wallet className="mb-3 h-6 w-6" />
              Digital Wallet
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
