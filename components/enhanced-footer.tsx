"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function EnhancedFooter() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available shortly.",
      variant: "default",
    })
  }

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 md:py-16 w-full shadow-lg">
      <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 text-sm">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-blue-100">Smiley Brooms</h3>
          <p className="text-blue-200 leading-relaxed">
            Your trusted partner for a sparkling clean home and office. We bring smiles with every sweep!
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-200">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@smileybrooms.com" className="hover:underline">
                info@smileybrooms.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <Phone className="h-4 w-4" />
              <a href="tel:+15551234567" className="hover:underline">
                +1 (555) 123-4567
              </a>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin className="h-4 w-4" />
              <span>We'll come to you!</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-blue-100">Quick Links</h3>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            About Us
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Services
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Careers
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Contact
          </Link>
        </div>

        {/* Legal & Support */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-blue-100">Legal & Support</h3>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Privacy Policy
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            FAQ
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Accessibility
          </Link>
          <Link className="text-blue-200 hover:underline hover:text-white transition-colors" href="#">
            Site Map
          </Link>
        </div>

        {/* Social Media & Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-blue-100">Stay Connected</h3>
          <div className="flex space-x-4">
            <button onClick={handleFeatureComingSoon} aria-label="Facebook">
              <Facebook className="h-6 w-6 text-blue-200 hover:text-white transition-colors" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="Twitter">
              <Twitter className="h-6 w-6 text-blue-200 hover:text-white transition-colors" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="Instagram">
              <Instagram className="h-6 w-6 text-blue-200 hover:text-white transition-colors" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-blue-200 hover:text-white transition-colors" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="YouTube">
              <Youtube className="h-6 w-6 text-blue-200 hover:text-white transition-colors" />
            </button>
          </div>
          <p className="text-blue-200">Subscribe to our newsletter for exclusive offers and updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 rounded-md bg-blue-800/50 border border-blue-700 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            />
            <button
              className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors"
              onClick={handleFeatureComingSoon}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mt-12 text-center text-blue-300 border-t border-blue-500/50 pt-8">
        © {new Date().getFullYear()} Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}
