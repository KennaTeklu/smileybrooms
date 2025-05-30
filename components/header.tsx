import type React from "react"
import { cn } from "@/lib/utils"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <div className={cn("sticky top-0 bg-white z-50 w-full border-b", className)} {...props}>
      <div className="container h-16 flex items-center">
        <div className="ml-auto flex items-center space-x-4">{/* Removed cart related components */}</div>
      </div>
    </div>
  )
}

export default Header
