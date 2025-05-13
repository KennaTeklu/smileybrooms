import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  href?: string
  linkClassName?: string
}

export function Logo({ className, href = "/", linkClassName }: LogoProps) {
  const logo = (
    <div className={cn("flex items-center", className)}>
      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">smileybroom</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={linkClassName}>
        {logo}
      </Link>
    )
  }

  return logo
}
