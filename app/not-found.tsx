import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-7xl font-extrabold text-gray-300 dark:text-gray-700 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <Link href="/" passHref>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl">
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
