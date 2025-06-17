"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export function EnhancedFooter() {
  const pathname = usePathname()
  const { cart } = useCart()

  const totalItems = cart.items?.length || 0
  const hasItems = totalItems > 0

  // Footer visibility rules - same as header
  const isHomePage = pathname === "/"
  const shouldShowFooter = !isHomePage || hasItems

  if (!shouldShowFooter) {
    return null
  }

  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-lg inline-flex items-center">
                smiley
                <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional cleaning services that bring joy to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-600 dark:text-gray-400">Regular Cleaning</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">Deep Cleaning</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">Move-in/Move-out</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">Post-Construction</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Phone: (555) 123-4567</li>
              <li>Email: hello@smileybrooms.com</li>
              <li>Hours: Mon-Fri 8AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; 2024{" "}
            <span className="inline-flex items-center">
              smiley
              <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
