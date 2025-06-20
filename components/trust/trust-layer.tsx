"use client"

import { CertificationBadge } from "./certification-badge"
import { LiveTimer } from "./live-timer"
import { EquipmentPreview } from "./equipment-preview"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TrustLayerProps {
  variant?: "full" | "compact" | "badges-only"
  showLiveTimer?: boolean
  showEquipment?: boolean
  className?: string
}

export function TrustLayer({
  variant = "full",
  showLiveTimer = false,
  showEquipment = true,
  className,
}: TrustLayerProps) {
  const certifications = [
    { type: "insured" as const, expiry: "2026-03-15" },
    { type: "bonded" as const, expiry: "2025-12-31" },
    { type: "certified" as const, expiry: "2025-06-30" },
    { type: "background_checked" as const },
    { type: "eco_friendly" as const },
    { type: "satisfaction_guarantee" as const },
  ]

  if (variant === "badges-only") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {certifications.map((cert, index) => (
          <CertificationBadge key={index} type={cert.type} expiry={cert.expiry} />
        ))}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {certifications.slice(0, 3).map((cert, index) => (
                <CertificationBadge key={index} type={cert.type} expiry={cert.expiry} />
              ))}
            </div>
            {showEquipment && <EquipmentPreview compact modal />}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert, index) => (
          <CertificationBadge key={index} type={cert.type} expiry={cert.expiry} showDetails />
        ))}
      </div>

      {/* Live Timer (if active service) */}
      {showLiveTimer && (
        <LiveTimer since="cleaning_started" teamName="The Sparkle Squad" location="123 Main St, Your City" />
      )}

      {/* Equipment Preview */}
      {showEquipment && <EquipmentPreview modal={false} />}
    </div>
  )
}
