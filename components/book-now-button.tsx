"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BookNowButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
}

export default function BookNowButton({ className, size = "lg" }: BookNowButtonProps) {
  return (
    <Button asChild size={size} className={className}>
      <Link href="/pricing">
        Book Now
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}
