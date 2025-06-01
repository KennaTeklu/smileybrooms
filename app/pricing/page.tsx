import { RoomProvider } from "@/lib/room-context"
import PricingPageClient from "@/components/pricing-page-client"

export default function PricingPage() {
  return (
    <RoomProvider>
      <PricingPageClient />
    </RoomProvider>
  )
}
