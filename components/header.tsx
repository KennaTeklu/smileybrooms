import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <div className={cn("sticky top-0 bg-white z-50 w-full border-b", className)} {...props}>
      <div className="container h-16 flex items-center">
        <div className="ml-auto flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>Make changes to your cart here. Click save when you're done.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default Header
