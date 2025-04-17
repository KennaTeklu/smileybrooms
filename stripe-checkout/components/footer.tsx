import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold text-white">Smiley Brooms</h3>
            <p className="mt-4">Professional cleaning services for homes and businesses.</p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-primary hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-primary hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 hover:bg-primary hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "Calculator", href: "/calculator" },
                { name: "Pricing", href: "/pricing" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "Regular Cleaning", href: "/services/regular-cleaning" },
                { name: "Deep Cleaning", href: "/services/deep-cleaning" },
                { name: "Move In/Out Cleaning", href: "/services/move-in-out" },
                { name: "Office Cleaning", href: "/services/office-cleaning" },
                { name: "Carpet Cleaning", href: "/services/carpet-cleaning" },
                { name: "Window Cleaning", href: "/services/window-cleaning" },
              ].map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="hover:text-primary hover:underline">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-primary" />
                <span>
                  123 Cleaning Street, Suite 100
                  <br />
                  Sparkle City, SC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary" />
                <span>info@smileybrooms.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {currentYear} Smiley Brooms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
