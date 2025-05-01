import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Smiley face circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full"></div>

        {/* Eyes */}
        <div className="absolute top-[30%] left-[25%] w-[12%] h-[12%] bg-gray-900 rounded-full"></div>
        <div className="absolute top-[30%] right-[25%] w-[12%] h-[12%] bg-gray-900 rounded-full"></div>

        {/* Smile */}
        <div className="absolute bottom-[30%] left-[25%] w-[50%] h-[20%] border-b-4 border-gray-900 rounded-b-full"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        smileybrooms
      </span>
    </div>
  )
}
