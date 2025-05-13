"use client"

import { TermsButton } from "@/components/terms-button"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function UnifiedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SmileyBrooms</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional cleaning services with a smile. We make your space shine!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Regular Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Move In/Out Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Office Cleaning
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">123 Cleaning St, Sparkle City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">(602) 800-0605</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">info@smileybrooms.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} SmileyBrooms. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <TermsButton useLink={true} variant="link" className="text-sm text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </footer>
  )
}
