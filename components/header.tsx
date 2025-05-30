"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { CartButton } from "@/components/cart-button" // Import the new CartButton
import { usePathname } from "next/navigation"

export function Header() {
  const { setTheme } = useTheme()
  const isMobile = useMobile()
  const pathname = usePathname()

  // Do not render the header on the /pricing page
  if (pathname === "/pricing") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold">SmileyBrooms</span>
        </Link>
        <nav className="flex items-center gap-4">
          {!isMobile && (
            <>
              <Link href="/" className="flex items-center gap-1 text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="flex items-center gap-1 text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="flex items-center gap-1 text-sm font-medium">
                Contact
              </Link>
              <Link href="/careers" className="flex items-center gap-1 text-sm font-medium">
                Careers
              </Link>
              <Link href="/pricing" className="flex items-center gap-1 text-sm font-medium">
                Pricing
              </Link>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CartButton /> {/* Add the new CartButton here */}
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/careers">Careers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing">Pricing</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  )
}
