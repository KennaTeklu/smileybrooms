import { cn } from "@/lib/utils"

interface SmileyBroomsLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  iconOnly?: boolean
}

export function SmileyBroomsLogo({ className, size = "md", iconOnly = false }: SmileyBroomsLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* This component is specifically for the SVG logo, not the image.
            Keeping it as is, as the request is to replace 'smileybrooms-logo.png'
            which is handled by the general 'Logo' component. */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Circle background */}
          <circle cx="50" cy="50" r="45" fill="#4F46E5" />

          {/* Broom handle */}
          <rect x="48" y="20" width="4" height="60" fill="#8B4513" />

          {/* Broom bristles forming a smile */}
          <path d="M30 55 C 40 70, 60 70, 70 55" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M30 55 C 40 70, 60 70, 70 55"
            stroke="#FFD700"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 3"
            strokeDashoffset="1"
          />

          {/* Eyes */}
          <circle cx="35" cy="40" r="5" fill="#FFFFFF" />
          <circle cx="65" cy="40" r="5" fill="#FFFFFF" />
          <circle cx="35" cy="40" r="2" fill="#000000" />
          <circle cx="65" cy="40" r="2" fill="#000000" />
        </svg>
      </div>

      {!iconOnly && (
        <span className="font-bold text-lg tracking-tight inline-flex items-center">
          smiley
          <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
        </span>
      )}
    </div>
  )
}

export default SmileyBroomsLogo
