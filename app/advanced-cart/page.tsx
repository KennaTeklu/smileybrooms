"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { isClient } from "@/lib/utils"

// Dynamically import components that use CartProvider to prevent SSR issues
const AdvancedCartSystem = dynamic(() => import("@/components/advanced-cart-system").then((mod) => mod.default), {
  ssr: false,
})

function AdvancedCartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading advanced cart...</p>
        </div>
      </div>
    </div>
  )
}

export default function AdvancedCartPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isClient()) {
    return <AdvancedCartLoading />
  }

  return <AdvancedCartSystem />
}
