import { Target, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MissionVision() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="p-6 shadow-sm">
        <CardContent className="flex flex-col items-center text-center">
          <Target className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-700 dark:text-gray-300">
            To provide unparalleled cleaning services that create healthier, happier, and more productive environments
            for our clients, delivered with a smile and a commitment to excellence.
          </p>
        </CardContent>
      </Card>
      <Card className="p-6 shadow-sm">
        <CardContent className="flex flex-col items-center text-center">
          <Eye className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
          <p className="text-gray-700 dark:text-gray-300">
            To be the leading and most trusted cleaning service provider, recognized for our innovative solutions,
            sustainable practices, and unwavering dedication to customer satisfaction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
