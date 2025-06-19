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
 "use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { isClient } from "@/lib/utils"

// Dynamically import components that use CartProvider to prevent SSR issues
const CartHealthDashboard = dynamic(
  () => import("@/components/cart-health-dashboard").then((mod) => mod.CartHealthDashboard),
  { ssr: false },
)

// Create a client-side only cart insights content component
const CartInsightsContent = dynamic(
  () => import("@/components/cart-insights-content").then((mod) => mod.CartInsightsContent),
  { ssr: false, loading: () => <CartInsightsLoading /> },
)

function CartInsightsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Cart Insights</h1>
      </div>

      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading cart insights...</p>
        </div>
      </div>
    </div>
  )
}

export default function CartInsightsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isClient()) {
    return <CartInsightsLoading />
  }

  return <CartInsightsContent />
}
