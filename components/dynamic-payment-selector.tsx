"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useDeviceDetection } from "@/lib/device-detection"
import { getDeviceOptimizedPaymentMethods, type PaymentMethod } from "@/lib/payment-config"
import { Apple, CreditCard, Landmark, ShoppingCartIcon as Paypal, ShoppingCart, Smartphone } from "lucide-react"
import { paymentConfig } from "@/lib/payment-config"

interface DynamicPaymentSelectorProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

export default function DynamicPaymentSelector({ onSelect, selectedMethod }: DynamicPaymentSelectorProps) {
  const deviceInfo = useDeviceDetection()
  const [paymentMethods, setPaymentMethods] = useState<ReturnType<typeof getDeviceOptimizedPaymentMethods>>([])
  const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod)

  useEffect(() => {
    if (deviceInfo.type !== "unknown") {
      const methods = getDeviceOptimizedPaymentMethods(deviceInfo.type)
      setPaymentMethods(methods)

      // Auto-select primary method if none selected
      if (!selected && methods.length > 0) {
        setSelected(methods[0].id)
        onSelect(methods[0].id)
      }
    }
  }, [deviceInfo.type, onSelect, selected])

  const handleChange = (value: string) => {
    const method = value as PaymentMethod
    setSelected(method)
    onSelect(method)
  }

  const getPaymentIcon = (id: PaymentMethod) => {
    switch (id) {
      case "apple_pay":
        return <Apple className="h-6 w-6" />
      case "google_pay":
        return <Smartphone className="h-6 w-6" />
      case "paypal":
        return <Paypal className="h-6 w-6" />
      case "amazon_pay":
        return <ShoppingCart className="h-6 w-6" />
      case "bank_transfer":
        return <Landmark className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  return (
    <Card
      className={`shadow-md border-0 ${deviceInfo.isIOS ? "ios-card" : deviceInfo.isAndroid ? "android-card" : "desktop-card"}`}
    >
      <CardContent className="pt-6">
        <RadioGroup value={selected} onValueChange={handleChange} className="grid gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
              <Label
                htmlFor={method.id}
                className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${
                  method.id === paymentConfig[deviceInfo.type].primary ? "recommended-payment" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`payment-icon ${method.theme}`}>{getPaymentIcon(method.id)}</div>
                  <div>
                    <div className="font-medium">{method.name}</div>
                    {method.id === paymentConfig[deviceInfo.type].primary && (
                      <div className="text-xs text-muted-foreground">Recommended for your device</div>
                    )}
                  </div>
                </div>
                {method.id === paymentConfig[deviceInfo.type].primary && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Preferred
                  </Badge>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
