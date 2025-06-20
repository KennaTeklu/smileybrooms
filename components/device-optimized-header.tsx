"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, MessageCircle } from "lucide-react"
import { useDeviceDetection } from "@/lib/device-detection"
import Link from "next/link"

export function DeviceOptimizedHeader() {
  const device = useDeviceDetection()
  const [isOpen, setIsOpen] = useState(false)

  const contactAction = device.isMobile ? (
    <Button asChild className="bg-green-600 hover:bg-green-700">
      <a href="tel:+1-555-CLEAN-NOW">
        <Phone className="h-4 w-4 mr-2" />
        Call Now
      </a>
    </Button>
  ) : (
    <Button asChild variant="outline">
      <Link href="/contact">
        <MessageCircle className="h-4 w-4 mr-2" />
        Contact Us
      </Link>
    </Button>
  )

  if (device.isMobile) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl">
            SmileyBrooms
          </Link>

          <div className="flex items-center gap-2">
            {contactAction}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/pricing" className="text-lg font-medium py-2">
                    Services
                  </Link>
                  <Link href="/about" className="text-lg font-medium py-2">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium py-2">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          SmileyBrooms
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="font-medium hover:text-primary">
            Services
          </Link>
          <Link href="/about" className="font-medium hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="font-medium hover:text-primary">
            Contact
          </Link>
        </nav>

        {contactAction}
      </div>
    </header>
  )
}
