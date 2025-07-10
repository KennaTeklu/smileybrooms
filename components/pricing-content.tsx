"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { defaultTiers } from "@/lib/room-tiers"

type PricingContentProps = {
  onSelect?: (tier: any) => void
  selected?: string | null
}

export function PricingContent({ onSelect, selected }: PricingContentProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {defaultTiers.bedroom.map((tier) => {
        const isActive = tier.id === selected
        return (
          <Card
            key={tier.id}
            onClick={() => onSelect?.(tier)}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/60",
              isActive && "border-2 border-primary",
            )}
            aria-pressed={isActive}
            role="button"
          >
            <CardHeader>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-6">
              <Image
                src="/images/bedroom-professional.png"
                alt={`${tier.name} illustration`}
                width={200}
                height={140}
                className="rounded-md object-cover"
              />
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              <span className="text-2xl font-bold">${tier.price.toFixed(2)}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default PricingContent
