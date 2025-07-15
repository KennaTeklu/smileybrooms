import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"

export default function MissionVision() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mx-auto p-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 mb-4">
                <Target className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground">
                To provide exceptional, reliable, and eco-friendly cleaning services that create healthier and happier
                environments for our clients, allowing them to focus on what matters most.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mx-auto p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground">
                To be the leading and most trusted cleaning service provider, recognized for our commitment to quality,
                sustainability, and unparalleled customer satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
