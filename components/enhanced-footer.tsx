"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/download", label: "Download" },
]

export function EnhancedFooter() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Footer visibility rules:
  // - Homepage: Hidden
  // - Other pages: Show full footer
  if (isHomePage) {
    return null
  }

  const filteredLinks = FOOTER_LINKS.filter((link) => link.href !== pathname)

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
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">SmileyBrooms</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional cleaning services that bring smiles to your home.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {filteredLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Residential Cleaning</li>
              <li>Deep Cleaning</li>
              <li>Move-in/Move-out</li>
              <li>Regular Maintenance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>support@smileybrooms.com</li>
              <li>(555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 SmileyBrooms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
