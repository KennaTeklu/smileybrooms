import { cn } from "@/lib/utils"

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
    </div>
  )
}
