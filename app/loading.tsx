import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading...</p>
    </div>
  )
}
