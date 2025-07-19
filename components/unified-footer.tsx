"use client"

import Link from "next/link"
import { SmileyBroomsLogo } from "./smiley-brooms-logo"
import { useToast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function UnifiedFooter() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available soon.",
      variant: "default",
    })
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <SmileyBroomsLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">Smiley Brooms</span>
          </Link>
          <p className="text-sm">
            Your trusted partner for a sparkling clean home. We provide professional and reliable cleaning services
            tailored to your needs.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Residential Cleaning
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Commercial Cleaning
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Deep Cleaning
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Move-in/Move-out Cleaning
              </Link>
            </li>
            <li>
              <button onClick={handleFeatureComingSoon} className="hover:text-white transition-colors text-left">
                Specialty Services
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </li>
            <li>
              <button onClick={handleFeatureComingSoon} className="hover:text-white transition-colors text-left">
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Form
              </Link>
            </li>
            <li>
              <a href="tel:+1-800-555-0199" className="hover:text-white transition-colors">
                Phone: (800) 555-0199
              </a>
            </li>
            <li>
              <a href="mailto:info@smileybrooms.com" className="hover:text-white transition-colors">
                Email: info@smileybrooms.com
              </a>
            </li>
            <li>
              <address className="not-italic">
                123 Clean Street, Suite 456
                <br />
                Sparkle City, SC 12345
              </address>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}
