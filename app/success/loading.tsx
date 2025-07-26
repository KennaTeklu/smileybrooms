import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 text-center">Please wait while we process your request...</p>
        </CardContent>
      </Card>
    </div>
  )
}
