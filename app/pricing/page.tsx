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
 import dynamic from "next/dynamic"
import LoadingAnimation from "@/components/loading-animation"

const PricingContent = dynamic(() => import("@/components/pricing-content"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 pt-2 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingAnimation />
        <p className="mt-4 text-gray-600">Loading pricing options...</p>
      </div>
    </div>
  ),
})

export default function PricingPage() {
  return <PricingContent />
}
