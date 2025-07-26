import { RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <RefreshCw className="h-12 w-12 mx-auto animate-spin text-blue-500" />
            <h2 className="text-xl font-semibold">Loading...</h2>
            <p className="text-gray-600">Please wait while we process your request...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
