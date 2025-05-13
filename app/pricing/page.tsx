"use client"

import { useState } from "react"
import { PricingWizard } from "@/components/pricing-wizard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { useTerms } from "@/lib/terms-context"
import { ShoppingCart, FileText } from "lucide-react"

export default function PricingPage() {
  const [calculatedService, setCalculatedService] = useState<any>(null)
  const { toast } = useToast()
  const { addItem } = useCart()
  const { termsAccepted, openTermsModal } = useTerms()

  const handleCalculationComplete = (data: any) => {
    setCalculatedService(data)
  }

  const handleStepChange = (step: number) => {
    console.log(`Step changed to ${step}`)
  }

  const handleAddToCart = () => {
    if (!calculatedService) {
      toast({
        title: "No service selected",
        description: "Please configure your service before adding to cart",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions before proceeding",
        variant: "warning",
      })
      if (openTermsModal) {
        openTermsModal()
      }
      return
    }

    // Add to cart
    addItem({
      id: `service-${Date.now()}`,
      name: "Cleaning Service",
      price: calculatedService.totalPrice,
      quantity: 1,
      description: "Custom cleaning service",
    })

    toast({
      title: "Added to cart",
      description: "Your service has been added to the cart",
    })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pricing Calculator</h1>
      <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
        Configure your cleaning service to get an instant price quote.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Calculate Your Price</CardTitle>
          <CardDescription>Follow the steps to configure your cleaning service</CardDescription>
        </CardHeader>
        <CardContent>
          <PricingWizard onCalculationComplete={handleCalculationComplete} onStepChange={handleStepChange} />
        </CardContent>
      </Card>

      {calculatedService && calculatedService.totalPrice > 0 && (
        <div className="flex justify-center">
          <Button onClick={handleAddToCart} size="lg" className="gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart (${calculatedService.totalPrice.toFixed(2)})
          </Button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="link" onClick={openTermsModal} className="text-sm text-gray-500">
          <FileText className="h-4 w-4 mr-2" />
          View Terms and Conditions
        </Button>
      </div>
    </div>
  )
}
