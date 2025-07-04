import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        <Skeleton className="h-10 w-3/4 mx-auto" />
      </h1>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Skeleton className="h-px w-full" /> {/* Separator */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/5" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          </div>
          <Skeleton className="h-px w-full" /> {/* Separator */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
    </div>
  )
}
