import { VoiceCommandButton } from "@/components/voice/voice-command-button"
import { PricingContent } from "@/components/pricing-content"
import { RoomProvider } from "@/lib/room-context" // Import RoomProvider
import { AddAllToCartModal } from "@/components/add-all-to-cart-modal" // Import AddAllToCartModal

export default function PricingPage() {
  return (
    <RoomProvider>
      {" "}
      {/* Wrap with RoomProvider */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-center">Pricing & Services</h1>
          <VoiceCommandButton />
        </div>

        <PricingContent />

        {/* Client components will be loaded here */}
      </div>
      <AddAllToCartModal /> {/* Render the floating modal */}
    </RoomProvider>
  )
}
