"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDeviceDetection } from "@/lib/device-detection"
import { getDeviceOptimizedPaymentMethods, getContactInfo, type PaymentMethod } from "@/lib/payment-config"
import { Apple, Smartphone, Phone, Download, ExternalLink } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface DynamicPaymentSelectorProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

export default function DynamicPaymentSelector({ onSelect, selectedMethod }: DynamicPaymentSelectorProps) {
  const deviceInfo = useDeviceDetection()
  const [paymentMethods, setPaymentMethods] = useState<ReturnType<typeof getDeviceOptimizedPaymentMethods>>([])
  const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod)
  const { toast } = useToast()
  const contactInfo = getContactInfo()

  useEffect(() => {
    if (deviceInfo.type !== "unknown") {
      const methods = getDeviceOptimizedPaymentMethods(deviceInfo.type)
      setPaymentMethods(methods)

      // Auto-select primary method if none selected
      if (!selected && methods.length > 0) {
        const primaryMethod = methods[0].id
        setSelected(primaryMethod)
        onSelect(primaryMethod)
      }
    }
  }, [deviceInfo.type, onSelect, selected])

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method)
    onSelect(method)
  }

  const getPaymentIcon = (id: PaymentMethod) => {
    switch (id) {
      case "apple_pay":
        return <Apple className="h-8 w-8" />
      case "google_pay":
        return <Smartphone className="h-8 w-8" />
      case "contact_for_alternatives":
        return <Phone className="h-8 w-8" />
      default:
        return <Phone className="h-8 w-8" />
    }
  }

  const downloadContactInfo = () => {
    const contactData = `SmileyBrooms Contact Information
Website: ${contactInfo.website}
Phone: ${contactInfo.phoneFormatted}

Call us for alternative payment options:
• Cash payment upon service completion
• Zelle payment instructions
• Other payment arrangements

We're here to help make payment convenient for you!`

    const blob = new Blob([contactData], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'smileybrooms-contact.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Contact Info Downloaded! 📱",
      description: "You can now call us to arrange alternative payment methods.",
      variant: "default",
    })
  }

  const callNow = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Loading payment options...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method, index) => (
        <Card 
          key={method.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selected === method.id 
              ? 'ring-2 ring-primary border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleSelect(method.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                method.id === 'apple_pay' ? 'bg-black text-white' :
                method.id === 'google_pay' ? 'bg-blue-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {getPaymentIcon(method.id)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{method.name}</h3>
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {method.description}
                </p>
                
                {method.id === 'contact_for_alternatives' && (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          callNow()
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call {contactInfo.phoneFormatted}
                      </Button>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadContactInfo()
                        }}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Contact Info
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <strong>Available payment options:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Cash payment when we arrive</li>
                        <li>• Zelle payment (we'll provide instructions)</li>
                        <li>• Other arrangements by phone</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`w-4 h-4 rounded-full border-2 ${
                selected === method.id 
                  ? 'bg-primary border-primary' 
                  : 'border-gray-300'
              }`}>
                {selected === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
