import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/placeholder-logo.png"
      alt="SmileyBrooms Logo"
      width={120}
      height={40}
      className={cn("h-10 w-auto", className)}
      priority
    />
  )
}
