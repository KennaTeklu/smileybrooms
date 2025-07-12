import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, Users, DollarSign } from "lucide-react"

export function Features() {
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Smiley Brooms?</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Experience the difference with our professional, reliable, and customer-focused cleaning services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quality Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We stand by our work with a 100% satisfaction guarantee. If you're not happy, we'll make it right.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <Users className="h-10 w-10 text-green-600 mb-4" />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Experienced Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team consists of highly trained, vetted, and friendly cleaning experts.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <Star className="h-10 w-10 text-yellow-500 mb-4" />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Eco-Friendly Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We use only environmentally safe and non-toxic cleaning solutions for a healthier home.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <DollarSign className="h-10 w-10 text-purple-600 mb-4" />
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No hidden fees or surprises. Get an instant, accurate quote for your specific needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
