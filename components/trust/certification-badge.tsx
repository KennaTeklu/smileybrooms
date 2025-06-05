"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, CheckCircle, Clock, Award, Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificationBadgeProps {
  type: "insured" | "bonded" | "certified" | "background_checked" | "eco_friendly" | "satisfaction_guarantee"
  expiry?: string
  className?: string
  showDetails?: boolean
}

export function CertificationBadge({ type, expiry, className, showDetails = false }: CertificationBadgeProps) {
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (expiry) {
      const expiryDate = new Date(expiry)
      setIsExpired(expiryDate < new Date())
    }
  }, [expiry])

  const badgeConfig = {
    insured: {
      icon: Shield,
      label: "Fully Insured",
      color: "bg-green-500",
      description: "$2M liability coverage",
      verificationId: "INS-2024-001",
    },
    bonded: {
      icon: CheckCircle,
      label: "Bonded",
      color: "bg-blue-500",
      description: "Theft protection guarantee",
      verificationId: "BND-2024-002",
    },
    certified: {
      icon: Award,
      label: "Certified Cleaners",
      color: "bg-purple-500",
      description: "Professional training completed",
      verificationId: "CERT-2024-003",
    },
    background_checked: {
      icon: Users,
      label: "Background Checked",
      color: "bg-orange-500",
      description: "All staff vetted & verified",
      verificationId: "BGC-2024-004",
    },
    eco_friendly: {
      icon: Star,
      label: "Eco-Friendly",
      color: "bg-emerald-500",
      description: "Green cleaning products only",
      verificationId: "ECO-2024-005",
    },
    satisfaction_guarantee: {
      icon: CheckCircle,
      label: "100% Satisfaction",
      color: "bg-yellow-500",
      description: "Money-back guarantee",
      verificationId: "SAT-2024-006",
    },
  }

  const config = badgeConfig[type]
  const IconComponent = config.icon

  if (showDetails) {
    return (
      <Card className={cn("w-full max-w-sm", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", config.color)}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{config.label}</h3>
                {!isExpired && (
                  <Badge variant="outline" className="text-xs">
                    Valid
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{config.description}</p>
              {expiry && (
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {isExpired ? "Expired" : `Valid until ${expiry}`}
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">ID: {config.verificationId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={cn("flex items-center space-x-1 px-2 py-1", isExpired && "opacity-50", className)}
    >
      <IconComponent className="h-3 w-3" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  )
}
