import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingAnimation from "@/components/loading-animation"
import { RoomProvider } from "@/lib/room-context"

// Dynamically import components to prevent SSR issues
const PricingContent = dynamic(() => import("@/components/pricing-content"), {
  ssr: false,
  loading: () => <LoadingAnimation />,
})

export default function PricingPage() {
  return (
    <RoomProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Suspense fallback={<LoadingAnimation />}>
            <PricingContent />
          </Suspense>
        </main>
      </div>
    </RoomProvider>
  )
}
