import type { Metadata } from "next"
import { DownloadButton } from "@/components/download-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Download Smiley Brooms App",
  description: "Download the Smiley Brooms app for iOS, Android, macOS, Windows, and Linux",
}

export default function DownloadsPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 mb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Download Our Apps</h1>
              <p className="text-xl max-w-2xl text-blue-100">
                Get the Smiley Brooms app on your preferred device for the best cleaning service experience.
              </p>
            </div>
            <div className="flex-shrink-0 animate-bounce">
              <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm">
                <Download className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Available for All Platforms</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Choose your platform below and get started with Smiley Brooms today!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Mobile Apps */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile Apps</CardTitle>
              <CardDescription>Take Smiley Brooms with you on the go</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">iOS App</h3>
                <p className="mb-4 text-sm text-gray-600">For iPhone and iPad devices running iOS 14 or later.</p>
                <DownloadButton platform="ios" className="w-full" />
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Android App</h3>
                <p className="mb-4 text-sm text-gray-600">For Android devices running Android 8.0 or later.</p>
                <DownloadButton platform="android" className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Desktop Apps */}
          <Card>
            <CardHeader>
              <CardTitle>Desktop Apps</CardTitle>
              <CardDescription>Manage your cleaning services from your computer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">macOS App</h3>
                <p className="mb-4 text-sm text-gray-600">For Mac computers running macOS 11.0 (Big Sur) or later.</p>
                <DownloadButton platform="macos" className="w-full" />
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Windows App</h3>
                <p className="mb-4 text-sm text-gray-600">For PCs running Windows 10 or later.</p>
                <DownloadButton platform="windows" className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Linux Apps */}
          <Card>
            <CardHeader>
              <CardTitle>Linux Apps</CardTitle>
              <CardDescription>Open-source support for Linux distributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Linux (AppImage)</h3>
                <p className="mb-4 text-sm text-gray-600">Universal AppImage that works on most Linux distributions.</p>
                <DownloadButton platform="linux-appimage" className="w-full" />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1 rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-semibold">DEB Package</h3>
                  <p className="mb-2 text-xs text-gray-600">For Debian/Ubuntu</p>
                  <DownloadButton platform="linux-deb" size="sm" className="w-full" showIcon={false}>
                    .deb
                  </DownloadButton>
                </div>

                <div className="flex-1 rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-semibold">RPM Package</h3>
                  <p className="mb-2 text-xs text-gray-600">For Fedora/RHEL</p>
                  <DownloadButton platform="linux-rpm" size="sm" className="w-full" showIcon={false}>
                    .rpm
                  </DownloadButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-4 text-2xl font-bold text-blue-800">System Requirements</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 font-semibold text-blue-700">iOS</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
                <li>iOS 14.0 or later</li>
                <li>Compatible with iPhone, iPad, and iPod touch</li>
                <li>200 MB free space</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-blue-700">Android</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
                <li>Android 8.0 or later</li>
                <li>ARM or x86 processor</li>
                <li>150 MB free space</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-blue-700">macOS/Windows</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
                <li>macOS 11.0+ / Windows 10+</li>
                <li>4 GB RAM minimum</li>
                <li>500 MB free space</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-blue-700">Linux</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
                <li>Modern Linux distribution</li>
                <li>X11 or Wayland display server</li>
                <li>4 GB RAM minimum</li>
                <li>500 MB free space</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
