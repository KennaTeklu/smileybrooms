"use client"

import { useState } from "react"
import UnifiedCartButton from "@/components/unified-cart-button"
import { Button } from "@/components/ui/button"
import { useEnhancedCart } from "@/lib/enhanced-cart-context"
import { v4 as uuidv4 } from "uuid"

export default function CartDemo() {
  const { addItem } = useEnhancedCart()
  const [demoMode, setDemoMode] = useState<"normal" | "sticky" | "checkout" | "all">("normal")

  const addDemoItem = () => {
    const demoItems = [
      {
        id: uuidv4(),
        name: "Basic Cleaning Service",
        price: 99.99,
        priceId: "price_basic_cleaning",
        image: "/professional-cleaning-service.png",
      },
      {
        id: uuidv4(),
        name: "Deep Cleaning Package",
        price: 199.99,
        priceId: "price_deep_cleaning",
        image: "/professional-cleaning-team.png",
      },
      {
        id: uuidv4(),
        name: "Premium Cleaning Bundle",
        price: 299.99,
        priceId: "price_premium_bundle",
        image: "/sparkling-home-service.png",
      },
    ]

    const randomItem = demoItems[Math.floor(Math.random() * demoItems.length)]
    addItem(randomItem)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Cart Button Demo</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Display Options</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={demoMode === "normal" ? "default" : "outline"} onClick={() => setDemoMode("normal")}>
            Normal
          </Button>
          <Button variant={demoMode === "sticky" ? "default" : "outline"} onClick={() => setDemoMode("sticky")}>
            Sticky
          </Button>
          <Button variant={demoMode === "checkout" ? "default" : "outline"} onClick={() => setDemoMode("checkout")}>
            Checkout
          </Button>
          <Button variant={demoMode === "all" ? "default" : "outline"} onClick={() => setDemoMode("all")}>
            Show All
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <Button onClick={addDemoItem}>Add Random Item to Cart</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(demoMode === "normal" || demoMode === "all") && (
          <div className="border p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Standard Cart Button</h2>
            <div className="flex justify-center">
              <UnifiedCartButton />
            </div>
          </div>
        )}

        {(demoMode === "normal" || demoMode === "all") && (
          <div className="border p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Cart Button with Price</h2>
            <div className="flex justify-center">
              <UnifiedCartButton showPrice={true} />
            </div>
          </div>
        )}

        {(demoMode === "checkout" || demoMode === "all") && (
          <div className="border p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Checkout Button</h2>
            <div className="flex justify-center">
              <UnifiedCartButton showCheckout={true} variant="default" />
            </div>
          </div>
        )}
      </div>

      {(demoMode === "sticky" || demoMode === "all") && (
        <>
          <h2 className="text-xl font-semibold mt-12 mb-4">Sticky Cart Buttons</h2>
          <p className="mb-4 text-gray-600">These buttons are fixed to different positions on the screen.</p>

          <UnifiedCartButton sticky={true} position="top-right" showPrice={true} />

          <UnifiedCartButton sticky={true} position="bottom-right" variant="default" showCheckout={true} />

          <UnifiedCartButton
            sticky={true}
            position="bottom-full"
            showPrice={true}
            showCheckout={true}
            variant="default"
          />
        </>
      )}
    </div>
  )
}
