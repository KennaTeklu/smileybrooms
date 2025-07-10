import { PricingContent } from "@/components/pricing-content"
// RoomProvider and AddAllToCartModal are now imported and used in app/client-layout.tsx

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center">Build Your Cleaning Plan</h1>
        {/* VoiceCommandButton removed from here to simplify the immediate view */}
      </div>

      <PricingContent />
    </div>
  )
}
