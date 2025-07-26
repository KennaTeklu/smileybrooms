import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait</p>
        </CardContent>
      </Card>
    </div>
  )
}
