"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useTranslation } from "@/contexts/translation-context" // Import useTranslation

export function EnhancedFooter() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { t } = useTranslation() // Use the translation hook

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
              <span className="font-bold text-lg">SmileyBrooms</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional cleaning services that bring joy to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("common.quick_links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {t("common.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {t("common.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {t("common.careers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t("common.services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-600 dark:text-gray-400">{t("common.regular_cleaning")}</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">{t("common.deep_cleaning")}</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">{t("common.move_in_out")}</span>
              </li>
              <li>
                <span className="text-gray-600 dark:text-gray-400">{t("common.post_construction")}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">{t("common.contact")}</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t("common.phone")}: (555) 123-4567</li>
              <li>{t("common.email")}: hello@smileybrooms.com</li>
              <li>{t("common.hours")}: Mon-Fri 8AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 SmileyBrooms. {t("common.all_rights_reserved")}</p>
        </div>
      </div>
    </footer>
  )
}
