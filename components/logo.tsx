"use client"

import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export default function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
        <Smile className="h-5 w-5 animate-pulse" />
      </div>

      {!iconOnly && (
        <div className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          SmileyBrooms
        </div>
      )}
    </div>
  )
}
