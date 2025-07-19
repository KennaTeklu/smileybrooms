"use client"

import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { SmileyBroomsLogo } from "@/components/smiley-brooms-logo"

export default function UnifiedFooter() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "We're working on this exciting new feature. Stay tuned!",
    })
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
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
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Legal & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <a onClick={handleFeatureComingSoon} className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </a>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </li>
            <li>
              <a onClick={handleFeatureComingSoon} className="hover:text-white transition-colors cursor-pointer">
                Refund Policy
              </a>
            </li>
            <li>
              <a onClick={handleFeatureComingSoon} className="hover:text-white transition-colors cursor-pointer">
                Sitemap
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <a href="mailto:info@smileybrooms.com" className="hover:text-white transition-colors">
                info@smileybrooms.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <a href="tel:+15551234567" className="hover:text-white transition-colors">
                (555) 123-4567
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <span>123 Clean Street, Sparkle City, SC 12345</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">Newsletter</h3>
          <p className="text-sm">Stay updated with our latest offers and cleaning tips.</p>
          <form className="flex gap-2">
            <Input type="email" placeholder="Your email" className="flex-1 bg-gray-800 border-gray-700 text-white" />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <Separator className="my-8 bg-gray-700" />

      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}
