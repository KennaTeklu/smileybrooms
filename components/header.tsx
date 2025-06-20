"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhoneCall, Menu } from "lucide-react" // Changed Phone to PhoneCall
import Logo from "@/components/smiley-brooms-logo"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { COMPANY_PHONE_NUMBER } from "@/lib/constants" // Import constant

export default function Header() {
  const scrollDirection = useScrollDirection()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm transition-transform duration-300",
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-6 w-auto" />
          <span className="sr-only">Smiley Brooms</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/about" className="hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="/pricing" className="hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="/careers" className="hover:underline underline-offset-4" prefetch={false}>
            Careers
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link
            href={`tel:${COMPANY_PHONE_NUMBER}`}
            className="flex items-center gap-2 hover:underline underline-offset-4"
            prefetch={false}
          >
            <PhoneCall className="h-4 w-4" />
            <span>{COMPANY_PHONE_NUMBER}</span>
          </Link>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </div>
    </header>
  )
}
