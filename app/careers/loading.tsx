import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <Skeleton className="h-48 w-full mb-8" />
      <Skeleton className="h-48 w-full mb-8" />
      <Skeleton className="h-48 w-full mb-8" />
      <Skeleton className="h-48 w-full mb-8" />

      <div className="text-center">
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
    </div>
  )
}
