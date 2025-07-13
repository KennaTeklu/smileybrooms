"use client"

import PriceCalculator from "@/components/price-calculator"
import { PriceBreakdownDetailed } from "@/components/price-breakdown-detailed"
import { useState } from "react"

export default function CalculatorPage() {
  const [calculationData, setCalculationData] = useState<any>(null)

  const handleCalculationComplete = (data: any) => {
    setCalculationData(data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calculate Your Cleaning Price</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PriceCalculator onCalculationComplete={handleCalculationComplete} />
        {calculationData && <PriceBreakdownDetailed {...calculationData} />}
      </div>
    </div>
  )
}
