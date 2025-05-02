import { Suspense } from "react"
import NotFoundContent from "@/components/not-found-content"

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}
