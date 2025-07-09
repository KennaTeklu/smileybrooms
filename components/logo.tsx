"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div className="relative flex items-center justify-center h-8 w-8 rounded-full overflow-hidden">
        <Image src="/favicon.png" alt="SmileyBrooms Logo" width={32} height={32} className="object-contain" />
      </div>

      {!iconOnly && (
        <span className="ml-2 font-bold text-xl tracking-tight inline-flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          smiley
          <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
        </span>
      )}
    </Link>
  )
}

export default Logo
