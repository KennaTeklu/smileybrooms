import { RoomProvider } from "@/lib/room-context"
import { AddAllToCartModal } from "@/components/add-all-to-cart-modal"

// Wrap the existing content with RoomProvider and add the modal
export default function PricingPage() {
  return (
    <RoomProvider>
      <PricingContent />
      <AddAllToCartModal />
    </RoomProvider>
  )
}
