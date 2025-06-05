import { VoiceCommandButton } from "@/components/voice/voice-command-button"
import { PricingContent } from "@/components/pricing-content"
// RoomProvider and AddAllToCartModal are now imported and used in app/client-layout.tsx

export default function PricingPage() {
  return (
    // RoomProvider is now in app/client-layout.tsx
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center">Pricing & Services</h1>
        <VoiceCommandButton />
      </div>

      <PricingContent />

      {/* Client components will be loaded here */}
      {/* AddAllToCartModal is now rendered globally in app/client-layout.tsx */}
    </div>
  )
}
