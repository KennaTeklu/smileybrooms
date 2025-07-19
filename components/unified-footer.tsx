"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UnifiedFooter() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available shortly.",
      variant: "default",
    })
  }

  return (
    <footer className="bg-gray-900 text-gray-200 p-8 md:py-16 w-full shadow-lg">
      <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 text-sm">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-white">
            smiley<span className="bg-yellow-300 text-gray-900 px-1 rounded">brooms</span>
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Dedicated to providing exceptional cleaning services with a focus on customer satisfaction and eco-friendly
            practices.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4 text-blue-400" />
              <a href="mailto:info@smileybrooms.com" className="hover:underline text-blue-300">
                info@smileybrooms.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone className="h-4 w-4 text-blue-400" />
              <a href="tel:+15551234567" className="hover:underline text-blue-300">
                +1 (555) 123-4567
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>We'll come to you!</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-white">Services & Info</h3>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Residential Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Commercial Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Deep Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Pricing Calculator
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            How It Works
          </Link>
        </div>

        {/* Legal & Resources */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-white">Legal & Resources</h3>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Privacy Policy
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Cookie Policy
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            FAQ
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Careers
          </Link>
        </div>

        {/* Social Media & Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-white">Connect With Us</h3>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Facebook">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-400 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Twitter">
              <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-300 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Instagram">
              <Instagram className="h-6 w-6 text-gray-400 hover:text-pink-400 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="YouTube">
              <Youtube className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" />
            </Button>
          </div>
          <p className="text-gray-400">Stay updated with our latest news and offers.</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleFeatureComingSoon}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mt-12 text-center text-gray-500 border-t border-gray-700 pt-8">
        © {new Date().getFullYear()} Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}
