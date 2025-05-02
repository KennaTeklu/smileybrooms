"use client"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="text-white" />
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
            {/* App Download Buttons */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">Download Our App</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/download?platform=ios"
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19c-4.3 0-7.8-3.4-7.8-7.8 0-4.3 3.4-7.8 7.8-7.8 4.3 0 7.8 3.4 7.8 7.8 0 4.3-3.4 7.8-7.8 7.8z" />
                    <path d="M12 19V5" />
                    <path d="M5 12h14" />
                  </svg>
                  iOS
                </a>
                <a
                  href="/download?platform=android"
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                  Android
                </a>
                <a
                  href="/download?platform=macos"
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 22h6" />
                    <path d="M2 8.5A2.5 2.5 0 0 1 4.5 6h15A2.5 2.5 0 0 1 22 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-9z" />
                    <path d="M12 6v16" />
                  </svg>
                  macOS
                </a>
                <a
                  href="/download?platform=windows"
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Windows
                </a>
              </div>
              <div className="mt-3">
                <a
                  href="/download?platform=linux-appimage"
                  className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    <path d="M8 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
                    <path d="M7 10v4" />
                    <path d="M17 10v4" />
                  </svg>
                  Linux
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-center p-4">&copy; {currentYear} Smiley Brooms. All rights reserved.</div>
    </footer>
  )
}
