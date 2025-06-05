import { VoiceCommandButton } from "@/components/voice/voice-command-button"
import { PricingContent } from "@/components/pricing-content"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center">Pricing & Services</h1>
        <VoiceCommandButton />
      </div>

      <PricingContent />

      {/* Client components will be loaded here */}
    </div>
  )
}
