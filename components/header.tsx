"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { AccessibilityToolbar } from "./accessibility-toolbar" // Assuming this is the correct path
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  // Do not render the header on the /pricing page
  if (pathname === "/pricing") {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Logo />
          <span className="sr-only">SmileyBrooms</span>
        </Link>
        <nav className="hidden items-center space-x-4 md:flex lg:space-x-6">
          <Link className="text-sm font-medium transition-colors hover:text-primary" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium transition-colors hover:text-primary" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium transition-colors hover:text-primary" href="/contact">
            Contact
          </Link>
          <Link className="text-sm font-medium transition-colors hover:text-primary" href="/careers">
            Careers
          </Link>
          <Link className="text-sm font-medium transition-colors hover:text-primary" href="/pricing">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccessibilityToolbar />
          {/* The Cart component is now handled by MinimalHero on the homepage */}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <Link className="mr-6 flex items-center" href="/">
              <Logo />
              <span className="sr-only">SmileyBrooms</span>
            </Link>
            <div className="grid gap-2 py-6">
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/">
                Home
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/about">
                About
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/contact">
                Contact
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/careers">
                Careers
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/pricing">
                Pricing
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
