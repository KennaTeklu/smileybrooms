"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const [countdown, setCountdown] = useState(5)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isClient, router])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20">
          <div className="mb-8">
            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
              404
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Link href="/" passHref>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
              <Home className="mr-3 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20">
        <div className="mb-8">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 animate-pulse">
            404
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-purple-700 dark:text-purple-300 mb-2">
              <Clock className="mr-2 h-5 w-5" />
              <span className="font-semibold">Auto-redirecting in</span>
            </div>
            <div className="text-3xl font-bold text-purple-800 dark:text-purple-200">
              {countdown} second{countdown !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/" passHref>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
              <Home className="mr-3 h-5 w-5" />
              Go to Homepage Now
            </Button>
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400">Or wait for automatic redirect...</p>
        </div>
      </div>
    </div>
  )
}
