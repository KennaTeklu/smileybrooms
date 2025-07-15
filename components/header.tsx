"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SmileyBroomsLogo } from "./smiley-brooms-logo"

export function Header() {
  const pathname = usePathname()
  const { cart } = useCart()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <SmileyBroomsLogo className="h-8 w-auto" />
            <span className="sr-only">Smiley Brooms Home</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="relative h-9 w-9">
                  <Link href="/cart">
                    <ShoppingCart className={cn("h-5 w-5", cart.totalItems > 0 && "text-blue-600")} />
                    {cart.totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className={cn(
                          "absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full p-0 text-xs font-bold",
                          "border-2 border-background",
                          cart.totalItems > 0 && "animate-pulse-once bg-red-500 text-white shadow-lg",
                        )}
                      >
                        {cart.totalItems}
                      </Badge>
                    )}
                    <span className="sr-only">View Cart</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {cart.totalItems === 0 ? "Your cart is empty" : `Cart: ${cart.totalItems} item(s)`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-6 pt-6 text-lg font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === item.href ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
