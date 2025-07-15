"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon, ShoppingCart, Home } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
          <Home className="h-6 w-6" />
          <span className="sr-only">Smiley Brooms</span>
          <span className="hidden sm:inline">Smiley Brooms</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
          <Link href="/about" className="hover:text-primary" prefetch={false}>
            About
          </Link>
          <Link href="/pricing" className="hover:text-primary" prefetch={false}>
            Pricing
          </Link>
          <Link href="/careers" className="hover:text-primary" prefetch={false}>
            Careers
          </Link>
          <Link href="/contact" className="hover:text-primary" prefetch={false}>
            Contact
          </Link>
          <Link href="/download" className="hover:text-primary" prefetch={false}>
            Download
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  asChild
                  aria-label={`Shopping Cart with ${totalItems} items`}
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-6 w-6" />
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems} // Key for re-animating on count change
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-background"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {totalItems === 0 ? "Your cart is empty" : `You have ${totalItems} item(s) in your cart`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/about" className="text-lg font-medium hover:text-primary" prefetch={false}>
                  About
                </Link>
                <Link href="/pricing" className="text-lg font-medium hover:text-primary" prefetch={false}>
                  Pricing
                </Link>
                <Link href="/careers" className="text-lg font-medium hover:text-primary" prefetch={false}>
                  Careers
                </Link>
                <Link href="/contact" className="text-lg font-medium hover:text-primary" prefetch={false}>
                  Contact
                </Link>
                <Link href="/download" className="text-lg font-medium hover:text-primary" prefetch={false}>
                  Download
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
