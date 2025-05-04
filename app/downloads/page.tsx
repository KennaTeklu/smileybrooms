"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Apple, SmartphoneIcon as Android, Monitor, Download, Server, AlertCircle, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEnhancedDeviceDetection } from "@/hooks/use-enhanced-device-detection"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DownloadOption {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  url: string
  badge?: string
  version: string
  size: string
  date: string
  os: "ios" | "android" | "macos" | "windows" | "linux"
  compatibility?: string
  features?: string[]
}

export default function DownloadsPage() {
  const deviceInfo = useEnhancedDeviceDetection()
  const [activeTab, setActiveTab] = useState<string>("all")

  const downloadOptions: DownloadOption[] = [
    {
      id: "ios",
      title: "iOS App",
      icon: <Apple className="h-8 w-8" />,
      description: "For iPhone and iPad devices",
      url: "/downloads/smiley-brooms-ios.html",
      badge: "App Store",
      version: "2.1.0",
      size: "45 MB",
      date: "May 1, 2023",
      os: "ios",
      compatibility: "iOS 14.0 or later",
      features: [
        "Book and manage cleaning services",
        "Real-time cleaning tracking",
        "Secure payments",
        "Schedule recurring cleanings",
        "Push notifications",
      ],
    },
    {
      id: "android",
      title: "Android App",
      icon: <Android className="h-8 w-8" />,
      description: "For Android phones and tablets",
      url: "/downloads/smiley-brooms-android.html",
      badge: "Google Play",
      version: "2.1.0",
      size: "42 MB",
      date: "May 1, 2023",
      os: "android",
      compatibility: "Android 8.0 or later",
      features: [
        "Book and manage cleaning services",
        "Real-time cleaning tracking",
        "Secure payments",
        "Schedule recurring cleanings",
        "Push notifications",
      ],
    },
    {
      id: "macos",
      title: "macOS App",
      icon: <Apple className="h-8 w-8" />,
      description: "For Mac computers",
      url: "/downloads/smiley-brooms-macos.html",
      version: "2.0.5",
      size: "68 MB",
      date: "April 15, 2023",
      os: "macos",
      compatibility: "macOS 11.0 (Big Sur) or later",
      features: [
        "Desktop notifications",
        "Calendar integration",
        "Advanced booking management",
        "Detailed service history",
        "Export data to spreadsheets",
      ],
    },
    {
      id: "windows",
      title: "Windows App",
      icon: <Monitor className="h-8 w-8" />,
      description: "For Windows 10 and 11",
      url: "/downloads/smiley-brooms-windows.html",
      version: "2.0.5",
      size: "72 MB",
      date: "April 15, 2023",
      os: "windows",
      compatibility: "Windows 10 or later",
      features: [
        "Desktop notifications",
        "Calendar integration",
        "Advanced booking management",
        "Detailed service history",
        "Export data to spreadsheets",
      ],
    },
    {
      id: "linux",
      title: "Linux App",
      icon: <Server className="h-8 w-8" />,
      description: "For Ubuntu, Debian, and Fedora",
      url: "/downloads/smiley-brooms-linux.html",
      version: "2.0.5",
      size: "65 MB",
      date: "April 15, 2023",
      os: "linux",
      compatibility: "Ubuntu 20.04, Debian 11, Fedora 35 or later",
      features: [
        "Desktop notifications",
        "Calendar integration",
        "Advanced booking management",
        "Detailed service history",
        "Export data to spreadsheets",
      ],
    },
  ]

  // Filter options based on active tab
  const filteredOptions =
    activeTab === "all"
      ? downloadOptions
      : downloadOptions.filter((option) => {
          if (activeTab === "mobile") return ["ios", "android"].includes(option.os)
          if (activeTab === "desktop") return ["macos", "windows", "linux"].includes(option.os)
          return option.os === activeTab
        })

  // Get recommended download based on device detection
  const recommendedDownload = deviceInfo.recommendedDownload
    ? downloadOptions.find((option) => option.os === deviceInfo.recommendedDownload)
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Download Smiley Brooms</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get our app on your favorite device to book and manage cleaning services on the go.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Device Detection Info */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">We detected you're using:</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {deviceInfo.type !== "unknown" && (
                    <span className="inline-flex items-center mr-3">
                      <Badge variant="outline" className="mr-1">
                        {deviceInfo.type === "mobile" ? "Mobile" : deviceInfo.type === "tablet" ? "Tablet" : "Desktop"}
                      </Badge>
                    </span>
                  )}

                  {deviceInfo.os !== "unknown" && (
                    <span className="inline-flex items-center mr-3">
                      <Badge variant="outline" className="mr-1">
                        {deviceInfo.os === "ios"
                          ? "iOS"
                          : deviceInfo.os === "android"
                            ? "Android"
                            : deviceInfo.os === "macos"
                              ? "macOS"
                              : deviceInfo.os === "windows"
                                ? "Windows"
                                : "Linux"}
                        {deviceInfo.osVersion && ` ${deviceInfo.osVersion}`}
                      </Badge>
                    </span>
                  )}

                  {deviceInfo.browser !== "unknown" && (
                    <span className="inline-flex items-center">
                      <Badge variant="outline">
                        {deviceInfo.browser === "chrome"
                          ? "Chrome"
                          : deviceInfo.browser === "firefox"
                            ? "Firefox"
                            : deviceInfo.browser === "safari"
                              ? "Safari"
                              : deviceInfo.browser === "edge"
                                ? "Edge"
                                : "Opera"}
                        {deviceInfo.browserVersion && ` ${deviceInfo.browserVersion}`}
                      </Badge>
                    </span>
                  )}
                </p>
              </div>

              {recommendedDownload && (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href={recommendedDownload.url}>
                    <Download className="mr-2 h-4 w-4" />
                    Download for{" "}
                    {recommendedDownload.os === "ios"
                      ? "iOS"
                      : recommendedDownload.os === "android"
                        ? "Android"
                        : recommendedDownload.os === "macos"
                          ? "macOS"
                          : recommendedDownload.os === "windows"
                            ? "Windows"
                            : "Linux"}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Recommended Download */}
          {recommendedDownload && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Recommended for Your Device</h2>
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-2 border-primary/50 shadow-lg overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {recommendedDownload.icon}
                          <div>
                            <CardTitle>{recommendedDownload.title}</CardTitle>
                            <CardDescription>{recommendedDownload.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {recommendedDownload.badge && (
                            <Badge variant="outline" className="bg-primary/10">
                              {recommendedDownload.badge}
                            </Badge>
                          )}
                          <Badge variant="default" className="bg-green-600">
                            Recommended
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Version</p>
                          <p className="font-medium">{recommendedDownload.version}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Size</p>
                          <p className="font-medium">{recommendedDownload.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Released</p>
                          <p className="font-medium">{recommendedDownload.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Compatibility</p>
                          <p className="font-medium">{recommendedDownload.compatibility}</p>
                        </div>
                      </div>

                      {recommendedDownload.features && (
                        <div>
                          <p className="font-medium mb-2">Key Features:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {recommendedDownload.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <a href={recommendedDownload.url}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Now
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}

          {/* All Downloads */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All Downloads</h2>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 sm:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="ios">iOS</TabsTrigger>
                <TabsTrigger value="android">Android</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOptions.map((option) => (
                <Card
                  key={option.id}
                  className={option.os === deviceInfo.recommendedDownload ? "border-primary/30" : ""}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div>
                          <CardTitle>{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {option.badge && <Badge variant="outline">{option.badge}</Badge>}
                        {option.os === deviceInfo.recommendedDownload && (
                          <Badge variant="default" className="bg-green-600">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Version</p>
                        <p className="font-medium">{option.version}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Size</p>
                        <p className="font-medium">{option.size}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Released</p>
                        <p className="font-medium">{option.date}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant={option.os === deviceInfo.recommendedDownload ? "default" : "outline"}
                      className="w-full"
                    >
                      <a href={option.url}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* System Requirements */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5" /> iOS Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>iOS 14.0 or later</li>
                    <li>Compatible with iPhone, iPad, and iPod touch</li>
                    <li>200 MB free space</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Android className="h-5 w-5" /> Android Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Android 8.0 or later</li>
                    <li>200 MB free space</li>
                    <li>Google Play Services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" /> Desktop Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)</li>
                    <li>4GB RAM</li>
                    <li>500 MB free space</li>
                    <li>Internet connection</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" /> Having Issues?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you're experiencing problems with downloading or installing our app, please try the following:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Make sure your device meets the minimum requirements</li>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Try using a different browser</li>
                  <li>Disable any VPN or proxy services</li>
                </ul>
                <p className="mt-4">
                  Still having issues? Contact our support team at{" "}
                  <a href="tel:6028000605" className="text-primary hover:underline">
                    (602) 800-0605
                  </a>{" "}
                  or{" "}
                  <a href="mailto:support@smileybrooms.com" className="text-primary hover:underline">
                    support@smileybrooms.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
