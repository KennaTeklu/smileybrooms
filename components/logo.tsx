import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils" // Ensure cn is imported if used elsewhere in the component

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  // Changed to named export
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <Image src="/favicon.png" alt="SmileyBrooms Logo" width={32} height={32} className="object-contain" />
      <span className="font-bold text-lg tracking-tight inline-flex items-center">
        smiley
        <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
      </span>
    </Link>
  )
}
