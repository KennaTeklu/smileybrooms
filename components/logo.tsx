"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative flex items-center justify-center h-8 w-8 rounded-full overflow-hidden">
        {/* Changed image source to favicon.png */}
        <Image src="/favicon.png" alt="SmileyBrooms Logo" width={32} height={32} className="object-contain" />
      </div>

      {!iconOnly && (
        <div className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          smiley<span className="bg-yellow-300 text-gray-900 px-1 rounded">brooms</span>
        </div>
      )}
    </div>
  )
}

export default Logo
