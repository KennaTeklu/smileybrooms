import PriceCalculator from "@/components/price-calculator"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-center">Build Your Cleaning Plan</h1>
      </div>

      <PriceCalculator />
    </div>
  )
}
