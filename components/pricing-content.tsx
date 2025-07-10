"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { roomTiers } from "@/lib/room-tiers"

export function PricingContent() {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roomTiers.map((tier) => (
        <Card key={tier.id} className="transition hover:shadow-lg">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
            <Image
              src={tier.image || "/placeholder.svg"}
              alt={`${tier.name} illustration`}
              width={160}
              height={120}
              className="object-contain rounded"
            />
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="text-sm text-muted-foreground">Multiplier: {tier.priceMultiplier.toFixed(2)}&times;</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

/* Export both styles to satisfy every importer */
export default PricingContent
