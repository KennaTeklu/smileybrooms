"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CollapsibleCartPanel } from "./collapsible-cart-panel"
import { useState } from "react"

export default function Header() {
  const { totalItems } = useCart()
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false)

  return (
    <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 border-b bg-background">
      <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">SmileyBrooms</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link className="font-medium hover:underline underline-offset-4" href="#">
          Home
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="#">
          Services
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="#">
          Pricing
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="#">
          About
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="#">
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          onClick={() => setIsCartPanelOpen(true)}
          aria-label="View shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
              <HomeIcon className="h-6 w-6" />
              <span className="sr-only">SmileyBrooms</span>
            </Link>
            <div className="grid gap-2 py-6">
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Home
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Services
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Pricing
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                About
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <CollapsibleCartPanel isOpen={isCartPanelOpen} setIsOpen={setIsCartPanelOpen} />
    </header>
  )
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
