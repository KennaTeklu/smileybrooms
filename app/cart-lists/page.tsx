/* Don't modify beyond what is requested ever. */
"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { isClient } from "@/lib/utils"

// Dynamically import components that use CartProvider to prevent SSR issues
const MultiListCart = dynamic(() => import("@/components/multi-list-cart").then((mod) => mod.default), { ssr: false })

function CartListsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading cart lists...</p>
        </div>
      </div>
    </div>
  )
}

export default function CartListsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isClient()) {
    return <CartListsLoading />
  }

  return <MultiListCart />
}
