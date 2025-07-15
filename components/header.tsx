"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Info, Briefcase, Calculator, ShoppingCart, Mail, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SmileyBroomsLogo } from "@/components/smiley-brooms-logo"

export function Header() {
  const pathname = usePathname()
  const { cart } = useCart()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/careers", label: "Careers", icon: Briefcase },
    { href: "/pricing", label: "Pricing", icon: Calculator },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/download", label: "Download", icon: Download },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <SmileyBroomsLogo className="h-8 w-auto" />
            <span className="sr-only">Smiley Brooms Home</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="relative h-9 w-9">
                  <Link href="/cart" aria-label={`View cart with ${cart.items.length} items`}>
                    <ShoppingCart className="h-5 w-5" />
                    {cart.items.length > 0 && (
                      <motion.span
                        key={cart.items.length} // Key for re-animation on count change
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md ring-2 ring-white dark:ring-gray-950"
                      >
                        {cart.items.length}
                      </motion.span>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {cart.items.length > 0 ? `You have ${cart.items.length} items in your cart.` : "Your cart is empty."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}
