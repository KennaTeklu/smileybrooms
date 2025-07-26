import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we process your request.</p>
      </div>
    </div>
  )
}
