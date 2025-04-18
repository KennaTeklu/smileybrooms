import Link from "next/link"
import { Facebook, Instagram, Twitter, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Smiley Brooms</h3>
            <p className="mt-2 text-sm text-muted-foreground">Professional cleaning services tailored to your needs.</p>
            <div className="mt-4 flex space-x-3">
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground hover:underline">
                  Price Calculator
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground hover:underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground hover:underline">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Smiley Brooms. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
