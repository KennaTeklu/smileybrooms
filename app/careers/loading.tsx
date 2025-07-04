import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-48" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            <Skeleton className="h-5 w-1/2" />
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-px w-full" /> {/* Separator */}
          <div>
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-px w-full" /> {/* Separator */}
          <div>
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-px w-full" /> {/* Separator */}
          <div>
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="mt-10 text-center">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
