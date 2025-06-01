import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingAnimation from "@/components/loading-animation"
import { RoomProvider } from "@/lib/room-context"

// Dynamically import components to prevent SSR issues
const PricingContent = dynamic(() => import("@/components/pricing-content"), {
  ssr: false,
  loading: () => <LoadingAnimation />,
})

// Dynamically import floating elements with client-side only rendering
const PricingFloatingElements = dynamic(
  () => import("@/components/pricing-floating-elements").then((mod) => mod.PricingFloatingElements),
  {
    ssr: false,
  },
)

// Dynamically import AddAllToCartModal with client-side only rendering
const AddAllToCartModal = dynamic(
  () => import("@/components/add-all-to-cart-modal").then((mod) => mod.AddAllToCartModal),
  {
    ssr: false,
  },
)

export default function PricingPage() {
  return (
    <RoomProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Suspense fallback={<LoadingAnimation />}>
            <PricingContent />
          </Suspense>
        </main>

        {/* Floating elements rendered outside the main content */}
        <PricingFloatingElements />
        {/* The AddAllToCartModal will now be rendered on the pricing page */}
        <AddAllToCartModal />
      </div>
    </RoomProvider>
  )
}
